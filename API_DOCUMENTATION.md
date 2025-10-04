# NASA TEMPO Air Quality Forecast - API Documentation

## Overview

The NASA TEMPO Air Quality Forecast API provides comprehensive air quality monitoring and forecasting capabilities by integrating NASA TEMPO satellite data with ground-based measurements and weather data.

**Base URL**: `http://localhost:5000/api` (development)  
**Production URL**: `https://your-domain.com/api`

## Authentication

Currently, the API does not require authentication for public endpoints. Future versions may implement API key authentication for enhanced security.

## Rate Limiting

- **Rate Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers
- **Exceeded Limit**: Returns HTTP 429 with retry-after header

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "parameters": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Endpoints

### Health Check

#### GET /api/health

Check the health status of the API and its services.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "tempo": "operational",
    "weather": "operational",
    "forecast": "operational"
  }
}
```

---

## Air Quality Data

### Current Air Quality

#### GET /api/air-quality/current

Get current air quality data for a specific location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `radius` (optional): Search radius in kilometers (default: 25)

**Example Request:**
```
GET /api/air-quality/current?lat=40.7128&lng=-74.0060&radius=25
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "sources": ["EPA AirNow", "OpenAQ"],
    "pollutants": {
      "pm2.5": {
        "concentration": 15.2,
        "unit": "μg/m³",
        "quality": "good",
        "aqi": 45,
        "source": "EPA"
      },
      "o3": {
        "concentration": 65.8,
        "unit": "ppb",
        "quality": "moderate",
        "aqi": 78,
        "source": "EPA"
      }
    },
    "aqi": 78,
    "overallQuality": "moderate",
    "stations": [
      {
        "id": "NYC001",
        "name": "New York City",
        "distance": 5.2,
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      }
    ]
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "radius": 25
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Air Quality Stations

#### GET /api/air-quality/stations

Get air quality monitoring stations near a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `radius` (optional): Search radius in kilometers (default: 50)

**Response:**
```json
{
  "success": true,
  "stations": [
    {
      "id": "NYC001",
      "name": "New York City",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  ],
  "sources": ["EPA AirNow", "OpenAQ"],
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "radius": 50
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### AQI Information

#### GET /api/air-quality/aqi

Get AQI information and health recommendations.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate

**Response:**
```json
{
  "success": true,
  "data": {
    "value": 78,
    "level": "moderate",
    "healthRecommendations": [
      "Air quality is acceptable for most people.",
      "Sensitive individuals may experience minor symptoms."
    ],
    "sensitiveGroups": {
      "groups": ["Children", "Elderly", "People with asthma"],
      "riskLevel": "moderate",
      "recommendations": ["Consider reducing prolonged outdoor exertion if you are sensitive."]
    },
    "pollutants": {
      "pm2.5": {
        "concentration": 15.2,
        "unit": "μg/m³",
        "quality": "good"
      }
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## TEMPO Satellite Data

### Current TEMPO Data

#### GET /api/tempo/current

Get current TEMPO satellite data for a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "pollutants": {
      "NO2": {
        "concentration": 18.5,
        "unit": "ppb",
        "quality": "good"
      },
      "O3": {
        "concentration": 52.3,
        "unit": "ppb",
        "quality": "good"
      },
      "SO2": {
        "concentration": 8.2,
        "unit": "ppb",
        "quality": "good"
      },
      "HCHO": {
        "concentration": 6.1,
        "unit": "ppb",
        "quality": "good"
      }
    },
    "aerosolOpticalDepth": {
      "value": 0.15,
      "unit": "dimensionless",
      "quality": "good"
    },
    "dataQuality": {
      "confidence": "high",
      "coverage": "complete",
      "resolution": "10km"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Historical TEMPO Data

#### GET /api/tempo/historical

Get historical TEMPO data for trend analysis.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `days` (optional): Number of days to look back (default: 7)

**Response:**
```json
{
  "success": true,
  "data": {
    "historicalData": [
      {
        "date": "2024-01-01",
        "pollutants": {
          "NO2": {
            "concentration": 18.5,
            "unit": "ppb",
            "quality": "good"
          }
        }
      }
    ],
    "trends": {
      "NO2": "stable",
      "O3": "increasing",
      "SO2": "decreasing"
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "days": 7
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### TEMPO Coverage Information

#### GET /api/tempo/coverage

Get TEMPO data coverage information.

**Response:**
```json
{
  "success": true,
  "data": {
    "region": "North America",
    "resolution": "10km",
    "temporalResolution": "15 minutes",
    "spatialCoverage": "Continental US, Canada, Mexico",
    "dataLatency": "Near real-time",
    "lastUpdate": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Weather Data

### Current Weather

#### GET /api/weather/current

Get current weather data.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 22.5,
    "humidity": 65,
    "pressure": 1013.25,
    "windSpeed": 3.2,
    "windDirection": 180,
    "visibility": 10000,
    "cloudCover": 30,
    "uvIndex": 5,
    "description": "partly cloudy",
    "icon": "02d",
    "airQualityFactors": {
      "dispersion": 0.7,
      "stagnation": 0.2,
      "precipitation": 0.0,
      "temperature": 0.6,
      "humidity": 0.65,
      "wind": 0.32,
      "overallImpact": "good"
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Weather Forecast

#### GET /api/weather/forecast

Get weather forecast data.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `days` (optional): Number of forecast days (default: 5)

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "temperature": 22.5,
      "humidity": 65,
      "windSpeed": 3.2,
      "description": "partly cloudy"
    },
    "forecast": [
      {
        "datetime": "2024-01-01T12:00:00.000Z",
        "temperature": 24.0,
        "humidity": 60,
        "windSpeed": 4.1,
        "description": "clear sky",
        "airQualityFactors": {
          "dispersion": 0.8,
          "overallImpact": "excellent"
        }
      }
    ],
    "airQualityFactors": {
      "current": {
        "dispersion": 0.7,
        "overallImpact": "good"
      },
      "forecast": [
        {
          "dispersion": 0.8,
          "overallImpact": "excellent"
        }
      ],
      "trends": {
        "temperature": "increasing",
        "humidity": "decreasing",
        "wind": "increasing",
        "airQualityImpact": "improving"
      },
      "alerts": [
        {
          "type": "low-wind",
          "severity": "info",
          "message": "Low wind conditions - limited pollutant dispersion"
        }
      ]
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "days": 5
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Forecasting

### Comprehensive Forecast

#### GET /api/forecast/comprehensive

Get comprehensive air quality forecast combining all data sources.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `hours` (optional): Hours to forecast (default: 24)

**Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    },
    "forecastHours": 24,
    "pollutants": {
      "NO2": [
        {
          "hour": 1,
          "concentration": 18.5,
          "timestamp": "2024-01-01T01:00:00.000Z"
        }
      ],
      "O3": [
        {
          "hour": 1,
          "concentration": 52.3,
          "timestamp": "2024-01-01T01:00:00.000Z"
        }
      ]
    },
    "aqi": [
      {
        "hour": 1,
        "aqi": 78,
        "level": "moderate",
        "timestamp": "2024-01-01T01:00:00.000Z"
      }
    ],
    "confidence": {
      "NO2": [
        {
          "hour": 1,
          "lower": 14.8,
          "upper": 22.2,
          "confidence": 0.8
        }
      ]
    },
    "alerts": [
      {
        "type": "aqi-warning",
        "severity": "warning",
        "message": "WARNING: AQI predicted to reach 85 in 6 hours",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "hour": 6
      }
    ],
    "recommendations": [
      {
        "hour": 6,
        "aqi": 85,
        "recommendations": [
          "Sensitive groups should reduce prolonged outdoor exertion.",
          "Children and elderly should limit outdoor activities."
        ],
        "timestamp": "2024-01-01T06:00:00.000Z"
      }
    ],
    "dataSources": {
      "tempo": "available",
      "ground": "available",
      "weather": "available"
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "hours": 24
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### AQI Forecast

#### GET /api/forecast/aqi

Get AQI-specific forecast.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `hours` (optional): Hours to forecast (default: 24)

**Response:**
```json
{
  "success": true,
  "data": {
    "forecast": [
      {
        "hour": 1,
        "aqi": 78,
        "level": "moderate",
        "timestamp": "2024-01-01T01:00:00.000Z"
      }
    ],
    "alerts": [
      {
        "type": "aqi-warning",
        "severity": "warning",
        "message": "WARNING: AQI predicted to reach 85 in 6 hours"
      }
    ],
    "recommendations": [
      {
        "hour": 6,
        "aqi": 85,
        "recommendations": [
          "Sensitive groups should reduce prolonged outdoor exertion."
        ]
      }
    ],
    "summary": {
      "current": 78,
      "peak": 95,
      "average": 82,
      "trend": "increasing",
      "worstHour": {
        "hour": 12,
        "aqi": 95,
        "level": "moderate"
      }
    }
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "hours": 24
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Pollutant Forecast

#### GET /api/forecast/pollutant

Get forecast for a specific pollutant.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `pollutant` (required): Pollutant name (NO2, O3, SO2, HCHO, PM2.5, PM10)
- `hours` (optional): Hours to forecast (default: 24)

**Response:**
```json
{
  "success": true,
  "data": {
    "pollutant": "NO2",
    "forecast": [
      {
        "hour": 1,
        "concentration": 18.5,
        "timestamp": "2024-01-01T01:00:00.000Z"
      }
    ],
    "confidence": [
      {
        "hour": 1,
        "lower": 14.8,
        "upper": 22.2,
        "confidence": 0.8
      }
    ],
    "alerts": [
      {
        "type": "pollutant-warning",
        "pollutant": "NO2",
        "severity": "warning",
        "message": "Elevated NO2 concentration predicted: 25.3 in 8 hours"
      }
    ],
    "recommendations": [
      {
        "hour": 8,
        "pollutant": "NO2",
        "recommendations": ["Avoid outdoor activities due to high NO2 levels"]
      }
    ]
  },
  "parameters": {
    "lat": 40.7128,
    "lng": -74.0060,
    "pollutant": "NO2",
    "hours": 24
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Notifications

### Subscribe to Notifications

#### POST /api/notifications/subscribe

Subscribe to location-based air quality notifications.

**Request Body:**
```json
{
  "userId": "user123",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "radius": 25
  },
  "preferences": {
    "aqiThresholds": {
      "warning": 100,
      "critical": 150,
      "emergency": 200
    },
    "notificationMethods": ["websocket", "email"],
    "email": "user@example.com",
    "enabled": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to notifications",
  "data": {
    "userId": "user123",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "radius": 25
    },
    "preferences": {
      "aqiThresholds": {
        "warning": 100,
        "critical": 150,
        "emergency": 200
      },
      "notificationMethods": ["websocket", "email"],
      "email": "user@example.com",
      "enabled": true
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Unsubscribe from Notifications

#### DELETE /api/notifications/unsubscribe

Unsubscribe from notifications.

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from notifications",
  "data": {
    "userId": "user123"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Update Notification Preferences

#### PUT /api/notifications/preferences

Update notification preferences.

**Request Body:**
```json
{
  "userId": "user123",
  "preferences": {
    "aqiThresholds": {
      "warning": 80,
      "critical": 120,
      "emergency": 180
    },
    "notificationMethods": ["websocket", "email", "sms"],
    "email": "newemail@example.com",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully updated notification preferences",
  "data": {
    "userId": "user123",
    "preferences": {
      "aqiThresholds": {
        "warning": 80,
        "critical": 120,
        "emergency": 180
      },
      "notificationMethods": ["websocket", "email", "sms"],
      "email": "newemail@example.com",
      "phone": "+1234567890"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Notification History

#### GET /api/notifications/history

Get notification history for a user.

**Parameters:**
- `userId` (required): User ID
- `limit` (optional): Number of entries to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user123",
      "alerts": [
        {
          "type": "aqi-warning",
          "severity": "warning",
          "message": "WARNING: AQI predicted to reach 85 in 6 hours",
          "timestamp": "2024-01-01T00:00:00.000Z"
        }
      ],
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "parameters": {
    "userId": "user123",
    "limit": 50
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Send Test Notification

#### POST /api/notifications/test

Send a test notification to verify the system is working.

**Request Body:**
```json
{
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test notification sent successfully",
  "data": {
    "userId": "user123"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## WebSocket Events

### Connection

Connect to the WebSocket server for real-time updates:

```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to notification server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from notification server');
});
```

### Subscribe to Location Updates

```javascript
socket.emit('subscribe-location', {
  lat: 40.7128,
  lng: -74.0060
});
```

### Air Quality Alerts

```javascript
socket.on('air-quality-alert', (data) => {
  console.log('Received air quality alert:', data);
  // Handle alert data
});
```

### Air Quality Updates

```javascript
socket.on('air-quality-update', (data) => {
  console.log('Received air quality update:', data);
  // Handle update data
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## Data Models

### Air Quality Index (AQI) Levels

| AQI Range | Level | Description |
|-----------|-------|-------------|
| 0-50 | Good | Air quality is satisfactory |
| 51-100 | Moderate | Air quality is acceptable |
| 101-150 | Unhealthy for Sensitive Groups | Sensitive groups may experience health effects |
| 151-200 | Unhealthy | Everyone may experience health effects |
| 201-300 | Very Unhealthy | Health warnings of emergency conditions |
| 301+ | Hazardous | Health alert: everyone may experience serious health effects |

### Pollutant Units

| Pollutant | Unit | Description |
|-----------|------|-------------|
| PM2.5 | μg/m³ | Micrograms per cubic meter |
| PM10 | μg/m³ | Micrograms per cubic meter |
| O3 | ppb | Parts per billion |
| NO2 | ppb | Parts per billion |
| SO2 | ppb | Parts per billion |
| HCHO | ppb | Parts per billion |
| CO | ppm | Parts per million |

### Alert Severity Levels

| Severity | Description |
|----------|-------------|
| info | Informational message |
| warning | Warning condition |
| critical | Critical condition |
| emergency | Emergency condition |

---

## Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Get current air quality
async function getCurrentAirQuality(lat, lng) {
  try {
    const response = await axios.get('http://localhost:5000/api/air-quality/current', {
      params: { lat, lng }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality:', error);
  }
}

// Get comprehensive forecast
async function getForecast(lat, lng, hours = 24) {
  try {
    const response = await axios.get('http://localhost:5000/api/forecast/comprehensive', {
      params: { lat, lng, hours }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}
```

### Python

```python
import requests

# Get current air quality
def get_current_air_quality(lat, lng):
    url = 'http://localhost:5000/api/air-quality/current'
    params = {'lat': lat, 'lng': lng}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching air quality: {e}')

# Get comprehensive forecast
def get_forecast(lat, lng, hours=24):
    url = 'http://localhost:5000/api/forecast/comprehensive'
    params = {'lat': lat, 'lng': lng, 'hours': hours}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching forecast: {e}')
```

### cURL

```bash
# Get current air quality
curl "http://localhost:5000/api/air-quality/current?lat=40.7128&lng=-74.0060"

# Get comprehensive forecast
curl "http://localhost:5000/api/forecast/comprehensive?lat=40.7128&lng=-74.0060&hours=24"

# Subscribe to notifications
curl -X POST "http://localhost:5000/api/notifications/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060,
      "radius": 25
    },
    "preferences": {
      "aqiThresholds": {
        "warning": 100,
        "critical": 150,
        "emergency": 200
      },
      "notificationMethods": ["websocket", "email"],
      "email": "user@example.com",
      "enabled": true
    }
  }'
```

---

**API Version**: 1.0  
**Last Updated**: 2024-01-01  
**Contact**: [Support Email]
