class Api::V1::WeatherController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  # GET /api/v1/weather/current?location=Boston,MA
  def current
    location = params[:location] || 'Boston,MA'

    begin
      weather_data = fetch_weather_data('current', location)
      render json: weather_data
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render json: { error: 'Weather data unavailable' }, status: :service_unavailable
    end
  end

  # GET /api/v1/weather/forecast?location=Boston,MA&days=3
  def forecast
    location = params[:location] || 'Boston,MA'
    days = params[:days] || 3

    begin
      weather_data = fetch_weather_data('forecast', location, days: days)
      render json: weather_data
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render json: { error: 'Weather data unavailable' }, status: :service_unavailable
    end
  end

  # GET /api/v1/weather/marine?location=Boston,MA&days=3
  def marine
    location = params[:location] || 'Boston,MA'
    days = params[:days] || 3

    begin
      weather_data = fetch_weather_data('marine', location, days: days)
      render json: weather_data
    rescue => e
      Rails.logger.error "Weather API Error: #{e.message}"
      render json: { error: 'Weather data unavailable' }, status: :service_unavailable
    end
  end

  private

  def fetch_weather_data(endpoint, location, options = {})
    api_key = ENV['WEATHER_API_KEY']

    if api_key.blank?
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
      raise "Weather API returned #{response.code}: #{response.body}"
    end
  end
end
