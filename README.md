# Akedo Monorepo

Akedo is an end‑to‑end admissions/workflow platform composed of a React admin UI, a TypeScript/Node backend, and supporting SSO/utility apps. This repository maintains **all** source, deployment manifests, CI/CD pipelines, and runbooks so it can serve as the single source of truth for engineers and operators.

---

## 📖 Table of Contents

- [Akedo Monorepo](#akedo-monorepo)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚨 Important: Deployment Files Moved](#-important-deployment-files-moved)
    - [Quick Links:](#quick-links)
    - [What Changed:](#what-changed)
    - [New Commands:](#new-commands)
  - [System Overview](#system-overview)
  - [Repository Layout](#repository-layout)
  - [Core Services](#core-services)
  - [Environments \& Pipelines](#environments--pipelines)
  - [Secrets \& Configuration](#secrets--configuration)
  - [Deployment Playbook](#deployment-playbook)
    - [Staging](#staging)
    - [Production](#production)
    - [Manual Redeploy / Rollback](#manual-redeploy--rollback)
    - [Runner / VM Requirements (high level)](#runner--vm-requirements-high-level)
  - [Local Development](#local-development)
    - [Backend (`backend-services/`)](#backend-backend-services)
    - [Frontend (`web-admin/`)](#frontend-web-admin)
    - [SSO Helper (`sso-app/`)](#sso-helper-sso-app)
    - [Dockerized Local Stack](#dockerized-local-stack)
  - [Infrastructure Prerequisites](#infrastructure-prerequisites)
  - [Monitoring \& Troubleshooting](#monitoring--troubleshooting)
  - [Documentation \& Support](#documentation--support)
    - [Deployment Documentation (🆕 Updated)](#deployment-documentation--updated)
    - [Service Documentation](#service-documentation)
    - [Legacy Documentation](#legacy-documentation)
    - [Export with MongoDB URI](#export-with-mongodb-uri)
    - [Import with MongoDB URI](#import-with-mongodb-uri)

---

## 🚨 Important: Deployment Files Moved

**All deployment configurations have been reorganized into the `deploy/` folder** to keep the root directory clean and fix critical deployment issues.

### Quick Links:
- **📚 Complete Deployment Guide**: [deploy/README.md](./deploy/README.md)
- **⚡ Quick Start**: [deploy/QUICK_START.md](./deploy/QUICK_START.md)
- **🔧 Issues Fixed**: [deploy/FIXES_APPLIED.md](./deploy/FIXES_APPLIED.md)
- **📋 Deployment Overview**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### What Changed:
- ✅ All docker-compose files moved to `deploy/` folder
- ✅ Fixed critical port mismatches (4000 vs 5000)
- ✅ Fixed network configuration issues
- ✅ Added complete local development environment
- ✅ Improved GitHub Actions workflows
- ✅ Added comprehensive documentation

### New Commands:
```bash
# Local development (includes MongoDB)
cd deploy && docker compose -f docker-compose.local.yml up -d

# Manual staging deployment
cd deploy && docker compose -f docker-compose.staging.yml up -d

# Manual production deployment
cd deploy && docker compose -f docker-compose.prod.yml up -d
```

---

## System Overview

```
          ┌────────────┐        ┌───────────────┐        ┌──────────────┐
User ---> │  Web Admin │ <----> │   Backend     │ <----> │   MongoDB     │
          │ (React 18) │        │ (Express API) │        │  Replica/VM   │
          └─────▲──────┘        └──────▲────────┘        └──────▲────────┘
                │                      │                         │
                │                      │                         │
          ┌─────▼──────┐         ┌─────▼──────┐           ┌──────▼──────┐
          │   SSO App  │         │ Azure Blob │           │  External   │
          │  (static)  │         │   Storage   │           │ Integrations│
          └────────────┘         └─────────────┘           └─────────────┘
```

- **Web Admin**: Vite + React UI for admissions teams.
- **Backend Services**: Node/Express REST API with Mongoose, JWT auth, RBAC, Azure Blob uploads.
- **MongoDB**: Hosted on the same VM (DevOps) or external cluster.
- **SSO App**: Optional static helper to pre-auth users.

All services are containerized and orchestrated via Docker Compose on self-hosted Azure VMs. GitHub Actions handles deployments through self-hosted runners.

---

## Repository Layout

```
acedo-monorepo/
├── backend-services/           # Node/Express API (TypeScript)
├── web-admin/                  # React admin application (Vite + TS)
├── sso-app/                    # Optional static SSO helper
├── acadmy-configurator-main/   # Legacy configurator prototype (archive)
├── deploy/                     # 🆕 All deployment files (docker-compose, env examples, docs)
│   ├── docker-compose.local.yml
│   ├── docker-compose.staging.yml
│   ├── docker-compose.prod.yml
│   ├── env/
│   │   ├── backend.staging.env.example
│   │   └── backend.prod.env.example
│   ├── mongo-init.js
│   ├── README.md              # Detailed deployment guide
│   ├── QUICK_START.md         # Quick start commands
│   └── FIXES_APPLIED.md       # Issues resolved
├── .github/workflows/          # GitHub Actions workflows (deploy-staging/prod)
├── DEPLOYMENT.md               # Deployment overview
├── backup/                     # Legacy deployment docs
└── README.md                   # You are here
```

Each application folder contains its own README for deep dives (API endpoints, UI guides, etc.), while this root README summarizes the cross-cutting concerns.

---

## Core Services

| Service | Path | Highlights | Default Ports |
|---------|------|------------|---------------|
| Backend API | `backend-services/` | Express + TypeScript, JWT auth, RBAC, Azure Blob uploads, OpenAPI docs | `5000` (Docker) |
| Web Admin | `web-admin/` | React 18, Vite, Tailwind, API client libs, admissions dashboards | `8081→80` |
| SSO Helper | `sso-app/` | Static HTML/JS, optional login entry point | `3000` (when hosted separately) |

Refer to `backend-services/README.md` and `web-admin/README.md` for service-specific configuration and scripts.

---

## Environments & Pipelines

| Environment | Git Branch Trigger | GitHub Environment | Runner Labels | Compose File | Frontend API URL |
|-------------|--------------------|--------------------|---------------|--------------|------------------|
| Staging     | `staging`          | `staging`          | `self-hosted`, `acado-staging-runner` | `deploy/docker-compose.staging.yml` | `secrets.VITE_API_BASE_URL` |
| Production  | `master` / `main`  | `production`       | `self-hosted`, `acado-prod-runner`  | `deploy/docker-compose.prod.yml`    | `secrets.VITE_API_BASE_URL` |

Deployment workflow (`deploy-*.yml`) steps:
1. Checkout repository on the VM runner.
2. Create environment file in `deploy/env/` directory, populated from GitHub secrets.
3. Build Docker images with proper build arguments (especially `VITE_API_BASE_URL`).
4. Stop existing containers gracefully.
5. Deploy new containers with health checks enabled.
6. Verify backend and frontend health endpoints.
7. Rollback automatically on failure (production only).
8. Clean up old images on success.

Every VM hosts both backend and frontend containers plus MongoDB (if using local Mongo). External databases can be supported by updating `MONGO_URI`.

**📖 For detailed deployment instructions, see [deploy/README.md](./deploy/README.md)**

---

## Secrets & Configuration

Each GitHub Environment (`staging`, `production`) **must** define the following secrets:

| Secret | Description | Example |
|--------|-------------|---------|
| `JWT_ACCESS_SECRET` | Access token signing key (generate with `openssl rand -hex 64`) | `abc123...` |
| `JWT_REFRESH_SECRET` | Refresh token signing key (generate with `openssl rand -hex 64`) | `def456...` |
| `CORS_ORIGIN` | Comma-delimited list of allowed origins | `http://vm-ip:8081,https://admin.example.com` |
| `MONGO_URI` | MongoDB connection string (usually `mongodb://localhost:27017/acedodb` on VM) | `mongodb://localhost:27017/acedodb` |
| `VITE_API_BASE_URL` | Backend API URL for frontend (set at build time) | `http://vm-ip:5000` or `https://api.example.com` |
| `EMAIL_HOST` | SMTP server host (optional) | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port (optional) | `587` |
| `EMAIL_SECURE` | Use TLS (optional) | `true` or `false` |
| `EMAIL_USER` | Email username (optional) | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email password (optional) | Your password |
| `EMAIL_FROM` | From address (optional) | `no-reply@example.com` |

Optional host-level variables (set on the VM, not in GitHub):
- `AZURE_CONTAINER_NAME`, `AZURE_STORAGE_ACCOUNT_URL` – only required if you need to override the defaults inside `backend-services`.

**Secret Rotation:** Updating a secret in GitHub does **not** mutate running containers. After editing a secret, re-run the relevant deployment workflow (or push a new commit) so Compose rebuilds with the new value.

---

## Deployment Playbook

### Staging
```bash
git checkout staging
# make changes...
git push origin staging
```
GitHub Actions automatically runs `Deploy to Staging VM`. Monitor progress in the Actions tab; the workflow will exit non-zero if `/health` never succeeds.

### Production
```bash
git checkout master
# merge/pull latest main
git push origin master
```
`Deploy to Production VM` runs automatically. Consider enabling branch protections or required reviews before pushing to `master/main`.

### Manual Redeploy / Rollback
- From a workflow run page click **Re-run all jobs** to redeploy the same commit.
- To roll back, re-run the workflow from an earlier commit or cherry-pick the desired SHA onto the environment branch.
- Emergency fallback: SSH into the VM, run `docker compose -f docker-compose.<env>.yml ps/logs`, adjust as needed, then trigger a clean redeploy from GitHub as soon as possible.

### Runner / VM Requirements (high level)
1. Ubuntu 20.04+ VM with Docker Engine and Docker Compose plugin installed (`sudo apt install docker-compose-plugin`).
2. Local MongoDB running on the host (if not using a managed cluster) and listening on `0.0.0.0:27017`.
3. GitHub Actions self-hosted runner configured with labels:
   - Staging: `acado-staging-runner`
   - Production: `acado-prod-runner`
   - Install as service: `./svc.sh install && ./svc.sh start`
4. Firewall openings for frontend (`8081`), backend (`5000`), and any external ingress you require.

**📖 For complete step-by-step setup, see [deploy/README.md](./deploy/README.md)**

---

## Local Development

### Backend (`backend-services/`)
```bash
cd backend-services
cp env.example .env   # fill in local values
npm install
npm run dev           # nodemon + ts-node
```
- Runs on `http://localhost:5000`.
- Connects to local Mongo (configure `MONGO_URI` in `.env`).
- Exposes `/health`, `/api/v1/*`, and static swagger via `/docs` (if enabled).

### Frontend (`web-admin/`)
```bash
cd web-admin
cp env.example .env   # set VITE_API_BASE_URL to backend dev URL
npm install
npm run dev           # Vite hot reload
```
- Accessible at `http://localhost:5173` by default.
- Uses Vite proxy or direct API calls depending on env variables.

### SSO Helper (`sso-app/`)
```bash
cd sso-app
npm install
npm run dev # or serve sso.html statically via nginx/http-server
```
Update `sso-config.js` with the correct frontend URL before building.

### Dockerized Local Stack
Complete local environment with MongoDB included:

```bash
cd deploy
docker compose -f docker-compose.local.yml up -d
```

This starts:
- MongoDB on port 27017 (credentials: admin/adminpass)
- Backend API on port 5000
- Frontend on port 8081

Access:
- Frontend: http://localhost:8081
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

Stop with:
```bash
docker compose -f docker-compose.local.yml down
```

**📖 See [deploy/QUICK_START.md](./deploy/QUICK_START.md) for more options**

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