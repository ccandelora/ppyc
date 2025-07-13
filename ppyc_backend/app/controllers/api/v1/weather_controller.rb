class Api::V1::WeatherController < Api::V1::BaseController
  require 'net/http'
  require 'uri'
  require 'json'

  # GET /api/v1/weather/current?location=Boston,MA
  def current
    location = params[:location] || 'Boston,MA'

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

  # GET /api/v1/weather/forecast?location=Boston,MA&days=3
  def forecast
    location = params[:location] || 'Boston,MA'
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

  # GET /api/v1/weather/marine?location=Boston,MA&days=3
  def marine
    location = params[:location] || 'Boston,MA'
    days = (params[:days] || 3).to_i

    begin
      data = fetch_weather_data('marine', location, days: days)

      # Format the marine response
      response = {
        location: data['location']['name'],
        forecasts: data['forecast']['forecastday'].map do |day|
          {
            date: day['date'],
            swell_height: day['day']['swell_height_ft'],
            swell_direction: day['day']['swell_dir_16_point'],
            wave_height: day['day']['wave_height_ft'],
            wind_speed: day['day']['maxwind_mph'],
            wind_direction: day['day']['wind_dir'],
            temperature: day['day']['maxtemp_f'],
            condition: day['day']['condition']['text'],
            icon_url: day['day']['condition']['icon']
          }
        end
      }

      render_success(response)
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render_error('Marine forecast unavailable', :service_unavailable)
    end
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
      url = "#{base_url}/marine.json?key=#{api_key}&q=#{location}&days=#{days}"
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
