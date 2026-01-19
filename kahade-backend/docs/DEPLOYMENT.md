# Deployment Guide

## Prerequisites

- VPS or Cloud Server (DigitalOcean, AWS, Google Cloud, etc.)
- Domain name
- SSL certificate (Let's Encrypt recommended)
- Docker & Docker Compose installed
- Git installed

## Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Install Node.js (if not using Docker)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Clone Repository

```bash
git clone https://github.com/rekberkan/kahade.git
cd kahade/kahade-backend
```

### 3. Environment Configuration

```bash
cp .env.example .env.production
nano .env.production
```

Update all production values:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/kahade_prod
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
REDIS_PASSWORD=<strong-password>
BLOCKCHAIN_PRIVATE_KEY=<your-private-key>
PAYMENT_GATEWAY_API_KEY=<your-api-key>
MAIL_USER=<your-email>
MAIL_PASSWORD=<your-password>
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d kahade.com -d www.kahade.com
```

### 5. Deploy with Docker

```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

### 6. Deploy without Docker

```bash
# Install dependencies
yarn install --production

# Generate Prisma Client
yarn prisma:generate

# Run migrations
yarn prisma:migrate deploy

# Build application
yarn build

# Start with PM2
pm2 start deploy/pm2.config.js
pm2 save
pm2 startup
```

### 7. Setup Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/kahade
sudo ln -s /etc/nginx/sites-available/kahade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Continuous Deployment

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/kahade/kahade-backend
            ./deploy/deploy.sh
```

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 status
```

### Application Logs

```bash
tail -f logs/application.log
tail -f logs/error.log
```

## Backup

### Automated Backup

Add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/kahade-backend/scripts/backup-db.sh
```

### Manual Backup

```bash
./scripts/backup-db.sh
```

### Restore

```bash
./scripts/restore-db.sh backups/kahade_backup_20240120.sql.gz
```

## Scaling

### Horizontal Scaling

1. Deploy multiple instances with load balancer
2. Use Redis for session management
3. Use shared storage for uploads

### Vertical Scaling

Adjust PM2 instances:

```javascript
// pm2.config.js
instances: 4, // or 'max' for all CPU cores
```

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs kahade-api

# Check process status
pm2 status

# Restart application
pm2 restart kahade-api
```

### Database connection issues

```bash
# Test database connection
psql $DATABASE_URL

# Check Prisma
yarn prisma:studio
```

### High memory usage

```bash
# Monitor resources
pm2 monit

# Restart application
pm2 reload kahade-api
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall
- [ ] Setup SSL certificates
- [ ] Configure rate limiting
- [ ] Enable CORS properly
- [ ] Setup backup automation
- [ ] Configure monitoring
- [ ] Enable application logging
- [ ] Secure environment variables
- [ ] Regular security updates
