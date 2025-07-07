import { useState, useEffect, useCallback, useRef } from 'react';
import { apiCache } from '../services/api';

/**
 * Custom hook for cached API calls with loading states and error handling
 * @param {Function} apiCall - The API function to call
 * @param {string} cacheKey - Unique cache key for this request
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, refresh, cached }
 */
export const useApiCache = (apiCall, cacheKey, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    dependencies = [],
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        const result = await cachedData;
        setData(result);
        setCached(true);
        setLoading(false);
        onSuccess?.(result);
        return;
      }

      // Make API call with caching
      const result = await apiCache.request(cacheKey, apiCall, ttl);
      setData(result);
      setCached(false);
      onSuccess?.(result);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, cacheKey, ttl, enabled]); // Remove onSuccess and onError from dependencies

  const refresh = useCallback(() => {
    apiCache.invalidate(cacheKey);
    fetchData();
  }, [cacheKey, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh,
    cached
  };
};

/**
 * Hook for multiple cached API calls
 * @param {Array} requests - Array of { apiCall, cacheKey, ttl? }
 * @returns {Object} - { data, loading, error, refresh }
 */
export const useMultipleApiCache = (requests, options = {}) => {
  const { enabled = true, dependencies = [] } = options;
  
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use useRef to avoid recreating requests on every render
  const requestsRef = useRef(requests);
  const hasRequestsChanged = useRef(false);
  
  // Check if requests have actually changed
  useEffect(() => {
    const currentRequests = JSON.stringify(requests.map(r => ({ cacheKey: r.cacheKey, ttl: r.ttl })));
    const previousRequests = JSON.stringify(requestsRef.current?.map(r => ({ cacheKey: r.cacheKey, ttl: r.ttl })) || []);
    
    if (currentRequests !== previousRequests) {
      requestsRef.current = requests;
      hasRequestsChanged.current = true;
    }
  }, [requests]);

  const fetchAll = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const currentRequests = requestsRef.current;
      const promises = currentRequests.map(({ apiCall, cacheKey, ttl = 5 * 60 * 1000 }) => 
        apiCache.request(cacheKey, apiCall, ttl)
      );

      const results = await Promise.all(promises);
      
      const dataMap = {};
      currentRequests.forEach(({ cacheKey }, index) => {
        dataMap[cacheKey] = results[index];
      });

      setData(dataMap);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const refresh = useCallback(() => {
    const currentRequests = requestsRef.current;
    currentRequests.forEach(({ cacheKey }) => {
      apiCache.invalidate(cacheKey);
    });
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (hasRequestsChanged.current || loading) {
      hasRequestsChanged.current = false;
      fetchAll();
    }
  }, [fetchAll, enabled, ...dependencies]);

  return {
    data,
    loading,
    error,
    refresh
  };
};

/**
 * Hook for paginated cached API calls
 * @param {Function} apiCall - API function that accepts page parameter
 * @param {string} baseCacheKey - Base cache key (page number will be appended)
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, loadMore, hasMore, page }
 */
export const usePaginatedApiCache = (apiCall, baseCacheKey, options = {}) => {
  const {
    ttl = 5 * 60 * 1000,
    enabled = true,
    pageSize = 10,
    dependencies = []
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (pageNumber) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const cacheKey = `${baseCacheKey}-page-${pageNumber}`;
      const result = await apiCache.request(
        cacheKey,
        () => apiCall(pageNumber),
        ttl
      );

      if (pageNumber === 1) {
        setData(result.data || []);
      } else {
        setData(prev => [...prev, ...(result.data || [])]);
      }

      setHasMore((result.data || []).length === pageSize);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, baseCacheKey, ttl, enabled, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  }, [loading, hasMore, page, fetchPage]);

  const refresh = useCallback(() => {
    // Clear all cached pages
    for (let i = 1; i <= page; i++) {
      apiCache.invalidate(`${baseCacheKey}-page-${i}`);
    }
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchPage(1);
  }, [baseCacheKey, page, fetchPage]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage, ...dependencies]);

  return {
    data,
    loading,
    error,
    loadMore,
    hasMore,
    page,
    refresh
  };
};

export default useApiCache; 