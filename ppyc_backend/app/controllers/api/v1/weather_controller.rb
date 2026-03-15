class Api::V1::WeatherController < Api::V1::BaseController
  require 'net/http'
  require 'uri'
  require 'json'
  require 'time'

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
      tidecheck_data = fetch_tidecheck_data(location, days)
      response = format_tidecheck_marine_response(tidecheck_data, location, days)

      # TideCheck excels at tides/astronomical data; blend in WeatherAPI marine
      # wave/swell/wind fields so the UI can show a complete marine card.
      begin
        weather_data = fetch_weatherapi_marine_cached(location, days)
        weather_response = format_weatherapi_marine_response(weather_data, location, days)
        response = merge_weatherapi_fields(response, weather_response)
      rescue => blend_error
        Rails.logger.warn "WeatherAPI blend for marine data failed: #{blend_error.class} #{blend_error.message}"
      end

      render_success(response)
    rescue => e
      Rails.logger.warn "TideCheck marine fetch failed, falling back to WeatherAPI: #{e.class} #{e.message}"
      begin
        weather_data = fetch_weather_data('marine', location, days: days)
        render_success(format_weatherapi_marine_response(weather_data, location, days))
      rescue => fallback_error
        Rails.logger.error "Marine API fallback failed: #{fallback_error.class} #{fallback_error.message}"
        render_error('Marine forecast unavailable', :service_unavailable)
      end
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

  def format_weatherapi_marine_response(data, _location, days)
    # Debug: log marine response structure in development (wave/swell/tides depend on plan & location)
    if Rails.env.development? && data['forecast'] && data['forecast']['forecastday']&.first
      fd = data['forecast']['forecastday'].first
      Rails.logger.info "[Marine API] forecastday_keys=#{fd.keys.inspect} hour_count=#{fd['hour']&.size} first_hour_keys=#{fd['hour']&.first&.keys&.inspect} tides_count=#{fd['tides']&.size}"
    end

    {
      source: 'weatherapi',
      location: data['location']['name'],
      forecasts: data['forecast']['forecastday'].first(days).map do |day|
        raw_tides = day['tides']
        tide_list = raw_tides.is_a?(Array) ? raw_tides : (raw_tides.is_a?(Hash) ? raw_tides.values : [])
        tides = tide_list.map do |t|
          {
            time: t['tide_time'],
            height_mt: t['tide_height_mt'],
            type: t['tide_type']
          }
        end

        # Wave/swell: day level first, then from first available hour.
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
  end

  def format_tidecheck_marine_response(data, location, days)
    daily_conditions = Array(data['dailyConditions'])
    forecasts_by_date = {}
    all_extremes = Array(data['extremes'])
    now = Time.current

    daily_conditions.each do |day|
      date = day['date']
      forecasts_by_date[date] = {
        date: date,
        wave_height: nil,
        wave_direction: nil,
        swell_height: nil,
        swell_direction: nil,
        wind_speed: nil,
        wind_direction: nil,
        temperature: nil,
        condition: nil,
        icon_url: nil,
        visibility_miles: nil,
        tides: [],
        sunrise: day['sunrise'],
        sunset: day['sunset'],
        moon_phase: day['moonPhase'],
        moon_illumination: day['moonIllumination'],
        solunar_label: day['solunarLabel'],
        spring_neap: day['springNeap']
      }
    end

    all_extremes.each do |extreme|
      date = extreme['localDate'] || extreme['time']&.to_date&.iso8601
      next if date.blank?

      forecasts_by_date[date] ||= {
        date: date,
        wave_height: nil,
        wave_direction: nil,
        swell_height: nil,
        swell_direction: nil,
        wind_speed: nil,
        wind_direction: nil,
        temperature: nil,
        condition: nil,
        icon_url: nil,
        visibility_miles: nil,
        tides: []
      }

      forecasts_by_date[date][:tides] << {
        time: extreme['time'],
        height_mt: extreme['height'],
        type: extreme['type']
      }
    end

    forecasts = forecasts_by_date.values.sort_by { |forecast| forecast[:date] }.first(days)
    forecasts.each do |forecast|
      forecast[:tides] = forecast[:tides].sort_by { |t| t[:time].to_s }
      heights = forecast[:tides].map { |t| t[:height_mt] }.compact
      forecast[:tidal_range_mt] = heights.any? ? (heights.max - heights.min).round(3) : nil
    end

    future_extremes = all_extremes
      .map do |extreme|
        parsed = parse_iso_time(extreme['time'])
        next nil unless parsed
        { time: extreme['time'], parsed_time: parsed, type: extreme['type'], height_mt: extreme['height'] }
      end
      .compact
      .select { |extreme| extreme[:parsed_time] >= now }
      .sort_by { |extreme| extreme[:parsed_time] }

    next_high = future_extremes.find { |extreme| extreme[:type] == 'high' }
    next_low = future_extremes.find { |extreme| extreme[:type] == 'low' }

    trend = derive_tide_trend(Array(data['timeSeries']), now)

    {
      source: 'tidecheck',
      location: data.dig('station', 'name') || data.dig('station', 'region') || location,
      station: {
        id: data.dig('station', 'id'),
        timezone: data.dig('station', 'timezone'),
        datum: data['datum']
      },
      conditions: {
        sunrise: data.dig('conditions', 'sunrise'),
        sunset: data.dig('conditions', 'sunset'),
        moon_phase: data.dig('conditions', 'moonPhase'),
        moon_illumination: data.dig('conditions', 'moonIllumination'),
        spring_neap: data.dig('conditions', 'springNeap'),
        tidal_strength: data.dig('conditions', 'tidalStrength')
      },
      next_tides: {
        high: next_high&.slice(:time, :height_mt),
        low: next_low&.slice(:time, :height_mt)
      },
      trend: trend,
      forecasts: forecasts
    }
  end

  def derive_tide_trend(time_series, now)
    points = time_series
      .map do |point|
        parsed = parse_iso_time(point['time'])
        next nil unless parsed
        { time: point['time'], parsed_time: parsed, height: point['height']&.to_f }
      end
      .compact
      .select { |point| !point[:height].nil? }
      .sort_by { |point| point[:parsed_time] }

    return { state: nil, current_height_mt: nil } if points.size < 2

    prev_point = points.reverse.find { |point| point[:parsed_time] <= now } || points[-2]
    next_point = points.find { |point| point[:parsed_time] > prev_point[:parsed_time] } || points[-1]
    return { state: nil, current_height_mt: prev_point[:height]&.round(3) } if prev_point == next_point

    delta = next_point[:height] - prev_point[:height]
    state = if delta > 0.01
              'rising'
            elsif delta < -0.01
              'falling'
            else
              'slack'
            end

    {
      state: state,
      current_height_mt: prev_point[:height]&.round(3),
      sampled_at: prev_point[:time]
    }
  end

  def parse_iso_time(value)
    return nil if value.blank?
    Time.iso8601(value)
  rescue ArgumentError
    nil
  end

  def merge_weatherapi_fields(tidecheck_response, weatherapi_response)
    merged = tidecheck_response.deep_dup
    weather_by_date = Array(weatherapi_response[:forecasts]).index_by { |day| day[:date] || day['date'] }

    merged[:forecasts] = Array(merged[:forecasts]).map do |day|
      weather_day = weather_by_date[day[:date]]
      next day unless weather_day

      day.merge(
        wave_height: day[:wave_height].presence || weather_day[:wave_height],
        wave_direction: day[:wave_direction].presence || weather_day[:wave_direction],
        swell_height: day[:swell_height].presence || weather_day[:swell_height],
        swell_direction: day[:swell_direction].presence || weather_day[:swell_direction],
        wind_speed: day[:wind_speed].presence || weather_day[:wind_speed],
        wind_direction: day[:wind_direction].presence || weather_day[:wind_direction],
        temperature: day[:temperature].presence || weather_day[:temperature],
        condition: day[:condition].presence || weather_day[:condition],
        icon_url: day[:icon_url].presence || weather_day[:icon_url],
        visibility_miles: day[:visibility_miles].presence || weather_day[:visibility_miles]
      )
    end

    merged[:source] = 'tidecheck+weatherapi'
    merged
  end

  def fetch_tidecheck_data(location, days)
    api_key = ENV['TIDECHECK_API_KEY']
    station_id = ENV['TIDECHECK_STATION_ID']
    datum = ENV.fetch('TIDECHECK_DATUM', 'MLLW')

    raise 'TideCheck API key not configured' if api_key.blank?
    raise 'TideCheck station ID not configured' if station_id.blank?

    normalized_days = [[days.to_i, 1].max, 7].min
    cache_key = "tidecheck:tides:v1:station:#{station_id}:days:#{normalized_days}:datum:#{datum}"

    marine_cache_fetch(cache_key, expires_in: 6.hours) do
      uri = URI("https://tidecheck.com/api/station/#{station_id}/tides")
      uri.query = URI.encode_www_form(days: normalized_days, datum: datum)
      request = Net::HTTP::Get.new(uri)
      request['X-API-Key'] = api_key

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        http.request(request)
      end

      unless response.code == '200'
        raise "TideCheck returned #{response.code}: #{response.body}"
      end

      payload = JSON.parse(response.body)
      Rails.logger.info "[TideCheck] cached tides for station=#{station_id} location=#{location} days=#{normalized_days}"
      payload
    end
  end

  def fetch_weatherapi_marine_cached(location, days)
    normalized_days = [[days.to_i, 1].max, 7].min
    normalized_location = location.to_s.strip.downcase
    cache_key = "weatherapi:marine:v1:location:#{normalized_location}:days:#{normalized_days}"

    marine_cache_fetch(cache_key, expires_in: 1.hour) do
      fetch_weather_data('marine', location, days: normalized_days)
    end
  end

  def marine_cache_fetch(key, expires_in:)
    # Development may run with NullStore; keep an in-process cache to avoid
    # exhausting low-rate external API quotas while iterating.
    if Rails.cache.is_a?(ActiveSupport::Cache::NullStore)
      self.class.marine_memory_cache ||= {}
      entry = self.class.marine_memory_cache[key]
      if entry && entry[:expires_at] > Time.current
        return entry[:value]
      end

      value = yield
      self.class.marine_memory_cache[key] = {
        value: value,
        expires_at: Time.current + expires_in
      }
      return value
    end

    Rails.cache.fetch(key, expires_in: expires_in, race_condition_ttl: 30.seconds) do
      yield
    end
  end

  class << self
    attr_accessor :marine_memory_cache
  end

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
