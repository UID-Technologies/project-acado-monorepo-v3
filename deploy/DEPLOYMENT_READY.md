# 🚀 ACADO PLATFORM - DEPLOYMENT READY!

**Date:** December 2, 2025  
**Status:** ✅ All Three Containers Ready for Deployment  
**Platform:** Azure Ubuntu VM (ARM64)

---

## ✅ DEPLOYMENT STATUS

### Containers Ready:

| Container | Status | Port | Description |
|-----------|--------|------|-------------|
| **acado-client** | ✅ Ready | 80 | Client-facing React app |
| **acado-admin** | ✅ Ready | 8080 | Admin dashboard |
| **acado-api** | ✅ Ready | 5000 | Backend Node.js API |

### Prerequisites:

| Requirement | Status |
|-------------|--------|
| Docker | ✅ Required |
| Docker Compose | ✅ Required |
| MongoDB (local) | ✅ Required |
| Ports 80, 8080, 5000 | ✅ Must be open |

---

## 🔧 WHAT WAS FIXED

### 1. acado-client Container ✅

**Previous Status:** ❌ Commented out (case sensitivity issues)  
**Current Status:** ✅ Ready for deployment

**Fixes Applied:**
- ✅ Case sensitivity issues resolved
- ✅ Import paths corrected
- ✅ Build process verified
- ✅ Nginx configuration ready
- ✅ Environment variables configured
- ✅ Health checks added

### 2. Docker Compose Configuration ✅

**Changes:**
- ✅ Uncommented acado-client service
- ✅ Added health check dependencies
- ✅ Configured proper networking
- ✅ Set build arguments
- ✅ Added startup conditions

### 3. Dockerfile.client ✅

**Improvements:**
- ✅ Fixed nginx config path
- ✅ Optimized build process
- ✅ Added health check
- ✅ ARM64 platform specified

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment (On Azure VM):

- [ ] **Docker installed and running**
  ```bash
  docker --version
  docker compose version
  ```

- [ ] **MongoDB installed and running**
  ```bash
  sudo systemctl status mongod
  mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
  ```

- [ ] **Ports open in Azure NSG**
  - Port 80 (Client)
  - Port 8080 (Admin)
  - Port 5000 (API)
  - Port 22 (SSH)

- [ ] **Repository cloned**
  ```bash
  cd ~/project-acado-monorepo-v3
  git pull origin main
  ```

- [ ] **Environment variables configured**
  ```bash
  cd deploy
  cp env.template .env
  nano .env  # Update with your values
  ```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare Environment

```bash
cd ~/project-acado-monorepo-v3/deploy

# Create .env file if not exists
if [ ! -f .env ]; then
  cp env.template .env
  echo "⚠️  Please edit .env file with your configuration"
  exit 1
fi
```

### Step 2: Update Environment Variables

Edit `deploy/.env`:

```env
# CRITICAL: Update these values!
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-CHANGE-THIS

# Update with your Azure VM IP
ADMIN_API_URL=http://20.197.35.236:5000
CLIENT_API_URL=http://20.197.35.236:5000
CLIENT_APP_URL=http://20.197.35.236

# Optional: Email, Storage, OAuth
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 3: Build All Containers

```bash
# Build all three containers
docker compose build --no-cache

# This will build:
# 1. acado-api (Node.js backend)
# 2. acado-admin (React admin dashboard)
# 3. acado-client (React client app)
```

**Expected Output:**
```
[+] Building acado-api... ✅
[+] Building acado-admin... ✅
[+] Building acado-client... ✅
```

### Step 4: Start All Containers

```bash
# Start all containers in detached mode
docker compose up -d

# Or use the deployment script
bash scripts/deploy.sh up
```

**Expected Output:**
```
[+] Running 3/3
 ✔ Container acado-api     Started
 ✔ Container acado-admin   Started
 ✔ Container acado-client  Started
```

### Step 5: Verify Deployment

```bash
# Check container status
docker compose ps

# Should show:
# acado-api     running   5000/tcp
# acado-admin   running   0.0.0.0:8080->80/tcp
# acado-client  running   0.0.0.0:80->80/tcp

# Check logs
docker compose logs -f

# Test endpoints
curl http://localhost:5000/health        # API
curl -I http://localhost:8080            # Admin
curl -I http://localhost:80              # Client
```

### Step 6: Initialize Database (First Time Only)

```bash
# Create test users
mongosh acadodb ~/project-acado-monorepo-v3/acado-api/scripts/create-test-users.js

# Generate sample data
mongosh acadodb ~/project-acado-monorepo-v3/scripts/generate-sample-data.js
```

---

## 🌐 ACCESS URLS

After deployment, access the applications:

| Service | URL | Description |
|---------|-----|-------------|
| **Client App** | `http://20.197.35.236` | Main website |
| **Admin Dashboard** | `http://20.197.35.236:8080` | Admin portal |
| **API** | `http://20.197.35.236:5000` | Backend API |
| **API Docs** | `http://20.197.35.236:5000/api-docs` | Swagger docs |

**Test Credentials:**
- Email: `superadmin@test.com`
- Password: `password123`

---

## 📊 CONTAINER CONFIGURATION

### acado-client

**Build Context:** `../acado-client`  
**Dockerfile:** `../deploy/Dockerfile.client`  
**Port:** 80  
**Technology:** React + Vite + Nginx  
**Platform:** linux/arm64

**Environment Variables:**
- `VITE_API_BASE_URL` → API endpoint
- `VITE_APP_URL` → Client URL
- `VITE_ENABLE_MOCK` → false
- `VITE_APP_DEBUG` → false

**Features:**
- ✅ Nginx web server
- ✅ Gzip compression
- ✅ SPA routing support
- ✅ Static asset caching
- ✅ Health check endpoint
- ✅ Security headers

### acado-admin

**Build Context:** `../acado-admin`  
**Dockerfile:** `../deploy/Dockerfile.admin`  
**Port:** 8080  
**Technology:** React + Vite + Nginx  
**Platform:** linux/arm64

**Environment Variables:**
- `VITE_API_BASE_URL` → API endpoint

**Features:**
- ✅ Admin authentication
- ✅ Course management
- ✅ User management
- ✅ Dashboard analytics

### acado-api

**Build Context:** `../acado-api`  
**Dockerfile:** `../deploy/Dockerfile.api`  
**Port:** 5000  
**Technology:** Node.js + Express  
**Platform:** linux/arm64  
**Network Mode:** host (for MongoDB access)

**Environment Variables:**
- `NODE_ENV` → production
- `PORT` → 5000
- `MONGO_URI` → mongodb://127.0.0.1:27017/acadodb
- `JWT_SECRET` → From .env
- `CORS_ORIGIN` → *

**Features:**
- ✅ RESTful API
- ✅ JWT authentication
- ✅ MongoDB integration
- ✅ File uploads
- ✅ Email notifications
- ✅ Swagger documentation

---

## 🔍 VERIFICATION TESTS

### Test 1: Container Health

```bash
# Check all containers are running
docker compose ps

# Expected: All containers "Up" and "healthy"
```

### Test 2: API Health

```bash
curl http://localhost:5000/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Test 3: Admin Dashboard

```bash
# Check admin is accessible
curl -I http://localhost:8080

# Expected: HTTP/1.1 200 OK
```

### Test 4: Client App

```bash
# Check client is accessible
curl -I http://localhost:80

# Expected: HTTP/1.1 200 OK
```

### Test 5: MongoDB Connection

```bash
# Check API can connect to MongoDB
docker compose logs acado-api | grep "MongoDB connected"

# Expected: "MongoDB connected successfully"
```

### Test 6: End-to-End Test

1. Open browser: `http://20.197.35.236`
2. Navigate to sign-in page
3. Login with test credentials
4. Verify dashboard loads
5. Check courses page
6. Check events page

---

## 🐛 TROUBLESHOOTING

### Issue 1: acado-client build fails

**Symptoms:**
```
ERROR [acado-client builder] RUN npm run build
Could not load /app/src/...
```

**Solutions:**
1. Check case sensitivity in imports
2. Verify all files exist
3. Check .dockerignore doesn't exclude needed files
4. Build with verbose output:
   ```bash
   docker compose build --no-cache --progress=plain acado-client
   ```

### Issue 2: Images not loading in client

**Symptoms:**
- Blank pages
- Missing images
- 404 errors

**Solutions:**
1. Check nginx config
2. Verify dist folder was copied
3. Check browser console for errors
4. Verify API URL is correct

### Issue 3: CORS errors

**Symptoms:**
```
Access to fetch at 'http://...' has been blocked by CORS
```

**Solutions:**
1. Update CORS_ORIGIN in .env
2. Rebuild acado-api:
   ```bash
   docker compose build --no-cache acado-api
   docker compose up -d acado-api
   ```

### Issue 4: Port conflicts

**Symptoms:**
```
Error: bind: address already in use
```

**Solutions:**
1. Check what's using the port:
   ```bash
   sudo lsof -i :80
   sudo lsof -i :8080
   ```
2. Stop conflicting service or change port in docker-compose.yml

---

## 🔄 UPDATE PROCEDURE

### For Code Changes:

```bash
cd ~/project-acado-monorepo-v3

# Pull latest code
git pull origin main

# Rebuild specific service
cd deploy
docker compose build --no-cache acado-client
docker compose up -d acado-client

# Or rebuild all
docker compose up -d --build
```

### For Environment Changes:

```bash
cd ~/project-acado-monorepo-v3/deploy

# Edit .env
nano .env

# Rebuild affected services
docker compose build --no-cache acado-admin acado-client
docker compose up -d
```

---

## 📊 MONITORING

### Container Logs

```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f acado-client

# Last 100 lines
docker compose logs --tail=100 acado-client
```

### Resource Usage

```bash
# Real-time stats
docker stats

# Disk usage
docker system df
```

### Health Checks

```bash
# Check health status
docker compose ps

# Manual health check
curl http://localhost:80/health        # Client
curl http://localhost:8080/health      # Admin (if configured)
curl http://localhost:5000/health      # API
```

---

## 🎯 POST-DEPLOYMENT TASKS

### 1. Test All Features

- [ ] Sign in / Sign up
- [ ] Browse courses
- [ ] View course details
- [ ] Browse events
- [ ] View event details
- [ ] Browse scholarships
- [ ] Community pages
- [ ] Universities listing

### 2. Configure SSL (Production)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### 3. Set Up Monitoring

- [ ] Set up log aggregation
- [ ] Configure alerts
- [ ] Monitor resource usage
- [ ] Set up backups

### 4. Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Configure caching
- [ ] Optimize images
- [ ] Monitor response times

---

## 📄 QUICK REFERENCE

### Common Commands

```bash
# Start all containers
docker compose up -d

# Stop all containers
docker compose down

# Restart specific container
docker compose restart acado-client

# Rebuild and restart
docker compose up -d --build acado-client

# View logs
docker compose logs -f acado-client

# Execute command in container
docker exec -it acado-client sh

# Clean up
docker compose down -v  # Removes volumes too
```

### Port Mapping

| Container | Internal Port | External Port | Access |
|-----------|---------------|---------------|--------|
| acado-client | 80 | 80 | Public |
| acado-admin | 80 | 8080 | Public |
| acado-api | 5000 | 5000 (host mode) | Public |

---

## ✅ DEPLOYMENT READY!

**All three containers are now configured and ready for deployment!**

**Next Steps:**
1. Update `.env` file with your Azure VM IP
2. Run `docker compose up -d --build`
3. Wait for all containers to be healthy
4. Access the applications via browser
5. Test all features

**Estimated Deployment Time:** 15-20 minutes (including build)

---

## 🎉 SUCCESS CRITERIA

Deployment is successful if:
- ✅ All 3 containers running
- ✅ All health checks passing
- ✅ Client app accessible on port 80
- ✅ Admin dashboard accessible on port 8080
- ✅ API responding on port 5000
- ✅ MongoDB connection working
- ✅ No errors in logs
- ✅ Can sign in successfully
- ✅ All pages load correctly

---

**Ready to deploy!** 🚀

