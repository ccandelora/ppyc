import React, { useState, useEffect, useCallback } from 'react';
import { weatherAPI } from '../services/api';
import { useApiCache } from '../hooks/useApiCache';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [marineData, setMarineData] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  // Memoize callback functions
  const onWeatherSuccess = useCallback((data) => {
    setWeatherData(data.data);
    setIsInitialLoad(false);
  }, []);

  const onWeatherError = useCallback((err) => {
    setError('Failed to fetch weather data');
    console.error('Weather API error:', err);
    setIsInitialLoad(false);
  }, []);

  const onMarineSuccess = useCallback((data) => {
    setMarineData(data.data);
  }, []);

  const onMarineError = useCallback((marineError) => {
    console.log('Marine data not available for this location:', marineError.message);
  }, []);

  // Use cached API calls for weather data
  useApiCache(
    () => weatherAPI.getCurrent(),
    'weather-current',
    {
      ttl: 10 * 60 * 1000, // 10 minutes cache for weather
      onSuccess: onWeatherSuccess,
      onError: onWeatherError
    }
  );

  // Use cached API call for marine data
  useApiCache(
    () => weatherAPI.getMarine(),
    'weather-marine',
    {
      ttl: 15 * 60 * 1000, // 15 minutes cache for marine data
      onSuccess: onMarineSuccess,
      onError: onMarineError
    }
  );

  // Set up interval for cache refresh (weather data updates frequently)
  useEffect(() => {
    const interval = setInterval(() => {
      // The cache will handle refreshing automatically when TTL expires
      // This just ensures we check periodically
      setIsInitialLoad(true);
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => clearInterval(interval);
  }, []);

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <i className="fas fa-exclamation-triangle text-4xl mb-4 text-yellow-400"></i>
          <p className="text-xl">Weather data unavailable</p>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, location: loc } = weatherData;
  const forecast = weatherData.forecast?.forecastday?.[0];
  const marine = marineData?.forecast?.forecastday?.[0];

  return (
    <div className="w-full max-w-6xl mx-auto text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Current Weather */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{loc.name}</h2>
            <p className="text-lg text-white/80 mb-6">{loc.region}, {loc.country}</p>
            
            <div className="flex items-center justify-center mb-6">
              <img 
                src={`https:${current.condition.icon}`} 
                alt={current.condition.text}
                className="w-24 h-24 mr-4"
              />
              <div className="text-left">
                <div className="text-6xl font-bold">{Math.round(current.temp_f)}°F</div>
                <div className="text-xl text-white/80">{current.condition.text}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 p-3 rounded-xl">
                <div className="text-white/60">Feels Like</div>
                <div className="text-xl font-semibold">{Math.round(current.feelslike_f)}°F</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <div className="text-white/60">Humidity</div>
                <div className="text-xl font-semibold">{current.humidity}%</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <div className="text-white/60">Wind</div>
                <div className="text-xl font-semibold">{current.wind_mph} mph {current.wind_dir}</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <div className="text-white/60">Visibility</div>
                <div className="text-xl font-semibold">{current.vis_miles} mi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marine Conditions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <i className="fas fa-anchor mr-2"></i>Marine Conditions
          </h3>
          
          {marine ? (
            <div className="space-y-4">
              {/* Tides */}
              {marine.tides && marine.tides.length > 0 && (
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="text-white/60 mb-2">Next Tide</div>
                  <div className="text-lg font-semibold">
                    {marine.tides[0].tide[0]?.tide_type} at {marine.tides[0].tide[0]?.tide_time}
                  </div>
                  <div className="text-sm text-white/80">
                    Height: {marine.tides[0].tide[0]?.tide_height_mt}m
                  </div>
                </div>
              )}
              
              {/* Wave Height */}
              {marine.day && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <div className="text-white/60">Wave Height</div>
                    <div className="text-lg font-semibold">{marine.day.maxwave_height_mt}m</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <div className="text-white/60">Water Temp</div>
                    <div className="text-lg font-semibold">{Math.round(marine.day.avgtemp_f)}°F</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <div className="text-white/60">Pressure</div>
                  <div className="text-lg font-semibold">{current.pressure_in} in</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <div className="text-white/60">UV Index</div>
                  <div className="text-lg font-semibold">{current.uv}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-white/60">
                Marine data not available for this location
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Forecast */}
      {forecast && (
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold mb-6 text-center">Today's Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-white/60">High</div>
              <div className="text-2xl font-bold">{Math.round(forecast.day.maxtemp_f)}°F</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">Low</div>
              <div className="text-2xl font-bold">{Math.round(forecast.day.mintemp_f)}°F</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">Rain Chance</div>
              <div className="text-2xl font-bold">{forecast.day.daily_chance_of_rain}%</div>
            </div>
            <div className="text-center">
              <div className="text-white/60">Max Wind</div>
              <div className="text-2xl font-bold">{Math.round(forecast.day.maxwind_mph)} mph</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Update time */}
      <div className="mt-4 text-center text-white/60 text-sm">
        Last updated: {new Date(current.last_updated).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherWidget; 