class ApiCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Generate a cache key from request parameters
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}${sortedParams ? `?${sortedParams}` : ''}`;
  }

  /**
   * Check if cache entry is still valid
   */
  isValid(entry) {
    return entry && entry.timestamp + entry.ttl > Date.now();
  }

  /**
   * Get cached data if available and valid
   */
  get(key) {
    const entry = this.cache.get(key);
    if (this.isValid(entry)) {
      console.log(`📦 Cache hit for: ${key}`);
      return Promise.resolve(entry.data);
    }
    return null;
  }

  /**
   * Set cache entry with TTL
   */
  set(key, data, ttl = this.defaultTTL) {
    console.log(`💾 Caching data for: ${key} (TTL: ${ttl}ms)`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Execute API request with caching and deduplication
   */
  async request(key, apiCall, ttl = this.defaultTTL) {
    // Check cache first
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      console.log(`⏳ Deduplicating request for: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Execute the API call
    console.log(`🌐 Making API request for: ${key}`);
    const requestPromise = apiCall()
      .then(response => {
        this.set(key, response, ttl);
        this.pendingRequests.delete(key);
        return response;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key) {
    console.log(`🗑️ Invalidating cache for: ${key}`);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll() {
    console.log('🗑️ Clearing all cache');
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp + entry.ttl <= now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const entries = Array.from(this.cache.entries());
    const valid = entries.filter(([, entry]) => this.isValid(entry));
    
    return {
      total: entries.length,
      valid: valid.length,
      expired: entries.length - valid.length,
      pending: this.pendingRequests.size,
      size: this.cache.size
    };
  }
}

// Create singleton instance
const apiCache = new ApiCache();

// Clean up expired entries every 5 minutes
setInterval(() => {
  apiCache.clearExpired();
}, 5 * 60 * 1000);

export default apiCache; 