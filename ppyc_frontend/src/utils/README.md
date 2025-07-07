# API Caching System

This directory contains utilities for caching API responses to improve performance and reduce duplicate network requests.

## Components

### `apiCache.js`
Core caching utility that provides:
- **TTL-based caching**: Automatic cache expiration
- **Request deduplication**: Prevents duplicate concurrent requests
- **Cache statistics**: Monitor cache performance
- **Cache management**: Clear expired or all cache entries

### `useApiCache.js`
React hooks for easy integration:
- `useApiCache`: Single cached API call with loading states
- `useMultipleApiCache`: Multiple cached API calls in parallel
- `usePaginatedApiCache`: Cached pagination support

## Usage Examples

### Basic caching with useApiCache:
```javascript
import { useApiCache } from '../hooks/useApiCache';
import { newsAPI } from '../services/api';

const { data, loading, error, refresh } = useApiCache(
  newsAPI.getAll,
  'news-all',
  {
    ttl: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => console.log('Data loaded:', data),
    onError: (error) => console.error('Error:', error)
  }
);
```

### Multiple API calls:
```javascript
import { useMultipleApiCache } from '../hooks/useApiCache';

const { data, loading, error } = useMultipleApiCache([
  { apiCall: newsAPI.getAll, cacheKey: 'news-all' },
  { apiCall: eventsAPI.getAll, cacheKey: 'events-all' }
]);

// Access data: data['news-all'], data['events-all']
```

### Direct cache usage:
```javascript
import apiCache from '../utils/apiCache';

// Cache a request
const data = await apiCache.request('my-key', () => api.get('/data'));

// Check cache
const cached = apiCache.get('my-key');

// Clear cache
apiCache.invalidate('my-key');
apiCache.clearAll();
```

## Cache Configuration

### TTL (Time To Live)
- **News**: 5 minutes
- **Events**: 5 minutes  
- **Weather**: 10-15 minutes
- **Static Pages**: 15 minutes
- **Slides**: 2 minutes (more dynamic)

### Cache Keys
Use descriptive, unique keys:
- `news-all` - All news items
- `events-all` - All events
- `weather-current` - Current weather
- `pages-{slug}` - Static pages by slug

## Cache Invalidation

Admin operations automatically invalidate related cache:
```javascript
// Creating/updating news invalidates 'news-all'
adminAPI.news.create(data); // Auto-invalidates cache
adminAPI.news.update(id, data); // Auto-invalidates cache
```

## Development Tools

### Cache Debugger
In development mode, a cache debugger widget appears in the bottom-right corner:
- View cache statistics
- Monitor hit rates
- Clear expired entries
- Clear all cache
- Performance insights

### Console Logging
Cache operations are logged to console in development:
- `📦 Cache hit for: key` - Cache hit
- `🌐 Making API request for: key` - Network request
- `💾 Caching data for: key` - Data cached
- `⏳ Deduplicating request for: key` - Duplicate request prevented

## Best Practices

1. **Use appropriate TTL**: Balance freshness vs performance
2. **Unique cache keys**: Avoid collisions
3. **Invalidate on updates**: Keep cache fresh
4. **Monitor performance**: Use cache debugger
5. **Handle errors gracefully**: Provide fallbacks

## Benefits

- **Eliminates duplicate calls**: React Strict Mode no longer causes duplicate API requests
- **Improved performance**: Cached responses load instantly
- **Reduced bandwidth**: Fewer network requests
- **Better UX**: Faster page loads and navigation
- **Smart invalidation**: Cache stays fresh automatically 