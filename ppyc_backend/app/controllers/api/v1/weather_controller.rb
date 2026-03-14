class Api::V1::WeatherController < Api::V1::BaseController
  require 'net/http'
  require 'uri'
  require 'json'

  # GET /api/v1/weather/current?location=Winthrop,MA
  def current
    location = params[:location] || 'Winthrop, MA'

    begin
      data = fetch_weather_data('current', location)

      # Format the response to match what the frontend expects
      response = {
        temperature: data['current']['temp_f'],
        condition: data['current']['condition']['text'],
        wind_speed: data['current']['wind_mph'],
        wind_direction: data['current']['wind_dir'],
        humidity: data['current']['humidity'],
        feels_like: data['current']['feelslike_f'],
        uv_index: data['current']['uv'],
        icon_url: data['current']['condition']['icon']
      }

      render_success(response)
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render_error('Weather data unavailable', :service_unavailable)
    end
  end

  # GET /api/v1/weather/forecast?location=Winthrop,MA&days=3
  def forecast
    location = params[:location] || 'Winthrop, MA'
    days = (params[:days] || 3).to_i

    begin
      data = fetch_weather_data('forecast', location, days: days)

      # Format the forecast response
      response = {
        location: data['location']['name'],
        forecasts: data['forecast']['forecastday'].map do |day|
          {
            date: day['date'],
            max_temp: day['day']['maxtemp_f'],
            min_temp: day['day']['mintemp_f'],
            condition: day['day']['condition']['text'],
            icon_url: day['day']['condition']['icon'],
            chance_of_rain: day['day']['daily_chance_of_rain'],
            sunrise: day['astro']['sunrise'],
            sunset: day['astro']['sunset']
          }
        end
      }

      render_success(response)
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render_error('Weather forecast unavailable', :service_unavailable)
    end
  end

  # GET /api/v1/weather/marine?location=Winthrop,MA&days=3
  def marine
    location = params[:location] || 'Winthrop, MA'
    days = (params[:days] || 3).to_i

    begin
      data = fetch_weather_data('marine', location, days: days)

      # Debug: log marine response structure in development (wave/swell/tides depend on plan & location)
      if Rails.env.development? && data['forecast'] && data['forecast']['forecastday']&.first
        fd = data['forecast']['forecastday'].first
        Rails.logger.info "[Marine API] location=#{location} days=#{days} forecastday_keys=#{fd.keys.inspect} hour_count=#{fd['hour']&.size} first_hour_keys=#{fd['hour']&.first&.keys&.inspect} tides_count=#{fd['tides']&.size}"
      end

      # Format the marine response (day-level + first-hour wave/swell when available + tides)
      response = {
        location: data['location']['name'],
        forecasts: data['forecast']['forecastday'].map do |day|
          raw_tides = day['tides']
          tide_list = raw_tides.is_a?(Array) ? raw_tides : (raw_tides.is_a?(Hash) ? raw_tides.values : [])
          tides = tide_list.map do |t|
            {
              time: t['tide_time'],
              height_mt: t['tide_height_mt'],
              type: t['tide_type']
            }
          end
          # Wave/swell: day level first, then from first available hour (marine API puts wave/swell in hour element)
          # Tides and marine hour data depend on WeatherAPI subscription and coastal location (lat/lon often works better).
          raw_hours = day['hour']
          hours = case raw_hours
                  when Array then raw_hours
                  when Hash then raw_hours.values
                  else []
                  end
          day_obj = day['day'] || {}
          first_hour = hours.first
          first_hour_with_wave = hours.find { |h| h.key?('sig_ht_mt') && !h['sig_ht_mt'].nil? }
          first_hour_with_swell = hours.find { |h| (h['swell_ht_ft'].present? || (h.key?('swell_ht_mt') && !h['swell_ht_mt'].nil?)) }
          first_hour_with_wave ||= first_hour
          first_hour_with_swell ||= first_hour
          wave_height = day_obj['wave_height_ft'].presence
          wave_height ||= (first_hour_with_wave && first_hour_with_wave['sig_ht_mt'] && (first_hour_with_wave['sig_ht_mt'].to_f * 3.28084).round(1))
          wave_direction = day_obj['wave_dir_16_point'].presence || first_hour_with_wave&.dig('swell_dir_16_point')
          swell_height = day_obj['swell_height_ft'].presence || first_hour_with_swell&.dig('swell_ht_ft')
          swell_height ||= (first_hour_with_swell && first_hour_with_swell['swell_ht_mt'] && (first_hour_with_swell['swell_ht_mt'].to_f * 3.28084).round(1))
          swell_direction = day_obj['swell_dir_16_point'].presence || first_hour_with_swell&.dig('swell_dir_16_point')
          {
            date: day['date'],
            wave_height: wave_height,
            wave_direction: wave_direction,
            swell_height: swell_height,
            swell_direction: swell_direction,
            wind_speed: day_obj['maxwind_mph'],
            wind_direction: day_obj['wind_dir'],
            temperature: day_obj['maxtemp_f'],
            condition: day_obj.dig('condition', 'text'),
            icon_url: day_obj.dig('condition', 'icon'),
            visibility_miles: day_obj['avgvis_miles'],
            tides: tides
          }
        end
      }

      render_success(response)
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render_error('Marine forecast unavailable', :service_unavailable)
    end
  end

  # GET /api/v1/weather/marine_debug?location=42.36,-71.05
  # Development only: returns a summary of what the Marine API actually returned
  # (hour count, first hour's marine fields, tides) so you can verify free tier.
  def marine_debug
    unless Rails.env.development?
      render json: { error: 'Not available' }, status: :not_found
      return
    end
    location = params[:location] || '42.36,-71.05'
    days = (params[:days] || 3).to_i
    data = fetch_weather_data('marine', location, days: days)
    fd = data.dig('forecast', 'forecastday')&.first
    hours = fd&.dig('hour')
    # API can return hour as array or as object (e.g. "0" => {...}); normalize to array
    hour_list = hours.is_a?(Array) ? hours : (hours.is_a?(Hash) ? hours.values : [])
    first_hour = hour_list.first
    tides = fd&.dig('tides')
    tide_list = tides.is_a?(Array) ? tides : (tides.is_a?(Hash) ? tides.values : [])

    summary = {
      location: data.dig('location', 'name'),
      requested: location,
      forecastday_count: data.dig('forecast', 'forecastday')&.size,
      first_day: fd ? {
        date: fd['date'],
        day_keys: fd['day']&.keys,
        hour_count: hour_list.size,
        hour_is_array: hours.is_a?(Array),
        tides_count: tide_list.size,
        first_hour: first_hour ? {
          time: first_hour['time'],
          sig_ht_mt: first_hour['sig_ht_mt'],
          swell_ht_mt: first_hour['swell_ht_mt'],
          swell_ht_ft: first_hour['swell_ht_ft'],
          swell_dir: first_hour['swell_dir'],
          swell_dir_16_point: first_hour['swell_dir_16_point'],
          swell_period_secs: first_hour['swell_period_secs'],
          vis_miles: first_hour['vis_miles'],
          vis_km: first_hour['vis_km'],
          gust_mph: first_hour['gust_mph'],
          wind_mph: first_hour['wind_mph'],
          wind_dir: first_hour['wind_dir']
        } : nil,
        first_tides: tide_list.first(4)
      } : nil
    }
    render json: summary
  rescue => e
    render json: { error: e.message, backtrace: e.backtrace&.first(3) }, status: 500
  end

  private

  def fetch_weather_data(endpoint, location, options = {})
    api_key = ENV['WEATHER_API_KEY']

    if api_key.blank?
      Rails.logger.error 'Weather API key not configured'
      raise 'Weather API key not configured'
    end

    base_url = 'https://api.weatherapi.com/v1'

    case endpoint
    when 'current'
      url = "#{base_url}/current.json?key=#{api_key}&q=#{location}&aqi=yes"
    when 'forecast'
      days = options[:days] || 3
      url = "#{base_url}/forecast.json?key=#{api_key}&q=#{location}&days=#{days}&aqi=yes&alerts=yes"
    when 'marine'
      days = options[:days] || 3
      url = "#{base_url}/marine.json?key=#{api_key}&q=#{location}&days=#{days}&tides=yes"
    else
      raise "Unknown weather endpoint: #{endpoint}"
    end

    uri = URI(url)
    response = Net::HTTP.get_response(uri)

    if response.code == '200'
      JSON.parse(response.body)
    else
      Rails.logger.error "Weather API returned #{response.code}: #{response.body}"
      raise "Weather API returned #{response.code}"
    end
  end
end
