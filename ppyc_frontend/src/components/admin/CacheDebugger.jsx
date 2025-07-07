import React, { useState, useEffect } from 'react';
import { apiCache } from '../../services/api';

const CacheDebugger = () => {
  const [stats, setStats] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      setStats(apiCache.getStats());
    };

    updateStats();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(updateStats, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleClearCache = () => {
    apiCache.clearAll();
    setStats(apiCache.getStats());
  };

  const handleClearExpired = () => {
    apiCache.clearExpired();
    setStats(apiCache.getStats());
  };

  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Cache Debugger"
      >
        <i className="fas fa-database"></i>
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Cache Debug</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Stats */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-600">Total Entries</div>
                <div className="font-semibold">{stats.total || 0}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-green-600">Valid</div>
                <div className="font-semibold">{stats.valid || 0}</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="text-red-600">Expired</div>
                <div className="font-semibold">{stats.expired || 0}</div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-blue-600">Pending</div>
                <div className="font-semibold">{stats.pending || 0}</div>
              </div>
            </div>
          </div>

          {/* Cache Hit Rate */}
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              Hit Rate: {stats.valid > 0 ? Math.round((stats.valid / stats.total) * 100) : 0}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${stats.valid > 0 ? (stats.valid / stats.total) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Auto Refresh</label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="form-checkbox"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClearExpired}
                className="flex-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
              >
                Clear Expired
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Cache Insights */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Tips</h4>
            <div className="text-xs text-gray-600 space-y-1">
              {stats.expired > 0 && (
                <div className="text-yellow-600">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  {stats.expired} expired entries - consider clearing
                </div>
              )}
              {stats.pending > 3 && (
                <div className="text-blue-600">
                  <i className="fas fa-clock mr-1"></i>
                  {stats.pending} pending requests - possible slow API
                </div>
              )}
              {stats.valid === 0 && stats.total > 0 && (
                <div className="text-red-600">
                  <i className="fas fa-times-circle mr-1"></i>
                  No valid cache entries - cache may be too short
                </div>
              )}
              {stats.valid > 0 && (
                <div className="text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>
                  Cache is working well!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheDebugger; 