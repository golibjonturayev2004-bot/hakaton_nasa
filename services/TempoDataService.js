const axios = require('axios');
const moment = require('moment');

class TempoDataService {
  constructor() {
    this.baseUrl = 'https://tempo.gsfc.nasa.gov/api';
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Fetch TEMPO satellite data for air quality monitoring
   * @param {Object} params - Query parameters
   * @param {number} params.lat - Latitude
   * @param {number} params.lng - Longitude
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} TEMPO data
   */
  async fetchTempoData(params) {
    const cacheKey = `tempo-${params.lat}-${params.lng}-${params.startDate}-${params.endDate}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`${this.baseUrl}/tempo`, {
        params: {
          lat: params.lat,
          lon: params.lng,
          start_date: params.startDate,
          end_date: params.endDate,
          format: 'json',
          variables: 'NO2,O3,SO2,HCHO,AOD'
        },
        timeout: 30000
      });

      const processedData = this.processTempoData(response.data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;
    } catch (error) {
      console.error('Error fetching TEMPO data:', error.message);
      // Return mock data when external API fails
      return this.getMockTempoData(params);
    }
  }

  /**
   * Process raw TEMPO data into standardized format
   * @param {Object} rawData - Raw TEMPO API response
   * @returns {Object} Processed data
   */
  processTempoData(rawData) {
    const processed = {
      timestamp: new Date().toISOString(),
      location: {
        lat: rawData.latitude,
        lng: rawData.longitude
      },
      pollutants: {
        NO2: {
          concentration: rawData.NO2?.value || 0,
          unit: 'ppb',
          quality: this.assessQuality('NO2', rawData.NO2?.value || 0)
        },
        O3: {
          concentration: rawData.O3?.value || 0,
          unit: 'ppb',
          quality: this.assessQuality('O3', rawData.O3?.value || 0)
        },
        SO2: {
          concentration: rawData.SO2?.value || 0,
          unit: 'ppb',
          quality: this.assessQuality('SO2', rawData.SO2?.value || 0)
        },
        HCHO: {
          concentration: rawData.HCHO?.value || 0,
          unit: 'ppb',
          quality: this.assessQuality('HCHO', rawData.HCHO?.value || 0)
        }
      },
      aerosolOpticalDepth: {
        value: rawData.AOD?.value || 0,
        unit: 'dimensionless',
        quality: this.assessAODQuality(rawData.AOD?.value || 0)
      },
      dataQuality: {
        confidence: rawData.confidence || 'medium',
        coverage: rawData.coverage || 'partial',
        resolution: rawData.resolution || '10km'
      }
    };

    return processed;
  }

  /**
   * Assess air quality based on pollutant concentration
   * @param {string} pollutant - Pollutant type
   * @param {number} concentration - Concentration value
   * @returns {string} Quality assessment
   */
  assessQuality(pollutant, concentration) {
    const thresholds = {
      NO2: { good: 20, moderate: 40, unhealthy: 100 },
      O3: { good: 50, moderate: 100, unhealthy: 200 },
      SO2: { good: 30, moderate: 60, unhealthy: 150 },
      HCHO: { good: 10, moderate: 20, unhealthy: 50 }
    };

    const threshold = thresholds[pollutant];
    if (!threshold) return 'unknown';

    if (concentration <= threshold.good) return 'good';
    if (concentration <= threshold.moderate) return 'moderate';
    if (concentration <= threshold.unhealthy) return 'unhealthy';
    return 'hazardous';
  }

  /**
   * Assess aerosol optical depth quality
   * @param {number} aod - AOD value
   * @returns {string} Quality assessment
   */
  assessAODQuality(aod) {
    if (aod <= 0.1) return 'excellent';
    if (aod <= 0.3) return 'good';
    if (aod <= 0.5) return 'moderate';
    if (aod <= 0.7) return 'poor';
    return 'hazardous';
  }

  /**
   * Get real-time TEMPO data for a specific location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Real-time TEMPO data
   */
  async getRealTimeData(lat, lng) {
    const today = moment().format('YYYY-MM-DD');
    return await this.fetchTempoData({
      lat,
      lng,
      startDate: today,
      endDate: today
    });
  }

  /**
   * Get historical TEMPO data for trend analysis
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} Historical data array
   */
  async getHistoricalData(lat, lng, days = 7) {
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
    
    return await this.fetchTempoData({
      lat,
      lng,
      startDate,
      endDate
    });
  }

  /**
   * Update TEMPO data cache
   */
  async updateTempoData() {
    console.log('Updating TEMPO data cache...');
    // Clear expired cache entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
    console.log(`TEMPO cache updated. Current entries: ${this.cache.size}`);
  }

  /**
   * Get data coverage information
   * @returns {Object} Coverage information
   */
  getCoverageInfo() {
    return {
      region: 'North America',
      resolution: '10km',
      temporalResolution: '15 minutes',
      spatialCoverage: 'Continental US, Canada, Mexico',
      dataLatency: 'Near real-time',
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Get mock TEMPO data when external API fails
   * @param {Object} params - Query parameters
   * @returns {Object} Mock TEMPO data
   */
  getMockTempoData(params) {
    const { lat, lng } = params;
    
    return {
      timestamp: new Date().toISOString(),
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      pollutants: {
        NO2: {
          concentration: Math.random() * 50 + 10,
          unit: 'ppb',
          quality: 'moderate'
        },
        O3: {
          concentration: Math.random() * 80 + 20,
          unit: 'ppb',
          quality: 'good'
        },
        SO2: {
          concentration: Math.random() * 20 + 5,
          unit: 'ppb',
          quality: 'good'
        },
        HCHO: {
          concentration: Math.random() * 15 + 3,
          unit: 'ppb',
          quality: 'moderate'
        }
      },
      aerosolOpticalDepth: {
        value: Math.random() * 0.5 + 0.1,
        unit: 'dimensionless',
        quality: 'good'
      },
      dataQuality: {
        confidence: 'medium',
        resolution: '10km',
        coverage: 'partial',
        note: 'Mock data - external API unavailable'
      },
      metadata: {
        source: 'TEMPO Satellite (Mock)',
        region: 'North America',
        resolution: '10km',
        temporalResolution: '15 minutes',
        spatialCoverage: 'Continental US, Canada, Mexico',
        dataLatency: 'Near real-time',
        lastUpdate: new Date().toISOString()
      }
    };
  }
}

module.exports = TempoDataService;
