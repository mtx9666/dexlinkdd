# Dexlink Platform Deployment Guide

This guide will help you deploy the Dexlink platform using DigitalOcean. We'll use Docker for containerization and Nginx as a reverse proxy.

## Quick Setup Cost Estimate
- DigitalOcean Droplet (Basic): $5-10/month
- Managed PostgreSQL: $15/month
- Managed Redis: $15/month
- Domain & SSL: ~$10-15/year
Total: ~$40-45/month to start

## Prerequisites
1. Domain name (e.g., from Namecheap or GoDaddy)
2. DigitalOcean account
3. Alchemy API key (for Web3 provider)
4. Git repository access

## Step 1: Domain & DNS Setup
1. Purchase domain (e.g., dexlink.com)
2. Add domain to DigitalOcean
3. Update nameservers at your domain registrar to point to DigitalOcean:
   - ns1.digitalocean.com
   - ns2.digitalocean.com
   - ns3.digitalocean.com

## Step 2: Create DigitalOcean Resources

### Create Droplet
1. Log into DigitalOcean
2. Create new Droplet:
   - Ubuntu 22.04 LTS
   - Basic Plan ($10/month recommended to start)
   - Choose datacenter near your target users
   - Enable monitoring
   - Add SSH key authentication

### Create Database
1. Create managed PostgreSQL database:
   ```bash
   Name: dexlink-db
   Version: 15
   Size: Basic ($15/month)
   ```

### Create Redis Instance
1. Create managed Redis database:
   ```bash
   Name: dexlink-redis
   Version: 7
   Size: Basic ($15/month)
   ```

## Step 3: Server Setup

### Initial Server Setup
```bash
# SSH into your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Create deployment user
adduser dexlink
usermod -aG docker dexlink
```

### Setup Project Structure
```bash
# Switch to deployment user
su - dexlink

# Create project directory
mkdir -p ~/dexlink
cd ~/dexlink

# Clone repository
git clone https://github.com/your-username/dexlink-platform.git
```

## Step 4: Environment Setup

### Create Production Environment File
```bash
# Create .env file
nano ~/dexlink/backend/.env

# Add the following (replace with your values):
PORT=8000
HOST=0.0.0.0
DEBUG=False
ENVIRONMENT=production

# Database Configuration
DATABASE_URL=postgresql://user:password@your-db-host:5432/dexlink

# Redis Configuration
REDIS_URL=redis://your-redis-host:6379/0

# Blockchain Configuration
WEB3_PROVIDER_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
CHAIN_ID=1
HFT_BOT_PRIVATE_KEY=your-private-key-here

# Security
JWT_SECRET=generate-a-secure-random-string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
ALCHEMY_API_KEY=your-alchemy-api-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

## Step 5: Docker Setup

### Create Docker Compose File
```bash
# Create docker-compose.yml
nano ~/dexlink/docker-compose.yml
```

Add the following content:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    restart: always
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always

volumes:
  redis_data:
```

## Step 6: Nginx Configuration

### Create Nginx Config
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/dexlink.com
```

Add the following content:
```nginx
server {
    server_name dexlink.com www.dexlink.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/dexlink.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL Setup

```bash
# Install SSL certificate
sudo certbot --nginx -d dexlink.com -d www.dexlink.com
```

## Step 8: Deployment

### Deploy Application
```bash
cd ~/dexlink
docker-compose up -d
```

### Initialize Database
```bash
docker-compose exec backend alembic upgrade head
```

## Step 9: Monitoring Setup

### Setup Basic Monitoring
```bash
# Install monitoring tools
sudo apt install -y prometheus node-exporter

# Setup monitoring dashboard (optional)
docker run -d -p 3001:3000 grafana/grafana
```

## Step 10: Maintenance

### Backup Setup
Create a backup script:
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d)
pg_dump -h your-db-host -U your-db-user dexlink > backup_$DATE.sql
```

Add to crontab:
```bash
0 0 * * * /home/dexlink/backup.sh
```

### Update Script
```bash
#!/bin/bash
# update.sh
cd ~/dexlink
git pull
docker-compose build
docker-compose up -d
```

## Quick Commands

### Deployment
```bash
# Deploy updates
cd ~/dexlink
git pull
docker-compose up -d --build

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check status
docker-compose ps
```

### Database
```bash
# Connect to database
psql postgresql://user:password@your-db-host:5432/dexlink

# Run migrations
docker-compose exec backend alembic upgrade head
```

### Monitoring
```bash
# Check system resources
htop

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Security Checklist
- [ ] Update all default passwords
- [ ] Enable firewall (UFW)
- [ ] Setup fail2ban
- [ ] Regular security updates
- [ ] SSL certificate auto-renewal
- [ ] Secure environment variables
- [ ] Regular backups
- [ ] Rate limiting enabled
- [ ] DDoS protection (Cloudflare recommended)

## Troubleshooting

### Common Issues
1. WebSocket Connection Failed
   ```bash
   # Check WebSocket logs
   docker-compose logs -f backend
   # Verify Nginx WebSocket configuration
   ```

2. Database Connection Issues
   ```bash
   # Check database connectivity
   nc -zv your-db-host 5432
   # Verify environment variables
   ```

3. Redis Connection Issues
   ```bash
   # Test Redis connection
   redis-cli -h your-redis-host ping
   ```

### Getting Help
- Check application logs: `docker-compose logs`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check system logs: `journalctl -u docker`

## Scaling Tips
1. Use managed services when possible
2. Enable caching with Redis
3. Use load balancer for high traffic
4. Consider using CDN for static assets
5. Monitor and optimize database queries
6. Set up auto-scaling rules

## Next Steps
1. Setup CI/CD pipeline
2. Implement automated testing
3. Configure automated backups
4. Setup monitoring alerts
5. Implement rate limiting
6. Add DDoS protection
``` 