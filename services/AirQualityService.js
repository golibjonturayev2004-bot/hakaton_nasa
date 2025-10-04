const axios = require('axios');
const moment = require('moment');

class AirQualityService {
  constructor() {
    this.epaApiKey = process.env.EPA_API_KEY;
    this.openAQApiKey = process.env.OPENAQ_API_KEY;
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  /**
   * Fetch ground-based air quality data from multiple sources
   * @param {Object} params - Query parameters
   * @param {number} params.lat - Latitude
   * @param {number} params.lng - Longitude
   * @param {number} params.radius - Search radius in km
   * @returns {Promise<Object>} Ground-based air quality data
   */
  async fetchGroundBasedData(params) {
    const cacheKey = `ground-${params.lat}-${params.lng}-${params.radius}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Fetch from multiple sources in parallel
      const [epaData, openAQData] = await Promise.allSettled([
        this.fetchEPAData(params),
        this.fetchOpenAQData(params)
      ]);

      const processedData = this.processGroundBasedData({
        epa: epaData.status === 'fulfilled' ? epaData.value : null,
        openAQ: openAQData.status === 'fulfilled' ? openAQData.value : null
      });

      // Cache the result
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;
    } catch (error) {
      console.error('Error fetching ground-based air quality data:', error.message);
      // Return mock data when external APIs fail
      return this.getMockAirQualityData(params);
    }
  }

  /**
   * Fetch data from EPA AirNow API
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} EPA data
   */
  async fetchEPAData(params) {
    try {
      const response = await axios.get('https://www.airnowapi.org/aq/observation/latLong/current/', {
        params: {
          latitude: params.lat,
          longitude: params.lng,
          distance: params.radius || 25,
          format: 'application/json',
          API_KEY: this.epaApiKey
        },
        timeout: 15000
      });

      return response.data;
    } catch (error) {
      console.error('EPA API error:', error.message);
      return null;
    }
  }

  /**
   * Fetch data from OpenAQ API v3
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} OpenAQ data
   */
  async fetchOpenAQData(params) {
    try {
      const apiKey = process.env.OPENAQ_API_KEY || 'd282fb1ee29051fcbbd629dc2ed71a7b477ababcda6e52d84434c9eeefa47f42';
      
      const response = await axios.get('https://api.openaq.org/v3/measurements', {
        params: {
          coordinates: `${params.lat},${params.lng}`,
          radius: (params.radius || 25) * 1000, // Convert to meters
          limit: 100,
          page: 1,
          sort: 'desc',
          orderBy: 'datetime'
        },
        headers: {
          'X-API-Key': apiKey
        },
        timeout: 15000
      });

      return response.data;
    } catch (error) {
      console.error('OpenAQ API v3 error:', error.message);
      return null;
    }
  }

  /**
   * Process and merge ground-based data from multiple sources
   * @param {Object} rawData - Raw data from multiple sources
   * @returns {Object} Processed and merged data
   */
  processGroundBasedData(rawData) {
    const processed = {
      timestamp: new Date().toISOString(),
      sources: [],
      pollutants: {},
      aqi: null,
      stations: []
    };

    // Process EPA data
    if (rawData.epa && Array.isArray(rawData.epa)) {
      rawData.epa.forEach(station => {
        processed.sources.push('EPA AirNow');
        processed.stations.push({
          id: station.ReportingArea,
          name: station.ReportingArea,
          distance: station.distance || 0,
          coordinates: {
            lat: station.Latitude,
            lng: station.Longitude
          }
        });

        // Process pollutants
        if (station.ParameterName) {
          const pollutant = station.ParameterName.toLowerCase();
          processed.pollutants[pollutant] = {
            concentration: station.Value,
            unit: station.Unit,
            quality: this.getAQILevel(station.AQI),
            aqi: station.AQI,
            source: 'EPA'
          };
        }

        // Set overall AQI
        if (station.AQI && (!processed.aqi || station.AQI > processed.aqi)) {
          processed.aqi = station.AQI;
        }
      });
    }

    // Process OpenAQ v3 data
    if (rawData.openAQ && rawData.openAQ.results) {
      rawData.openAQ.results.forEach(measurement => {
        processed.sources.push('OpenAQ');
        
        const pollutant = measurement.parameter.toLowerCase();
        if (!processed.pollutants[pollutant]) {
          processed.pollutants[pollutant] = {
            concentration: measurement.value,
            unit: measurement.unit,
            quality: this.assessQuality(pollutant, measurement.value),
            source: 'OpenAQ'
          };
        }

        // Add station info
        if (measurement.location) {
          processed.stations.push({
            id: measurement.location,
            name: measurement.location,
            coordinates: {
              lat: measurement.coordinates?.latitude,
              lng: measurement.coordinates?.longitude
            }
          });
        }
      });
    }

    // Calculate overall air quality index if not available
    if (!processed.aqi) {
      processed.aqi = this.calculateOverallAQI(processed.pollutants);
    }

    processed.overallQuality = this.getAQILevel(processed.aqi);

    return processed;
  }

  /**
   * Calculate overall AQI from pollutant concentrations
   * @param {Object} pollutants - Pollutant data
   * @returns {number} Overall AQI
   */
  calculateOverallAQI(pollutants) {
    const aqiValues = [];
    
    Object.values(pollutants).forEach(pollutant => {
      if (pollutant.aqi) {
        aqiValues.push(pollutant.aqi);
      } else {
        // Convert concentration to AQI if needed
        const aqi = this.concentrationToAQI(pollutant.concentration, pollutant.unit);
        if (aqi) aqiValues.push(aqi);
      }
    });

    return aqiValues.length > 0 ? Math.max(...aqiValues) : 0;
  }

  /**
   * Convert concentration to AQI
   * @param {number} concentration - Pollutant concentration
   * @param {string} unit - Concentration unit
   * @returns {number} AQI value
   */
  concentrationToAQI(concentration, unit) {
    // Simplified AQI calculation - in production, use proper EPA formulas
    const thresholds = {
      'PM2.5': { good: 12, moderate: 35, unhealthy: 55 },
      'PM10': { good: 54, moderate: 154, unhealthy: 254 },
      'O3': { good: 54, moderate: 70, unhealthy: 85 },
      'NO2': { good: 53, moderate: 100, unhealthy: 360 }
    };

    // This is a simplified version - actual AQI calculation is more complex
    return Math.round(concentration * 2); // Placeholder calculation
  }

  /**
   * Get AQI level description
   * @param {number} aqi - AQI value
   * @returns {string} AQI level
   */
  getAQILevel(aqi) {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
  }

  /**
   * Assess air quality based on pollutant concentration
   * @param {string} pollutant - Pollutant type
   * @param {number} concentration - Concentration value
   * @returns {string} Quality assessment
   */
  assessQuality(pollutant, concentration) {
    const thresholds = {
      'pm2.5': { good: 12, moderate: 35, unhealthy: 55 },
      'pm10': { good: 54, moderate: 154, unhealthy: 254 },
      'o3': { good: 54, moderate: 70, unhealthy: 85 },
      'no2': { good: 53, moderate: 100, unhealthy: 360 },
      'so2': { good: 35, moderate: 75, unhealthy: 185 },
      'co': { good: 4.4, moderate: 9.4, unhealthy: 12.4 }
    };

    const threshold = thresholds[pollutant.toLowerCase()];
    if (!threshold) return 'unknown';

    if (concentration <= threshold.good) return 'good';
    if (concentration <= threshold.moderate) return 'moderate';
    if (concentration <= threshold.unhealthy) return 'unhealthy';
    return 'hazardous';
  }

  /**
   * Get real-time air quality for a location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Real-time air quality data
   */
  async getRealTimeAirQuality(lat, lng) {
    return await this.fetchGroundBasedData({
      lat,
      lng,
      radius: 25
    });
  }

  /**
   * Update air quality data cache
   */
  async updateAirQualityData() {
    console.log('Updating air quality data cache...');
    // Clear expired cache entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
    console.log(`Air quality cache updated. Current entries: ${this.cache.size}`);
  }

  /**
   * Get mock air quality data when external APIs fail
   * @param {Object} params - Query parameters
   * @returns {Object} Mock air quality data
   */
  getMockAirQualityData(params) {
    const { lat, lng } = params;
    
    // Generate realistic mock data
    const aqi = Math.floor(Math.random() * 150) + 20; // AQI between 20-170
    const quality = aqi <= 50 ? 'good' : aqi <= 100 ? 'moderate' : aqi <= 150 ? 'unhealthy for sensitive groups' : 'unhealthy';
    
    return {
      timestamp: new Date().toISOString(),
      sources: ['Mock EPA', 'Mock OpenAQ'],
      pollutants: {
        'PM2.5': {
          concentration: Math.random() * 50 + 10,
          unit: 'μg/m³',
          quality: quality
        },
        'PM10': {
          concentration: Math.random() * 80 + 20,
          unit: 'μg/m³',
          quality: quality
        },
        'NO2': {
          concentration: Math.random() * 40 + 10,
          unit: 'ppb',
          quality: quality
        },
        'O3': {
          concentration: Math.random() * 60 + 20,
          unit: 'ppb',
          quality: quality
        },
        'SO2': {
          concentration: Math.random() * 20 + 5,
          unit: 'ppb',
          quality: quality
        },
        'CO': {
          concentration: Math.random() * 5 + 1,
          unit: 'ppm',
          quality: quality
        }
      },
      aqi: aqi,
      stations: [{
        id: 'mock-station-1',
        name: 'Mock Air Quality Station',
        distance: Math.random() * 10 + 1,
        coordinates: {
          lat: parseFloat(lat) + (Math.random() - 0.5) * 0.01,
          lng: parseFloat(lng) + (Math.random() - 0.5) * 0.01
        },
        lastUpdate: new Date().toISOString()
      }],
      overallQuality: quality,
      healthRecommendations: this.getHealthRecommendations(aqi),
      metadata: {
        note: 'Mock data - external APIs unavailable',
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Get health recommendations based on AQI
   * @param {number} aqi - Air Quality Index
   * @returns {Array} Health recommendations
   */
  getHealthRecommendations(aqi) {
    if (aqi <= 50) {
      return ['Air quality is good. Enjoy outdoor activities.'];
    } else if (aqi <= 100) {
      return ['Air quality is moderate. Sensitive individuals should consider limiting outdoor activities.'];
    } else if (aqi <= 150) {
      return ['Air quality is unhealthy for sensitive groups. Children, elderly, and those with respiratory issues should avoid outdoor activities.'];
    } else {
      return ['Air quality is unhealthy. Everyone should avoid outdoor activities. Stay indoors with windows closed.'];
    }
  }
}

module.exports = AirQualityService;
