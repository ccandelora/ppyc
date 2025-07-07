import React, { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only monitor performance in development
    if (!import.meta.env.DEV) {
      return;
    }

    const monitorPerformance = () => {
      if (!window.performance || !window.performance.timing) {
        console.warn('Performance API not supported');
        return;
      }

      const timing = window.performance.timing;
      const navigation = window.performance.navigation;
      
      // Calculate key metrics
      const data = {
        // Page load times
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullPageLoad: timing.loadEventEnd - timing.navigationStart,
        
        // Network times
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        serverResponse: timing.responseStart - timing.requestStart,
        
        // Rendering times
        domProcessing: timing.domComplete - timing.domLoading,
        
        // Navigation type
        navigationType: navigation.type,
        
        // Additional metrics
        firstPaint: null,
        firstContentfulPaint: null,
        largestContentfulPaint: null,
        
        // Resource counts
        resourceCount: window.performance.getEntriesByType('resource').length,
        
        // Memory usage (if available)
        memoryUsage: window.performance.memory ? {
          used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024)
        } : null
      };

      // Get Paint Timing API data
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          data.firstPaint = Math.round(entry.startTime);
        } else if (entry.name === 'first-contentful-paint') {
          data.firstContentfulPaint = Math.round(entry.startTime);
        }
      });

      // Get Largest Contentful Paint
      if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          data.largestContentfulPaint = Math.round(lastEntry.startTime);
          setPerformanceData(data);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      setPerformanceData(data);
    };

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      setTimeout(monitorPerformance, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(monitorPerformance, 100);
      });
    }

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!import.meta.env.DEV || !performanceData) {
    return null;
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.fair) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        📊
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm w-full max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm">
            {/* Core Web Vitals */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Core Web Vitals</h4>
              {performanceData.firstContentfulPaint && (
                <div className="flex justify-between">
                  <span>First Contentful Paint:</span>
                  <span className={getPerformanceColor(performanceData.firstContentfulPaint, { good: 1800, fair: 3000 })}>
                    {formatTime(performanceData.firstContentfulPaint)}
                  </span>
                </div>
              )}
              {performanceData.largestContentfulPaint && (
                <div className="flex justify-between">
                  <span>Largest Contentful Paint:</span>
                  <span className={getPerformanceColor(performanceData.largestContentfulPaint, { good: 2500, fair: 4000 })}>
                    {formatTime(performanceData.largestContentfulPaint)}
                  </span>
                </div>
              )}
            </div>

            {/* Page Load Times */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Page Load</h4>
              <div className="flex justify-between">
                <span>DOM Content Loaded:</span>
                <span className={getPerformanceColor(performanceData.domContentLoaded, { good: 1000, fair: 2000 })}>
                  {formatTime(performanceData.domContentLoaded)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Full Page Load:</span>
                <span className={getPerformanceColor(performanceData.fullPageLoad, { good: 2000, fair: 4000 })}>
                  {formatTime(performanceData.fullPageLoad)}
                </span>
              </div>
            </div>

            {/* Network Timing */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Network</h4>
              <div className="flex justify-between">
                <span>DNS Lookup:</span>
                <span className={getPerformanceColor(performanceData.dnsLookup, { good: 50, fair: 200 })}>
                  {formatTime(performanceData.dnsLookup)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Server Response:</span>
                <span className={getPerformanceColor(performanceData.serverResponse, { good: 200, fair: 500 })}>
                  {formatTime(performanceData.serverResponse)}
                </span>
              </div>
            </div>

            {/* Resource Count */}
            <div className="border-b pb-2">
              <h4 className="font-medium text-gray-700 mb-1">Resources</h4>
              <div className="flex justify-between">
                <span>Total Resources:</span>
                <span className={getPerformanceColor(performanceData.resourceCount, { good: 50, fair: 100 })}>
                  {performanceData.resourceCount}
                </span>
              </div>
            </div>

            {/* Memory Usage */}
            {performanceData.memoryUsage && (
              <div className="border-b pb-2">
                <h4 className="font-medium text-gray-700 mb-1">Memory Usage</h4>
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span className={getPerformanceColor(performanceData.memoryUsage.used, { good: 50, fair: 100 })}>
                    {performanceData.memoryUsage.used}MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{performanceData.memoryUsage.total}MB</span>
                </div>
              </div>
            )}

            {/* Performance Tips */}
            <div className="pt-2">
              <h4 className="font-medium text-gray-700 mb-1">Tips</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {performanceData.resourceCount > 100 && (
                  <li>• Too many resources loaded ({performanceData.resourceCount})</li>
                )}
                {performanceData.firstContentfulPaint > 3000 && (
                  <li>• First Contentful Paint is slow</li>
                )}
                {performanceData.largestContentfulPaint > 4000 && (
                  <li>• Largest Contentful Paint is slow</li>
                )}
                {performanceData.memoryUsage && performanceData.memoryUsage.used > 100 && (
                  <li>• High memory usage detected</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor; 