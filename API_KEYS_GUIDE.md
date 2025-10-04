# NASA TEMPO Air Quality Forecast - API Keys & Configuration Guide

## 🔑 Required API Keys and Tokens

### 1. NASA Earthdata (TEMPO Data)
**Endpoint**: `https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/`
**Token**: NASA Earthdata Login Token
**How to get**:
1. Go to [NASA Earthdata Login](https://urs.earthdata.nasa.gov/)
2. Create account or login
3. Generate API token in profile settings
4. Add to `.env` file: `NASA_EARTHDATA_TOKEN=your_token_here`

### 2. OpenWeatherMap API
**Endpoint**: `https://api.openweathermap.org/data/2.5/`
**Token**: OpenWeatherMap API Key
**How to get**:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env` file: `OPENWEATHER_API_KEY=your_api_key_here`

### 3. AirNow API
**Endpoint**: `https://www.airnowapi.org/aq/observation/`
**Token**: AirNow API Key
**How to get**:
1. Go to [AirNow API](https://www.airnowapi.org/aq/observation/zipCode/current/)
2. Request API key (free)
3. Add to `.env` file: `AIRNOW_API_KEY=your_api_key_here`

### 4. OpenAQ API
**Endpoint**: `https://api.openaq.org/v3/`
**Token**: No token required (free)
**Rate limit**: 1000 requests/day
**Note**: Version 1 and 2 endpoints are retired, use Version 3

### 5. Weather.gov API
**Endpoint**: `https://api.weather.gov/`
**Token**: No token required (completely free)
**Rate limit**: 1000 requests/day
**Note**: Works immediately without any configuration

## 📝 Environment Variables Setup

Create a `.env` file in the root directory:

```env
# NASA Earthdata (TEMPO)
NASA_EARTHDATA_TOKEN=your_nasa_token_here
NASA_EARTHDATA_USERNAME=your_username
NASA_EARTHDATA_PASSWORD=your_password

# OpenWeatherMap
OPENWEATHER_API_KEY=your_openweather_key_here

# AirNow
AIRNOW_API_KEY=your_airnow_key_here

# Database (Optional)
MONGODB_URI=mongodb://localhost:27017/tempo-air-quality
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🌐 API Endpoints Configuration

### TEMPO Data Endpoints
```javascript
// TEMPO NO2 Data
https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/details?product=MOD04_L2&collection=61

// TEMPO O3 Data  
https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/details?product=MOD06_L2&collection=61

// TEMPO AOD Data
https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/details?product=MOD04_L2&collection=61
```

### Ground-based Air Quality
```javascript
// AirNow API
https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=10001&distance=25&API_KEY={API_KEY}

// OpenAQ API v3 (Updated)
https://api.openaq.org/v3/locations?limit=100&page=1&offset=0&sort=desc&radius=1000&coordinates=40.7128,-74.0060
```

### Weather Data
```javascript
// OpenWeatherMap
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}

// Weather.gov
https://api.weather.gov/points/{lat},{lon}
```

## 🔧 Configuration Steps

### Step 1: Get NASA Earthdata Token
1. Visit: https://urs.earthdata.nasa.gov/
2. Create account
3. Go to "My Profile" → "Application Tokens"
4. Generate new token
5. Copy token to `.env` file

### Step 2: Get OpenWeatherMap API Key
1. Visit: https://openweathermap.org/api
2. Sign up for free account
3. Go to "API Keys" section
4. Copy API key to `.env` file

### Step 3: Get AirNow API Key
1. Visit: https://www.airnowapi.org/aq/observation/zipCode/current/
2. Request API key (usually approved within 24 hours)
3. Copy API key to `.env` file

### Step 4: Update Configuration
1. Copy `.env.example` to `.env`
2. Add all your API keys
3. Restart the server: `npm start`

## 🚀 Testing API Connections

### Test NASA Earthdata
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/details?product=MOD04_L2"
```

### Test OpenWeatherMap
```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=YOUR_API_KEY"
```

### Test AirNow
```bash
curl "https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=10001&distance=25&API_KEY=YOUR_API_KEY"
```

## 📊 Data Sources Summary

| Source | Type | Cost | Rate Limit | Coverage | API Key Required |
|--------|------|------|------------|----------|------------------|
| NASA Earthdata | Satellite | Free | 1000/day | Global | ✅ Yes |
| OpenWeatherMap | Weather | Free/Paid | 1000/day | Global | ✅ Yes |
| AirNow | Air Quality | Free | 1000/day | US | ✅ Yes |
| OpenAQ | Air Quality | Free | 1000/day | Global | ✅ Yes |
| Weather.gov | Weather | Free | 1000/day | US | ❌ No |

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use environment variables in production
- Rotate API keys regularly
- Monitor API usage to avoid rate limits

## 🆘 Troubleshooting

### Common Issues:
1. **Invalid API Key**: Check if key is correctly copied
2. **Rate Limit Exceeded**: Wait or upgrade API plan
3. **CORS Issues**: Ensure proper headers in requests
4. **Authentication Failed**: Verify credentials

### Support Links:
- [NASA Earthdata Support](https://earthdata.nasa.gov/contact)
- [OpenWeatherMap Support](https://openweathermap.org/help)
- [AirNow Support](https://www.airnowapi.org/aq/observation/zipCode/current/)

## 📞 Contact Information

For API issues:
- NASA Earthdata: earthdata@nasa.gov
- OpenWeatherMap: support@openweathermap.org
- AirNow: airnow@epa.gov
