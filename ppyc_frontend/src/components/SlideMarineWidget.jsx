import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { useApiCache } from '../hooks/useApiCache';
import api from '../services/api';

const cacheKeySlug = (location) =>
  `${(location || 'default').replace(/[^a-zA-Z0-9.-]/g, '_')}`;

const formatLocalDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDayLabel = (dateStr, index) => {
  if (!dateStr) return `Day ${index + 1}`;
  const day = new Date(`${dateStr}T12:00:00`);
  return day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTideTime = (value) => {
  if (!value) return 'Unknown';

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  return value;
};

const formatRelativeTime = (value) => {
  if (!value) return 'N/A';
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return 'N/A';

  const diffMs = target.getTime() - Date.now();
  const absMinutes = Math.round(Math.abs(diffMs) / 60000);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return diffMs >= 0 ? `in ${parts.join(' ')}` : `${parts.join(' ')} ago`;
};

const SlideMarineWidget = ({ location, className = '' }) => {
  const effectiveLocation = (location && location.trim()) || 'Winthrop, MA';
  const slug = cacheKeySlug(effectiveLocation);

  const marineCall = () =>
    api.get('/weather/marine', { params: { location: effectiveLocation, days: 5 } });

  const { data: response, isLoading, error } = useApiCache(marineCall, `marine-slide-${slug}`, {
    ttl: 6 * 60 * 60 * 1000
  });

  const data = response?.data;
  const forecasts = data?.forecasts || [];
  const todayStr = formatLocalDateYYYYMMDD(new Date());
  const upcomingForecasts = forecasts.filter((day) => day.date >= todayStr).slice(0, 3);
  const fallbackForecasts = forecasts
    .filter((day) => !upcomingForecasts.some((upcoming) => upcoming.date === day.date))
    .slice(0, Math.max(0, 3 - upcomingForecasts.length));
  const daysToShow = [...upcomingForecasts, ...fallbackForecasts].slice(0, 3);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center text-white ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="mr-4 text-4xl" />
        <span className="text-3xl">Loading marine forecast...</span>
      </div>
    );
  }

  if (error || !data || daysToShow.length === 0) {
    return (
      <div className={`flex items-center justify-center text-red-300 ${className}`}>
        <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="mr-4 text-4xl" />
        <span className="text-3xl">Marine forecast unavailable</span>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl ${className}`}>
      <div className="text-center mb-4">
        <p className="text-2xl md:text-3xl text-white/90 tracking-wide">
          {data.location || effectiveLocation}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4 bg-white/10 border border-white/20">
          <div className="text-white/70 text-sm">Next High Tide</div>
          <div className="text-white text-lg font-semibold mt-1">
            {data.next_tides?.high?.time ? formatTideTime(data.next_tides.high.time) : 'N/A'}
          </div>
          <div className="text-cyan-200 text-sm">
            {data.next_tides?.high?.height_mt != null ? `${data.next_tides.high.height_mt}m` : '—'} • {formatRelativeTime(data.next_tides?.high?.time)}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-white/10 border border-white/20">
          <div className="text-white/70 text-sm">Next Low Tide</div>
          <div className="text-white text-lg font-semibold mt-1">
            {data.next_tides?.low?.time ? formatTideTime(data.next_tides.low.time) : 'N/A'}
          </div>
          <div className="text-blue-200 text-sm">
            {data.next_tides?.low?.height_mt != null ? `${data.next_tides.low.height_mt}m` : '—'} • {formatRelativeTime(data.next_tides?.low?.time)}
          </div>
        </div>
        <div className="rounded-xl p-4 bg-white/10 border border-white/20">
          <div className="text-white/70 text-sm">Current Tide Trend</div>
          <div className="text-white text-lg font-semibold mt-1 capitalize">
            {data.trend?.state || 'N/A'}
          </div>
          <div className="text-teal-200 text-sm">
            {data.trend?.current_height_mt != null ? `${data.trend.current_height_mt}m` : '—'} {data.conditions?.tidal_strength ? `• ${data.conditions.tidal_strength}` : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {daysToShow.map((day, index) => (
          <div
            key={day.date || index}
            className="rounded-2xl p-6 bg-white/10 border-2 border-white/20 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-white">{formatDayLabel(day.date, index)}</span>
              <FontAwesomeIcon icon={ICON_NAMES.WATER} className="text-cyan-200 text-2xl" />
            </div>

            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="text-white/70 text-sm mb-1">Tide Events</div>
              <div className="text-xs text-white/60 mb-2 uppercase tracking-wider">
                Range: {day.tidal_range_mt != null ? `${day.tidal_range_mt}m` : 'N/A'}
              </div>
              {day.tides?.length ? (
                <div className="space-y-1 text-sm text-white/90">
                  {day.tides.slice(0, 4).map((tide, tideIndex) => (
                    <div key={`${tide.time}-${tideIndex}`} className="flex justify-between">
                      <span className="capitalize">{tide.type || 'tide'}</span>
                      <span>{formatTideTime(tide.time)} ({tide.height_mt != null ? `${tide.height_mt}m` : '—'})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-white/60">No tide data available</div>
              )}
            </div>

            {(day.solunar_label || day.moon_phase || day.spring_neap) && (
              <div className="text-sm text-white/70 mt-3">
                {[day.solunar_label, day.moon_phase, day.spring_neap].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideMarineWidget;
