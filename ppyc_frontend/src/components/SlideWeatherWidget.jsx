import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { useApiCache } from '../hooks/useApiCache';
import api from '../services/api';

const cacheKeySlug = (location, type) =>
  `${(location || 'default').replace(/[^a-zA-Z0-9.-]/g, '_')}_${type}`;

const formatLocalDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SlideWeatherWidget = ({ location, weatherType, className = '' }) => {
  const effectiveLocation = (location && location.trim()) || 'Winthrop, MA';
  const slug = cacheKeySlug(effectiveLocation, 'forecast');

  const forecastCall = () =>
    api.get('/weather/forecast', { params: { location: effectiveLocation, days: 3 } });

  const { data: response, isLoading, error } = useApiCache(forecastCall, `weather-slide-${slug}`, {
    ttl: 5 * 60 * 1000
  });

  const data = response?.data;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center text-white ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-4 text-4xl" />
        <span className="text-3xl">Loading weather...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`flex items-center justify-center text-red-300 ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="mr-4 text-4xl" />
        <span className="text-3xl">Weather unavailable</span>
      </div>
    );
  }

  const getWeatherVisual = (condition) => {
    if (!condition) {
      return { icon: ICON_NAMES.SUN, colorClass: 'text-yellow-400' };
    }

    const c = condition.toLowerCase();

    if (c.includes('thunder') || c.includes('storm') || c.includes('lightning')) {
      return { icon: ICON_NAMES.THUNDER, colorClass: 'text-purple-300' };
    }
    if (c.includes('snow') || c.includes('ice') || c.includes('sleet') || c.includes('blizzard') || c.includes('freezing')) {
      return { icon: ICON_NAMES.SNOW, colorClass: 'text-sky-300' };
    }
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
      return { icon: ICON_NAMES.RAIN, colorClass: 'text-blue-300' };
    }
    if (c.includes('fog') || c.includes('mist') || c.includes('haze') || c.includes('smoke')) {
      return { icon: ICON_NAMES.FOG, colorClass: 'text-slate-300' };
    }
    if (c.includes('wind') || c.includes('breezy') || c.includes('gust')) {
      return { icon: ICON_NAMES.WIND, colorClass: 'text-teal-300' };
    }
    if (c.includes('partly') || c.includes('mostly')) {
      return { icon: ICON_NAMES.CLOUD_SUN, colorClass: 'text-amber-300' };
    }
    if (c.includes('cloud') || c.includes('overcast')) {
      return { icon: ICON_NAMES.CLOUD, colorClass: 'text-gray-300' };
    }

    return { icon: ICON_NAMES.SUN, colorClass: 'text-yellow-400' };
  };

  // 3-Day Forecast
  if (data.forecasts && data.forecasts.length > 0) {
    // Use local date instead of UTC so evening hours do not skip "today".
    const todayStr = formatLocalDateYYYYMMDD(new Date());
    const filtered = data.forecasts.filter((d) => d.date >= todayStr).slice(0, 3);
    const daysToShow = filtered.length ? filtered : data.forecasts.slice(0, 3);

    const dayLabel = (dateStr, index) => {
      if (!dateStr) return `Day ${index + 1}`;
      const d = new Date(dateStr + 'T12:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      d.setHours(0, 0, 0, 0);
      const diff = Math.round((d - today) / (24 * 60 * 60 * 1000));
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    };

    const formatDateShort = (d) => {
      try {
        return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      } catch {
        return d;
      }
    };

    return (
      <div className={`flex flex-col items-center w-full max-w-6xl ${className}`}>
        <div className="text-center mb-2">
          <p className="text-2xl md:text-3xl text-white/90 tracking-wide">
            {data.location || effectiveLocation}
          </p>
          <p className="text-lg md:text-xl text-white/70 mt-1">3-day outlook</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          {daysToShow.map((day, i) => {
            const isToday = dayLabel(day.date, i) === 'Today';
            const weatherVisual = getWeatherVisual(day.condition);
            return (
              <div
                key={day.date || i}
                className={`rounded-2xl p-6 backdrop-blur-md border-2 text-center ${
                  isToday ? 'bg-white/20 border-white/40 shadow-xl shadow-black/20' : 'bg-white/10 border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold ${isToday ? 'text-2xl text-white' : 'text-xl text-white/90'}`}>
                    {dayLabel(day.date, i)}
                  </span>
                  <span className="text-sm text-white/60">{formatDateShort(day.date)}</span>
                </div>
                <FontAwesomeIcon
                  icon={weatherVisual.icon}
                  className={`${weatherVisual.colorClass} text-5xl mb-3`}
                />
                <div className="text-3xl font-bold text-white">
                  {day.max_temp != null ? `${Math.round(day.max_temp)}°` : '—'}
                  {day.min_temp != null && ` / ${Math.round(day.min_temp)}°`}
                </div>
                <div className="text-lg text-white/80 mt-2">{day.condition}</div>
                {day.chance_of_rain != null && (
                  <div className="text-base text-cyan-200 mt-2">Rain: {day.chance_of_rain}%</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center text-gray-400 ${className}`}>
      <FontAwesomeIcon icon={ICON_NAMES.INFO} className="mr-4 text-4xl" />
      <span className="text-3xl">No weather data</span>
    </div>
  );
};

export default SlideWeatherWidget;
