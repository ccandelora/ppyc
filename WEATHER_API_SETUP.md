# Weather API Setup Guide

The PPYC website uses:
- **WeatherAPI.com** for current weather + forecast
- **TideCheck** for marine tide data (with strict daily quota caching)

All keys are stored on the backend to prevent exposure in frontend code.

## Security Implementation

✅ **Secure**: API key stored as environment variable on backend  
✅ **Private**: Frontend calls backend API, not WeatherAPI directly  
✅ **Protected**: .env file is gitignored to prevent committing secrets  

## Setup Instructions

### 1. Get WeatherAPI Key
1. Sign up for a free account at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your API key from the dashboard
3. Free tier includes 1M calls/month which is more than sufficient

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cd ppyc_backend
cp .env.example .env
```

Edit `.env` and add keys:
```bash
WEATHER_API_KEY=your_actual_api_key_here
TIDECHECK_API_KEY=tc_your_key_here
TIDECHECK_STATION_ID=8443970
# Optional (defaults to MLLW)
TIDECHECK_DATUM=MLLW
```

> `TIDECHECK_STATION_ID` should be a TideCheck-supported station id for your location.

### 3. Restart Rails Server

After adding the environment variable, restart the Rails server:
```bash
rails server
```

## API Endpoints

The backend provides these secure weather endpoints:

- `GET /api/v1/weather/current?location=Boston,MA` - Current weather conditions
- `GET /api/v1/weather/forecast?location=Boston,MA&days=3` - Weather forecast 
- `GET /api/v1/weather/marine?location=Boston,MA&days=3` - Marine conditions/tides (TideCheck first, WeatherAPI fallback)

## TideCheck Rate-Limit Protection

TideCheck free plan allows only **50 requests/day**. The backend now protects usage by:
- Caching TideCheck responses server-side for 6 hours per station+datum+days
- Reusing cached responses across requests
- Falling back to WeatherAPI marine response if TideCheck is unavailable

Frontend marine calls are also cached for 6 hours to reduce repeated requests.

## Frontend Usage

The frontend automatically uses these secure endpoints via the `weatherAPI` service in `src/services/api.js`:

```javascript
import { weatherAPI } from '../services/api';

// Get current weather
const weather = await weatherAPI.current('Boston,MA');

// Get marine conditions  
const marine = await weatherAPI.marine('Boston,MA', 1);
```

## Weather Slide Integration

Weather slides in the TV display system automatically fetch and display:
- Current temperature and conditions
- Marine data (wind, waves, water temperature)
- Today's forecast (high/low, rain chance)
- Astronomy data (sunrise/sunset)

The weather data refreshes automatically based on the slide's location setting.

## Testing

Test the weather API integration:
1. Open `ppyc_frontend/test-weather.html` in a browser
2. Verify weather data loads correctly
3. Check browser console for any errors

## Security Notes

⚠️ **Never commit the `.env` file** - it contains sensitive API keys  
⚠️ **Never expose API keys in frontend code** - always use backend proxy  
⚠️ **Use HTTPS in production** - protect data in transit  

The current implementation properly follows these security best practices. 