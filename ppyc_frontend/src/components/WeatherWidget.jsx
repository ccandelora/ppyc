import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { useApiCache } from '../hooks/useApiCache';
import { weatherAPI } from '../services/api';

const WeatherWidget = ({ className = '', showMarine = false }) => {
  const { data: weatherResponse, isLoading: weatherLoading, error: weatherError } = useApiCache(weatherAPI.getCurrent, 'weather-current', { ttl: 300000 });
  const { data: marineResponse, isLoading: marineLoading, error: marineError } = useApiCache(weatherAPI.getMarine, 'weather-marine', { ttl: 600000 });

  // The weather data is in the response.data
  const weather = weatherResponse?.data;
  const marine = marineResponse?.data;

  if (weatherLoading || (showMarine && marineLoading)) {
    return (
      <div className={`text-white flex items-center ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-4" />
        Loading weather...
      </div>
    );
  }

  if (weatherError || (showMarine && marineError)) {
    return (
      <div className={`text-red-400 flex items-center ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="mr-4" />
        Weather unavailable
      </div>
    );
  }

  if (!weather || (showMarine && !marine)) {
    return (
      <div className={`text-gray-400 flex items-center ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.INFO} className="mr-4" />
        No weather data
      </div>
    );
  }

  const getWeatherIcon = (condition) => {
    if (!condition) return ICON_NAMES.SUN;
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return ICON_NAMES.RAIN;
    if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return ICON_NAMES.CLOUD;
    if (conditionLower.includes('snow')) return ICON_NAMES.SNOW;
    if (conditionLower.includes('thunder')) return ICON_NAMES.THUNDER;
    if (conditionLower.includes('wind')) return ICON_NAMES.WIND;
    if (conditionLower.includes('fog')) return ICON_NAMES.FOG;
    return ICON_NAMES.SUN;
  };

  // Get today's marine forecast
  const todayMarine = marine?.forecasts?.[0] || {};

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Current Conditions */}
      <div className="flex items-center space-x-6">
        {/* Temperature */}
        <div className="flex items-center text-white">
          <FontAwesomeIcon
            icon={getWeatherIcon(weather.condition)}
            className="mr-3 text-yellow-400 text-4xl"
          />
          <span className="text-4xl">{weather.temperature ? `${Math.round(weather.temperature)}°F` : 'N/A'}</span>
        </div>

        {/* Current Weather */}
        <div className="text-gray-300">
          {weather.condition}
        </div>
      </div>

      {/* Marine Conditions */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-lg">
        {/* Current Wind */}
        <div className="flex items-center text-white">
          <FontAwesomeIcon icon={ICON_NAMES.WIND} className="mr-3 text-blue-400" />
          <span>Wind: {weather.wind_speed ? `${Math.round(weather.wind_speed)} mph ${weather.wind_direction}` : 'N/A'}</span>
        </div>

        {/* Wave Height */}
        {todayMarine.wave_height && (
          <div className="flex items-center text-white">
            <FontAwesomeIcon icon={ICON_NAMES.WATER} className="mr-3 text-blue-400" />
            <span>Waves: {Math.round(todayMarine.wave_height)} ft</span>
          </div>
        )}

        {/* Swell Height */}
        {todayMarine.swell_height && (
          <div className="flex items-center text-white">
            <FontAwesomeIcon icon={ICON_NAMES.WAVE} className="mr-3 text-blue-400" />
            <span>Swell: {Math.round(todayMarine.swell_height)} ft {todayMarine.swell_direction}</span>
          </div>
        )}

        {/* Humidity */}
        <div className="flex items-center text-white">
          <FontAwesomeIcon icon={ICON_NAMES.DROPLET} className="mr-3 text-blue-400" />
          <span>Humidity: {weather.humidity ? `${Math.round(weather.humidity)}%` : 'N/A'}</span>
        </div>

        {/* Feels Like */}
        <div className="flex items-center text-white">
          <FontAwesomeIcon icon={ICON_NAMES.THERMOMETER} className="mr-3 text-yellow-400" />
          <span>Feels like: {weather.feels_like ? `${Math.round(weather.feels_like)}°F` : 'N/A'}</span>
        </div>

        {/* UV Index */}
        <div className="flex items-center text-white">
          <FontAwesomeIcon icon={ICON_NAMES.SUN} className="mr-3 text-yellow-400" />
          <span>UV Index: {weather.uv_index || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget; 