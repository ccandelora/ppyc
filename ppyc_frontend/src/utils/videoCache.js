const VIDEO_CACHE_PREFIX = 'ppyc_video_';
const VIDEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class VideoCache {
  constructor() {
    this.memoryCache = new Map();
  }

  generateKey(publicId) {
    return `${VIDEO_CACHE_PREFIX}${publicId}`;
  }

  async cacheVideo(publicId, videoUrl) {
    const key = this.generateKey(publicId);

    try {
      // Check if video is already in memory cache
      if (this.memoryCache.has(key)) {
        return this.memoryCache.get(key);
      }

      // Try to fetch from browser cache first
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        const { timestamp, url } = JSON.parse(cachedData);
        if (Date.now() - timestamp < VIDEO_CACHE_DURATION) {
          this.memoryCache.set(key, url);
          return url;
        }
      }

      // If not in cache or expired, fetch and cache the video
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Store in memory cache
      this.memoryCache.set(key, objectUrl);

      // Store in localStorage with timestamp
      localStorage.setItem(key, JSON.stringify({
        timestamp: Date.now(),
        url: videoUrl // Store original URL, not objectUrl
      }));

      return objectUrl;
    } catch (error) {
      console.error('Error caching video:', error);
      return videoUrl; // Fallback to original URL if caching fails
    }
  }

  clearCache(publicId) {
    if (publicId) {
      const key = this.generateKey(publicId);
      localStorage.removeItem(key);
      const objectUrl = this.memoryCache.get(key);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        this.memoryCache.delete(key);
      }
    } else {
      // Clear all video cache
      for (const [key, objectUrl] of this.memoryCache.entries()) {
        if (key.startsWith(VIDEO_CACHE_PREFIX)) {
          URL.revokeObjectURL(objectUrl);
          localStorage.removeItem(key);
        }
      }
      this.memoryCache.clear();
    }
  }
}

export const videoCache = new VideoCache(); 