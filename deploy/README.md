# ACADO Platform - Docker Deployment Guide

This guide covers deploying the ACADO platform (acado-api, acado-admin, acado-client) on an Azure Ubuntu VM with ARM64 architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Azure Ubuntu VM (ARM64)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ acado-client│  │ acado-admin │  │  acado-api  │              │
│  │   (React)   │  │   (React)   │  │  (Node.js)  │              │
│  │   Port 80   │  │  Port 8080  │  │  Port 5000  │              │
│  │   nginx     │  │   nginx     │  │   express   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                MongoDB (Local on Host)                   │    │
│  │                    Port 27017                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

### On Azure VM (Ubuntu ARM64)

1. **Docker & Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add user to docker group
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   
   # Verify installation
   docker --version
   docker compose version
   ```

2. **MongoDB (Local Installation)**
   ```bash
   # Import MongoDB public GPG key
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
      sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   
   # Add MongoDB repository (for ARM64)
   echo "deb [ arch=arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
      sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   
   # Install MongoDB
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Verify MongoDB is running
   sudo systemctl status mongod
   mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
   ```

3. **Open Required Ports (Azure NSG)**
   - Port 80 (HTTP - Client)
   - Port 8080 (Admin Dashboard)
   - Port 5000 (API - optional, can be internal only)
   - Port 22 (SSH)

## Deployment Steps

### 1. Clone the Repository

```bash
cd /opt
sudo git clone <your-repo-url> acado
cd acado
```

### 2. Configure Environment Variables

```bash
cd deploy

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Important variables to update:**

```env
# MUST CHANGE: JWT secret (min 32 characters)
JWT_SECRET=your-secure-random-string-at-least-32-chars

# Update with your Azure VM's public IP or domain
ADMIN_API_URL=http://<your-vm-ip>:5000
CLIENT_API_URL=http://<your-vm-ip>:5000
CLIENT_APP_URL=http://<your-vm-ip>
```

### 3. Build and Deploy

```bash
# Build and start all containers
docker compose up -d --build

# Check container status
docker compose ps

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f acado-api
```

### 4. Initialize Database (First Time Only)

```bash
# Create test users
mongosh acadodb /opt/acado/acado-api/scripts/create-test-users.js

# Generate sample data
mongosh acadodb /opt/acado/acado-api/scripts/generate-sample-data.js
```

### 5. Verify Deployment

```bash
# Check API health
curl http://localhost:5000/health

# Check Admin Dashboard
curl -I http://localhost:8080

# Check Client App
curl -I http://localhost:80
```

## Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Client App | `http://<vm-ip>:80` | Main client application |
| Admin Dashboard | `http://<vm-ip>:8080` | Admin management portal |
| API | `http://<vm-ip>:5000` | Backend API |
| API Docs | `http://<vm-ip>:5000/api-docs` | Swagger API documentation |

## Management Commands

### Container Management

```bash
# Stop all containers
docker compose down

# Restart all containers
docker compose restart

# Restart specific service
docker compose restart acado-api

# Rebuild and restart (after code changes)
docker compose up -d --build

# View resource usage
docker stats
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f acado-api

# Last 100 lines
docker compose logs --tail=100 acado-api
```

### Database Access

```bash
# Connect to MongoDB
mongosh acadodb

# Backup database
mongodump --db acadodb --out /backup/$(date +%Y%m%d)

# Restore database
mongorestore --db acadodb /backup/20240101/acadodb
```

## Troubleshooting

### API Cannot Connect to MongoDB

1. **Check MongoDB is running:**
   ```bash
   sudo systemctl status mongod
   ```

2. **Check MongoDB is listening:**
   ```bash
   sudo netstat -tlnp | grep 27017
   ```

3. **Check MongoDB bind address:**
   ```bash
   cat /etc/mongod.conf | grep bindIp
   # Should include 127.0.0.1 or 0.0.0.0
   ```

4. **Test connection from container:**
   ```bash
   docker exec -it acado-api sh
   wget -qO- http://host.docker.internal:27017
   ```

### Container Won't Start

```bash
# Check container logs
docker compose logs acado-api

# Check if port is already in use
sudo lsof -i :5000

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### Frontend Shows Blank Page

1. Check browser console for errors
2. Verify API URL in environment variables
3. Check CORS settings in API

### Permission Issues

```bash
# Fix upload directory permissions
docker exec -it acado-api chown -R nodejs:nodejs /app/uploads

# Or from host
sudo chown -R 1001:1001 /var/lib/docker/volumes/deploy_api-uploads/_data
```

## SSL/TLS Configuration (Production)

For production, set up SSL using Nginx reverse proxy or Azure Application Gateway:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com
```

## Updating the Application

```bash
cd /opt/acado

# Pull latest changes
git pull origin main

# Rebuild and restart
cd deploy
docker compose up -d --build
```

## Backup Strategy

Create a backup script:

```bash
#!/bin/bash
# /opt/acado/scripts/backup.sh

BACKUP_DIR="/backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db acadodb --out $BACKUP_DIR/mongodb

# Backup uploads
cp -r /var/lib/docker/volumes/deploy_api-uploads/_data $BACKUP_DIR/uploads

# Compress
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

# Keep last 7 days
find /backup -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

Add to cron:
```bash
crontab -e
# Add: 0 2 * * * /opt/acado/scripts/backup.sh
```

## Support

For issues, check:
1. Container logs: `docker compose logs -f`
2. MongoDB logs: `sudo journalctl -u mongod`
3. System resources: `htop` or `docker stats`

