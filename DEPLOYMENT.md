# NASA TEMPO Air Quality Forecast - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose (for containerized deployment)
- Git

### Local Development Setup

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

3. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your API keys (see API Keys section below)
   ```

4. **Start the application**
   ```bash
   # Start the server (Terminal 1)
   npm run dev
   
   # Start the client (Terminal 2)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Individual Docker Builds

1. **Build server image**
   ```bash
   docker build -t tempo-air-quality:latest .
   ```

2. **Build client image**
   ```bash
   docker build -t tempo-air-quality-client:latest ./client
   ```

3. **Run containers**
   ```bash
   # Run server
   docker run -d -p 5000:5000 --name tempo-server tempo-air-quality:latest
   
   # Run client
   docker run -d -p 3000:80 --name tempo-client tempo-air-quality-client:latest
   ```

## ☁️ Cloud Deployment

### AWS Deployment

#### Option 1: AWS CloudFormation (Automated)

1. **Deploy infrastructure**
   ```bash
   aws cloudformation create-stack \
     --stack-name tempo-air-quality \
     --template-body file://aws-cloudformation.yaml \
     --parameters ParameterKey=Environment,ParameterValue=production \
                 ParameterKey=InstanceType,ParameterValue=t3.medium \
                 ParameterKey=KeyPairName,ParameterValue=your-key-pair
   ```

2. **Monitor deployment**
   ```bash
   aws cloudformation describe-stacks --stack-name tempo-air-quality
   ```

#### Option 2: Manual AWS Setup

1. **Create EC2 instances**
   - Launch Amazon Linux 2 instances
   - Configure security groups (ports 22, 80, 443, 5000)
   - Install Docker and Docker Compose

2. **Deploy application**
   ```bash
   # On EC2 instance
   git clone <repository-url>
   cd tempo-air-quality-forecast
   docker-compose up -d
   ```

3. **Configure Load Balancer**
   - Create Application Load Balancer
   - Configure target groups
   - Set up SSL certificates

#### Option 3: AWS ECS/Fargate

1. **Build and push images to ECR**
   ```bash
   aws ecr create-repository --repository-name tempo-air-quality
   aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   
   docker tag tempo-air-quality:latest <account>.dkr.ecr.<region>.amazonaws.com/tempo-air-quality:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/tempo-air-quality:latest
   ```

2. **Create ECS cluster and services**
   ```bash
   aws ecs create-cluster --cluster-name tempo-cluster
   # Create task definitions and services via AWS Console or CLI
   ```

### Google Cloud Platform (GCP)

1. **Deploy to Google Cloud Run**
   ```bash
   # Build and deploy server
   gcloud builds submit --tag gcr.io/PROJECT_ID/tempo-air-quality
   gcloud run deploy tempo-air-quality --image gcr.io/PROJECT_ID/tempo-air-quality --platform managed --region us-central1 --allow-unauthenticated
   
   # Build and deploy client
   cd client
   gcloud builds submit --tag gcr.io/PROJECT_ID/tempo-air-quality-client
   gcloud run deploy tempo-air-quality-client --image gcr.io/PROJECT_ID/tempo-air-quality-client --platform managed --region us-central1 --allow-unauthenticated
   ```

2. **Deploy to Google Kubernetes Engine (GKE)**
   ```bash
   # Create cluster
   gcloud container clusters create tempo-cluster --num-nodes=3 --zone=us-central1-a
   
   # Deploy application
   kubectl apply -f k8s/deployment.yaml
   ```

### Microsoft Azure

1. **Deploy to Azure Container Instances**
   ```bash
   # Build and push to Azure Container Registry
   az acr build --registry myregistry --image tempo-air-quality:latest .
   
   # Deploy container instance
   az container create --resource-group myResourceGroup --name tempo-app --image myregistry.azurecr.io/tempo-air-quality:latest --dns-name-label tempo-app --ports 5000
   ```

2. **Deploy to Azure Kubernetes Service (AKS)**
   ```bash
   # Create AKS cluster
   az aks create --resource-group myResourceGroup --name tempo-cluster --node-count 3 --enable-addons monitoring --generate-ssh-keys
   
   # Deploy application
   kubectl apply -f k8s/deployment.yaml
   ```

## 🔧 Configuration

### Required API Keys

1. **EPA AirNow API**
   - Register at: https://www.airnowapi.org/
   - Add to `.env`: `EPA_API_KEY=your_key_here`

2. **OpenAQ API**
   - Register at: https://openaq.org/
   - Add to `.env`: `OPENAQ_API_KEY=your_key_here`

3. **OpenWeatherMap API**
   - Register at: https://openweathermap.org/api
   - Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`

4. **Weather.gov API**
   - Register at: https://www.weather.gov/documentation/services-web-api
   - Add to `.env`: `WEATHER_GOV_API_KEY=your_key_here`

### Optional Integrations

1. **MongoDB Atlas** (for production database)
   ```bash
   # Add to .env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tempo-air-quality
   ```

2. **Redis Cloud** (for caching)
   ```bash
   # Add to .env
   REDIS_URL=redis://username:password@host:port
   ```

3. **Email Notifications** (SendGrid)
   ```bash
   # Add to .env
   SENDGRID_API_KEY=your_sendgrid_key
   ```

4. **SMS Notifications** (Twilio)
   ```bash
   # Add to .env
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

## 📊 Monitoring and Maintenance

### Health Checks

1. **Application Health**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Database Health**
   ```bash
   # MongoDB
   mongosh --eval "db.runCommand('ping')"
   
   # Redis
   redis-cli ping
   ```

### Logging

1. **View application logs**
   ```bash
   # Docker Compose
   docker-compose logs -f app
   
   # Kubernetes
   kubectl logs -f deployment/tempo-air-quality-app
   ```

2. **Log rotation**
   ```bash
   # Configure logrotate for production
   sudo nano /etc/logrotate.d/tempo-air-quality
   ```

### Performance Monitoring

1. **Prometheus Metrics**
   - Access: http://localhost:9090
   - Monitor application metrics and performance

2. **Grafana Dashboards**
   - Access: http://localhost:3001
   - Username: admin, Password: admin
   - View air quality trends and system metrics

### Backup and Recovery

1. **Database Backup**
   ```bash
   # MongoDB backup
   mongodump --uri="mongodb://localhost:27017/tempo-air-quality" --out=/backup/$(date +%Y%m%d)
   
   # Redis backup
   redis-cli BGSAVE
   ```

2. **Application Backup**
   ```bash
   # Backup application data
   tar -czf tempo-backup-$(date +%Y%m%d).tar.gz /app/data
   ```

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit API keys to version control
   - Use secure secret management (AWS Secrets Manager, Azure Key Vault)

2. **Network Security**
   - Configure firewalls and security groups
   - Use HTTPS in production
   - Implement rate limiting

3. **Application Security**
   - Enable CORS protection
   - Implement input validation
   - Use secure authentication (JWT)

### SSL/TLS Configuration

1. **Obtain SSL Certificate**
   ```bash
   # Using Let's Encrypt
   certbot certonly --standalone -d yourdomain.com
   ```

2. **Configure Nginx**
   ```bash
   # Update nginx.conf with SSL configuration
   server {
       listen 443 ssl;
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   }
   ```

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Errors**
   ```bash
   # Check API key configuration
   echo $EPA_API_KEY
   
   # Test API connectivity
   curl "https://www.airnowapi.org/aq/observation/latLong/current/?latitude=40.7128&longitude=-74.0060&format=application/json&API_KEY=$EPA_API_KEY"
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB connection
   mongosh "mongodb://localhost:27017/tempo-air-quality"
   
   # Check Redis connection
   redis-cli ping
   ```

3. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats
   
   # Increase memory limits in docker-compose.yml
   ```

### Performance Optimization

1. **Caching**
   - Enable Redis caching for API responses
   - Implement browser caching for static assets

2. **Database Optimization**
   - Create appropriate indexes
   - Implement connection pooling

3. **CDN Configuration**
   - Use CloudFront/Azure CDN for static assets
   - Enable compression

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
   ```bash
   # Add more instances to Auto Scaling Group
   aws autoscaling update-auto-scaling-group --auto-scaling-group-name tempo-asg --desired-capacity 5
   ```

2. **Database Scaling**
   ```bash
   # MongoDB replica set
   mongosh --eval "rs.initiate()"
   
   # Redis cluster
   redis-cli --cluster create node1:7000 node2:7000 node3:7000
   ```

### Vertical Scaling

1. **Instance Upgrades**
   ```bash
   # Update instance type in CloudFormation
   aws cloudformation update-stack --stack-name tempo-air-quality --use-previous-template --parameters ParameterKey=InstanceType,ParameterValue=t3.large
   ```

2. **Database Scaling**
   ```bash
   # RDS instance class upgrade
   aws rds modify-db-instance --db-instance-identifier tempo-database --db-instance-class db.t3.medium
   ```

## 📞 Support

### Getting Help

1. **Documentation**
   - Check README.md for general information
   - Review API documentation at `/api/health`

2. **Issues**
   - Create GitHub issues for bugs
   - Check existing issues for solutions

3. **Community**
   - Join NASA Earth Science community forums
   - Participate in hackathon discussions

### Contact Information

- **Project Repository**: [GitHub Repository URL]
- **Documentation**: [Documentation URL]
- **Support Email**: [Support Email]

---

**Built for NASA Hackathon - Earth Science Division**  
**From EarthData to Action: Cloud Computing with Earth Observation Data**
