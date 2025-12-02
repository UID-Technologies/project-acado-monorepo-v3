# ACADO Monorepo

ACADO is an end‑to‑end admissions/workflow platform composed of a React admin UI, a React client app, a TypeScript/Node backend API, and supporting utilities. This repository maintains **all** source, deployment manifests, CI/CD pipelines, and runbooks so it can serve as the single source of truth for engineers and operators.

---

## 📖 Table of Contents

- [ACADO Monorepo](#acado-monorepo)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Quick Start - Docker Deployment](#-quick-start---docker-deployment)
  - [System Overview](#system-overview)
  - [Repository Layout](#repository-layout)
  - [Core Services](#core-services)
  - [🐳 Docker Deployment (ARM64 Azure VM)](#-docker-deployment-arm64-azure-vm)
    - [Architecture](#architecture)
    - [Prerequisites](#prerequisites)
    - [Deployment Steps](#deployment-steps)
    - [Management Commands](#management-commands)
    - [Access URLs](#access-urls)
  - [Environments \& Pipelines](#environments--pipelines)
  - [Secrets \& Configuration](#secrets--configuration)
  - [Local Development](#local-development)
    - [Backend (`acado-api/`)](#backend-acado-api)
    - [Admin Dashboard (`acado-admin/`)](#admin-dashboard-acado-admin)
    - [Client App (`acado-client/`)](#client-app-acado-client)
    - [Full Docker Stack (Local)](#full-docker-stack-local)
  - [Infrastructure Prerequisites](#infrastructure-prerequisites)
  - [Monitoring \& Troubleshooting](#monitoring--troubleshooting)
  - [Documentation \& Support](#documentation--support)
    - [Deployment Documentation (🆕 Updated)](#deployment-documentation--updated)
    - [Service Documentation](#service-documentation)
    - [Legacy Documentation](#legacy-documentation)
    - [Export with MongoDB URI](#export-with-mongodb-uri)
    - [Import with MongoDB URI](#import-with-mongodb-uri)
- [1. Initial VM setup (run once)](#1-initial-vm-setup-run-once)
- [2. Configure environment](#2-configure-environment)
- [3. Deploy](#3-deploy)
- [4. Initialize database](#4-initialize-database)

---

## 🚀 Quick Start - Docker Deployment

Deploy the entire ACADO platform on an Azure Ubuntu VM (ARM64) with a single command:

```bash
# 1. Initial VM setup (run once)
sudo ./deploy/scripts/setup-vm.sh

# 2. Configure environment
cd deploy
cp env.template .env
nano .env  # Update JWT_SECRET and API URLs with your VM's IP

# 3. Build and deploy all containers
./scripts/deploy.sh up

# 4. Initialize database with test data
./scripts/deploy.sh init-db
```

**Access URLs after deployment:**
| Service | URL | Description |
|---------|-----|-------------|
| Client App | `http://<vm-ip>:80` | Main client application |
| Admin Dashboard | `http://<vm-ip>:8080` | Admin management portal |
| API | `http://<vm-ip>:5000` | Backend REST API |
| API Docs | `http://<vm-ip>:5000/api-docs` | Swagger documentation |

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Azure Ubuntu VM (ARM64)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │acado-client │  │ acado-admin │  │  acado-api  │              │
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

- **acado-client**: Vite + React client-facing application for learners.
- **acado-admin**: Vite + React admin dashboard for admissions teams.
- **acado-api**: Node/Express REST API with TypeScript, Mongoose, JWT auth, RBAC, Azure Blob uploads.
- **MongoDB**: Installed locally on the VM (not containerized).

All services are containerized and orchestrated via Docker Compose on Azure VMs.

---

## Repository Layout

```
project-acado-monorepo/
├── acado-api/                  # Node/Express API (TypeScript)
│   ├── src/                    # Source code
│   ├── scripts/                # Database scripts
│   │   ├── create-test-users.js
│   │   └── generate-sample-data.js
│   ├── Dockerfile              # API container build
│   └── package.json
├── acado-admin/                # React admin dashboard (Vite + TS)
│   ├── src/                    # Source code
│   ├── nginx.conf              # Nginx config for production
│   └── package.json
├── acado-client/               # React client application (Vite + TS)
│   ├── src/                    # Source code
│   ├── nginx/                  # Nginx configs
│   └── package.json
├── deploy/                     # 🐳 Docker deployment files
│   ├── docker-compose.yml      # Main orchestration file
│   ├── Dockerfile.api          # API container
│   ├── Dockerfile.admin        # Admin container
│   ├── Dockerfile.client       # Client container
│   ├── env.template            # Environment variables template
│   ├── nginx/                  # Nginx configurations
│   │   └── client.conf
│   ├── scripts/
│   │   ├── deploy.sh           # Deployment helper script
│   │   └── setup-vm.sh         # Azure VM setup script
│   └── README.md               # Detailed deployment guide
├── .github/workflows/          # GitHub Actions (CI/CD)
└── README.md                   # You are here
```

Each application folder contains its own README for API endpoints, UI guides, and configuration details.

---

## Core Services

| Service | Path | Highlights | Port |
|---------|------|------------|------|
| **acado-api** | `acado-api/` | Express + TypeScript, JWT auth, RBAC, Azure Blob uploads, OpenAPI docs | `5000` |
| **acado-admin** | `acado-admin/` | React 19, Vite, Tailwind, shadcn/ui, Admin dashboards | `8080` |
| **acado-client** | `acado-client/` | React 19, Vite, Tailwind, Client-facing app | `80` |

Refer to each folder's README for service-specific configuration and development scripts.

---

## 🐳 Docker Deployment (ARM64 Azure VM)

### Architecture

The deployment uses Docker Compose to run three containers:
- **acado-client**: Nginx serving React SPA on port 80
- **acado-admin**: Nginx serving React SPA on port 8080
- **acado-api**: Node.js Express API on port 5000

MongoDB runs locally on the host VM (not containerized) for better performance and easier backup management.

### Prerequisites

1. **Azure Ubuntu VM (ARM64)**
   - Ubuntu 22.04 LTS
   - Minimum: 2 vCPU, 4GB RAM
   - Open ports: 22, 80, 8080, 5000

2. **Docker & Docker Compose** - Installed via setup script
3. **MongoDB 7.0** - Installed locally via setup script

### Deployment Steps

```bash
# 1. Clone repository on VM
cd /opt
sudo git clone <your-repo-url> acado
cd acado

# 2. Run VM setup script (installs Docker, MongoDB, etc.)
sudo ./deploy/scripts/setup-vm.sh

# 3. Log out and back in (for Docker group permissions)
exit
ssh user@vm-ip

# 4. Configure environment
cd /opt/acado/deploy
cp env.template .env
nano .env
```

**Important environment variables to update:**
```env
# MUST CHANGE: JWT secret (min 32 characters)
JWT_SECRET=your-secure-random-string-at-least-32-chars

# Update with your Azure VM's public IP or domain
ADMIN_API_URL=http://<your-vm-ip>:5000
CLIENT_API_URL=http://<your-vm-ip>:5000
CLIENT_APP_URL=http://<your-vm-ip>
```

```bash
# 5. Deploy containers
./scripts/deploy.sh up

# 6. Initialize database with test data
./scripts/deploy.sh init-db
```

### Management Commands

```bash
./scripts/deploy.sh up        # Build and start all containers
./scripts/deploy.sh down      # Stop all containers
./scripts/deploy.sh restart   # Restart all containers
./scripts/deploy.sh logs      # View all container logs
./scripts/deploy.sh logs api  # View specific service logs
./scripts/deploy.sh rebuild   # Rebuild containers (no cache)
./scripts/deploy.sh status    # Check container status
./scripts/deploy.sh init-db   # Initialize test data
./scripts/deploy.sh clean     # Clean unused Docker resources
```

### Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Client App | `http://<vm-ip>:80` | Main client application |
| Admin Dashboard | `http://<vm-ip>:8080` | Admin management portal |
| API | `http://<vm-ip>:5000` | Backend REST API |
| API Docs | `http://<vm-ip>:5000/api-docs` | Swagger documentation |
| Health Check | `http://<vm-ip>:5000/health` | API health endpoint |

**Default Test Users (password: `Test123456`):**
- Superadmin: `superadmin@test.com`
- Admin: `admin@test.com`
- Learner: `learner@test.com`

---

## Environments & Pipelines

| Environment | Compose File | Description |
|-------------|--------------|-------------|
| Local Dev | Native npm | Run services directly with hot reload |
| Docker | `deploy/docker-compose.yml` | Full containerized deployment |
| Production | `deploy/docker-compose.yml` | Production on Azure VM |

---

## Secrets & Configuration

Key environment variables (see `deploy/env.template` for full list):

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing key (min 32 chars) | `your-super-secret-key...` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `MONGODB_URI` | MongoDB connection (auto-configured for host) | `mongodb://host.docker.internal:27017/acadodb` |
| `CORS_ORIGIN` | Allowed origins | `*` |
| `ADMIN_API_URL` | API URL for admin dashboard | `http://<vm-ip>:5000` |
| `CLIENT_API_URL` | API URL for client app | `http://<vm-ip>:5000` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob storage (optional) | Connection string |
| `SMTP_HOST` | Email server (optional) | `smtp.gmail.com` |

---

## Local Development

### Backend (`acado-api/`)
```bash
cd acado-api
cp env.example .env   # Configure local values
npm install
npm run dev           # Runs with tsx watch on http://localhost:5000
```

### Admin Dashboard (`acado-admin/`)
```bash
cd acado-admin
cp env.example .env   # Set VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev           # Vite dev server on http://localhost:8080
```

### Client App (`acado-client/`)
```bash
cd acado-client
cp env.example .env   # Configure API URL
npm install --legacy-peer-deps
npm run dev           # Vite dev server on http://localhost:5173
```

### Full Docker Stack (Local)
```bash
cd deploy
cp env.template .env
docker compose up -d --build
```

Access locally:
- Client: http://localhost:80
- Admin: http://localhost:8080
- API: http://localhost:5000

---

## Infrastructure Prerequisites

- **Azure VM Specs:** 2 vCPU / 4GB RAM minimum, Ubuntu 20.04+, 40GB storage.
- **System Packages:** Docker Engine, Docker Compose Plugin, curl, git.
- **Networking:** Public IP or load balancer pointing to frontend (80/443) and backend (if accessed directly). Ensure MongoDB is either internal-only or protected via firewall/security groups.
- **Monitoring Hooks:** Expose `/health` to uptime probes; consider enabling fail2ban/ufw on the VM.

See `backup/ci-cd2.md` for:
- Detailed Docker install commands.
- Runner registration (`./config.sh --labels stage-runner` etc.).
- MongoDB host configuration (`bindIp 0.0.0.0`, service restarts, verification commands).

---

## Monitoring & Troubleshooting

**Compose status**
```bash
cd deploy
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs backend -f
```

**Health checks**
```bash
curl -f http://localhost:5000/health
curl -f http://localhost:8081
```

**Mongo connectivity (from container)**
```bash
docker exec -it backend-services-prod sh
apk add mongodb-tools
mongosh "mongodb://host.docker.internal:27017/acedodb"
```

**Common issues**
- **Health probe failing:** Ensure `MONGO_URI` is reachable, check backend logs for schema/seed failures.
- **CORS errors:** Verify `CORS_ORIGIN` secret includes the requesting domain.
- **Azure uploads failing:** Confirm `AZURE_STORAGE_CONNECTION_STRING` is set and optional container/account envs are configured on the host.

---

## Documentation & Support

### Deployment Documentation (🆕 Updated)
- **[deploy/README.md](./deploy/README.md)** – Complete deployment guide with troubleshooting
- **[deploy/QUICK_START.md](./deploy/QUICK_START.md)** – Quick commands for common tasks
- **[deploy/FIXES_APPLIED.md](./deploy/FIXES_APPLIED.md)** – Critical issues resolved
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** – Deployment overview and architecture

### Service Documentation
- `backend-services/README.md` – API endpoints, seeding scripts, coding standards
- `web-admin/README.md` – UI architecture, component library references
- `sso-app/README.md` – Configuration for the static login helper

### Legacy Documentation
- `backup/ci-cd2.md` – Previous CI/CD guide (reference only)

For bugs or feature requests, open a GitHub issue. For access/security requests, contact the platform team via the usual support channels. **Never commit secrets**—store them in GitHub Environments or the VM host only.

---

Happy shipping! 🚀 yes





### Export with MongoDB URI
```
mongoexport \
  --uri="mongodb://username:password@localhost:27017" \
  --db your_database \
  --collection your_collection \
  --out data.json

```

### Import with MongoDB URI
```
mongoimport \
  --uri="mongodb://username:password@localhost:27017" \
  --db company \
  --collection employees \ 
  //--drop \
  --file employees.json



mongoimport --uri="mongodb://localhost:27017" --db acadodb --collection locations --drop --file locations.json

mongoimport --uri="mongodb://localhost:27017" --db acadodb --collection categories --drop --file categories.json

mongoimport --uri="mongodb://localhost:27017" --db acadodb --collection fields --drop --file fields.json

mongoimport --uri="mongodb://localhost:27017" --db acadodb --collection universities --drop --file universities.json

```



Prod server
vm name = acado-prod
user name = ubuntu
pass = xD2vs5#MqH@X
ip = 20.197.35.236

ssh ubuntu@20.197.35.236



Quick Start on Azure VM
# 1. Initial VM setup (run once)
sudo ./deploy/scripts/setup-vm.sh

# 2. Configure environment
cd deploy
cp env.template .env
nano .env  # Update JWT_SECRET and API URLs

# 3. Deploy
./scripts/deploy.sh up

# 4. Initialize database
./scripts/deploy.sh init-db