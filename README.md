# NASA TEMPO Air Quality Forecast Application

A comprehensive web-based application that forecasts air quality by integrating real-time NASA TEMPO satellite data with ground-based air quality measurements and weather data. Built for the NASA Hackathon challenge focusing on cleaner, safer skies.

## 🌟 Features

- **Real-time Air Quality Monitoring**: Integration with NASA TEMPO satellite data
- **Ground-based Data Integration**: EPA AirNow and OpenAQ API integration
- **Weather Data Integration**: OpenWeatherMap and Weather.gov APIs
- **Machine Learning Forecasting**: LSTM-based air quality prediction models
- **Real-time Notifications**: WebSocket-based alerts for poor air quality
- **Interactive Maps**: Leaflet-based mapping with air quality overlays
- **Responsive Dashboard**: Modern React-based user interface
- **Cloud-ready Architecture**: Scalable backend with microservices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB (optional, for production)
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tempo-air-quality-forecast
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Start the application**
   ```bash
   # Start the server
   npm run dev
   
   # In another terminal, start the client
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/health

## 📡 API Endpoints

### Air Quality Data
- `GET /api/air-quality/current` - Current air quality data
- `GET /api/air-quality/stations` - Nearby monitoring stations
- `GET /api/air-quality/aqi` - AQI information and health recommendations
- `GET /api/air-quality/trends` - Historical air quality trends

### TEMPO Satellite Data
- `GET /api/tempo/current` - Current TEMPO satellite data
- `GET /api/tempo/historical` - Historical TEMPO data
- `GET /api/tempo/forecast` - TEMPO-based forecasts
- `GET /api/tempo/coverage` - Data coverage information

### Weather Data
- `GET /api/weather/current` - Current weather conditions
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/air-quality-factors` - Weather-based air quality factors

### Forecasting
- `GET /api/forecast/comprehensive` - Comprehensive air quality forecast
- `GET /api/forecast/aqi` - AQI forecast
- `GET /api/forecast/pollutant` - Specific pollutant forecast
- `GET /api/forecast/alerts` - Forecast-based alerts

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to location-based alerts
- `DELETE /api/notifications/unsubscribe` - Unsubscribe from alerts
- `PUT /api/notifications/preferences` - Update notification preferences
- `GET /api/notifications/history` - Notification history
- `POST /api/notifications/test` - Send test notification

## 🏗️ Architecture

### Backend Services
- **TempoDataService**: NASA TEMPO satellite data integration
- **AirQualityService**: Ground-based air quality data integration
- **WeatherService**: Weather data integration and air quality factor calculation
- **ForecastService**: Machine learning-based air quality forecasting
- **NotificationService**: Real-time alert system with WebSocket support

### Frontend Components
- **Dashboard**: Real-time air quality monitoring dashboard
- **MapView**: Interactive map with air quality overlays
- **Forecast**: Air quality forecasting interface
- **Alerts**: Notification management system
- **Settings**: User preferences and configuration

### Data Flow
1. **Data Collection**: TEMPO satellite, ground stations, weather APIs
2. **Data Processing**: Real-time processing and quality assessment
3. **Machine Learning**: LSTM models for air quality forecasting
4. **Real-time Updates**: WebSocket-based live data streaming
5. **User Interface**: React-based responsive dashboard

## 🔧 Configuration

### API Keys Required
- **EPA AirNow API**: For ground-based air quality data
- **OpenAQ API**: Additional air quality data sources
- **OpenWeatherMap API**: Weather data and forecasts
- **Weather.gov API**: Additional weather data sources

### Optional Integrations
- **MongoDB**: For data persistence and historical analysis
- **Redis**: For caching and session management
- **AWS Services**: For cloud scaling and data storage
- **Email/SMS Services**: For notification delivery

## 📊 Machine Learning Models

The application uses LSTM (Long Short-Term Memory) neural networks for air quality forecasting:

- **Input Features**: Historical air quality, weather conditions, temporal patterns
- **Output**: Multi-hour air quality predictions with confidence intervals
- **Training Data**: Historical TEMPO and ground-based measurements
- **Model Architecture**: Multi-layer LSTM with dropout for regularization

## 🌐 Cloud Deployment

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### AWS Deployment
- **EC2**: For application hosting
- **RDS**: For database management
- **S3**: For data storage and model artifacts
- **CloudFront**: For CDN and static asset delivery
- **Lambda**: For serverless functions and data processing

### Kubernetes Deployment
```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/
```

## 📈 Monitoring and Analytics

- **Real-time Metrics**: Air quality trends and patterns
- **Performance Monitoring**: API response times and error rates
- **User Analytics**: Usage patterns and feature adoption
- **Alert Analytics**: Notification effectiveness and user engagement

## 🔒 Security Features

- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Data sanitization and validation
- **Authentication**: JWT-based user authentication (optional)
- **HTTPS**: SSL/TLS encryption for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA Earth Science Division** for the TEMPO mission data
- **EPA AirNow** for ground-based air quality data
- **OpenAQ** for additional air quality data sources
- **OpenWeatherMap** for weather data services
- **React and Node.js** communities for excellent frameworks

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Advanced ML Models**: Transformer-based forecasting models
- **IoT Integration**: Sensor network data integration
- **Blockchain**: Decentralized air quality data verification
- **AR/VR**: Immersive air quality visualization
- **AI Chatbot**: Intelligent air quality assistant

---

**Built with ❤️ for NASA Hackathon - Earth Science Division**
