#!/usr/bin/env node

/**
 * NASA TEMPO Air Quality Forecast - API Testing Script
 * Tests all API connections and validates tokens
 */

const axios = require('axios');
require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const testAPI = async (name, testFunction) => {
  try {
    log(`\n${colors.bold}Testing ${name}...${colors.reset}`);
    const result = await testFunction();
    log(`✅ ${name}: SUCCESS`, 'green');
    if (result.data) {
      log(`   Data received: ${JSON.stringify(result.data).substring(0, 100)}...`);
    }
    return true;
  } catch (error) {
    log(`❌ ${name}: FAILED`, 'red');
    log(`   Error: ${error.message}`);
    return false;
  }
};

// Test NASA Earthdata
const testNASAEarthdata = async () => {
  const token = process.env.NASA_EARTHDATA_TOKEN;
  if (!token) {
    throw new Error('NASA_EARTHDATA_TOKEN not found in .env file');
  }
  
  const response = await axios.get(
    'https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/details?product=MOD04_L2&collection=61',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    }
  );
  
  return response;
};

// Test OpenWeatherMap
const testOpenWeatherMap = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY not found in .env file');
  }
  
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=${apiKey}`,
    { timeout: 10000 }
  );
  
  return response;
};

// Test AirNow
const testAirNow = async () => {
  const apiKey = process.env.AIRNOW_API_KEY;
  if (!apiKey) {
    throw new Error('AIRNOW_API_KEY not found in .env file');
  }
  
  const response = await axios.get(
    `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=10001&distance=25&API_KEY=${apiKey}`,
    { timeout: 10000 }
  );
  
  return response;
};

// Test OpenAQ v3 (API key required)
const testOpenAQ = async () => {
  const apiKey = process.env.OPENAQ_API_KEY || 'd282fb1ee29051fcbbd629dc2ed71a7b477ababcda6e52d84434c9eeefa47f42';
  
  const response = await axios.get(
    'https://api.openaq.org/v3/locations?limit=1&page=1&offset=0&sort=desc&radius=1000&coordinates=40.7128,-74.0060',
    {
      headers: {
        'X-API-Key': apiKey
      },
      timeout: 10000
    }
  );
  
  return response;
};

// Test Weather.gov (completely free, no configuration needed)
const testWeatherGov = async () => {
  const response = await axios.get(
    'https://api.weather.gov/points/40.7128,-74.0060',
    { timeout: 10000 }
  );
  
  return response;
};

// Test local server
const testLocalServer = async () => {
  const response = await axios.get('http://localhost:5000/api/health', {
    timeout: 5000
  });
  
  return response;
};

// Main testing function
const runTests = async () => {
  log(`${colors.bold}${colors.blue}🚀 NASA TEMPO Air Quality Forecast - API Testing${colors.reset}`);
  log(`${colors.blue}================================================${colors.reset}`);
  
  const results = {
    nasa: false,
    openweather: false,
    airnow: false,
    openaq: false,
    weathergov: false,
    localserver: false
  };
  
  // Test all APIs
  results.nasa = await testAPI('NASA Earthdata (TEMPO)', testNASAEarthdata);
  results.openweather = await testAPI('OpenWeatherMap', testOpenWeatherMap);
  results.airnow = await testAPI('AirNow', testAirNow);
  results.openaq = await testAPI('OpenAQ', testOpenAQ);
  results.weathergov = await testAPI('Weather.gov', testWeatherGov);
  results.localserver = await testAPI('Local Server', testLocalServer);
  
  // Summary
  log(`\n${colors.bold}📊 Test Results Summary:${colors.reset}`);
  log(`${colors.blue}================================${colors.reset}`);
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log(`✅ Passed: ${passed}/${total}`);
  
  if (results.nasa) log('   🌍 NASA Earthdata: Connected');
  if (results.openweather) log('   🌤️  OpenWeatherMap: Connected');
  if (results.airnow) log('   🏭 AirNow: Connected');
  if (results.openaq) log('   🌐 OpenAQ: Connected');
  if (results.weathergov) log('   🌦️  Weather.gov: Connected');
  if (results.localserver) log('   🖥️  Local Server: Running');
  
  if (passed === total) {
    log(`\n${colors.green}🎉 All APIs are working correctly!${colors.reset}`);
    log(`${colors.green}Your NASA TEMPO Air Quality Forecast app is ready to use!${colors.reset}`);
  } else {
    log(`\n${colors.yellow}⚠️  Some APIs failed. Check your .env file and API keys.${colors.reset}`);
    log(`${colors.yellow}See API_KEYS_GUIDE.md for detailed setup instructions.${colors.reset}`);
  }
  
  log(`\n${colors.blue}📝 Next Steps:${colors.reset}`);
  log('1. Open http://localhost:3000 in your browser');
  log('2. Explore the air quality dashboard');
  log('3. Configure notification settings');
  log('4. Test the forecast features');
};

// Run tests
runTests().catch(console.error);
