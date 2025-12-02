#!/bin/bash
# =============================================================================
# ACADO Platform - Azure VM Initial Setup Script
# Run this script on a fresh Ubuntu ARM64 VM to install prerequisites
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ACADO Platform - VM Setup Script    ${NC}"
echo -e "${GREEN}   For Azure Ubuntu ARM64              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run this script with sudo${NC}"
    echo "Usage: sudo ./setup-vm.sh"
    exit 1
fi

# Get the actual user (not root)
ACTUAL_USER=${SUDO_USER:-$USER}
echo -e "${BLUE}Setting up for user: $ACTUAL_USER${NC}"
echo ""

# =============================================================================
# System Updates
# =============================================================================
echo -e "${GREEN}[1/5] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# =============================================================================
# Install Docker
# =============================================================================
echo ""
echo -e "${GREEN}[2/5] Installing Docker...${NC}"

if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is already installed${NC}"
else
    # Install Docker using official script
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Add user to docker group
    usermod -aG docker $ACTUAL_USER
    echo -e "${GREEN}✓ Docker installed${NC}"
fi

# Install Docker Compose plugin
echo "Installing Docker Compose plugin..."
apt-get install -y docker-compose-plugin
echo -e "${GREEN}✓ Docker Compose installed${NC}"

# Enable Docker service
systemctl enable docker
systemctl start docker

# =============================================================================
# Install MongoDB
# =============================================================================
echo ""
echo -e "${GREEN}[3/5] Installing MongoDB...${NC}"

if command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}MongoDB is already installed${NC}"
else
    # Install gnupg and curl
    apt-get install -y gnupg curl
    
    # Import MongoDB public GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    
    # Get Ubuntu codename
    UBUNTU_CODENAME=$(lsb_release -cs)
    
    # Add MongoDB repository (ARM64)
    echo "deb [ arch=arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" | \
        tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Update and install MongoDB
    apt-get update
    apt-get install -y mongodb-org
    
    echo -e "${GREEN}✓ MongoDB installed${NC}"
fi

# Configure MongoDB to accept connections from Docker containers
echo "Configuring MongoDB..."
if ! grep -q "bindIpAll: true" /etc/mongod.conf; then
    # Backup original config
    cp /etc/mongod.conf /etc/mongod.conf.backup
    
    # Update bind IP to allow Docker connections
    sed -i 's/bindIp: 127.0.0.1/bindIp: 127.0.0.1,172.17.0.1/' /etc/mongod.conf
fi

# Enable and start MongoDB
systemctl daemon-reload
systemctl enable mongod
systemctl start mongod

# Wait for MongoDB to start
sleep 3

# Check MongoDB status
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}Warning: MongoDB failed to start. Check logs with: journalctl -u mongod${NC}"
fi

# =============================================================================
# Install Additional Tools
# =============================================================================
echo ""
echo -e "${GREEN}[4/5] Installing additional tools...${NC}"

apt-get install -y \
    git \
    htop \
    curl \
    wget \
    nano \
    net-tools

echo -e "${GREEN}✓ Additional tools installed${NC}"

# =============================================================================
# Configure Firewall
# =============================================================================
echo ""
echo -e "${GREEN}[5/5] Configuring firewall...${NC}"

# Install ufw if not present
apt-get install -y ufw

# Configure firewall rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp    # Client app
ufw allow 8080/tcp  # Admin dashboard
ufw allow 5000/tcp  # API (optional, can remove for internal only)

# Enable firewall (non-interactive)
echo "y" | ufw enable

echo -e "${GREEN}✓ Firewall configured${NC}"

# =============================================================================
# Final Instructions
# =============================================================================
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Setup Complete!                      ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Installed versions:${NC}"
docker --version
docker compose version
mongosh --version 2>/dev/null || mongod --version
echo ""

echo -e "${YELLOW}IMPORTANT: Log out and log back in for Docker group changes to take effect.${NC}"
echo ""

echo -e "${BLUE}Next steps:${NC}"
echo "1. Log out and log back in (or run: newgrp docker)"
echo "2. Clone your repository:"
echo "   cd /opt && sudo git clone <your-repo-url> acado"
echo ""
echo "3. Configure environment:"
echo "   cd /opt/acado/deploy"
echo "   cp env.template .env"
echo "   nano .env"
echo ""
echo "4. Deploy:"
echo "   ./scripts/deploy.sh up"
echo ""
echo "5. Initialize database:"
echo "   ./scripts/deploy.sh init-db"
echo ""

echo -e "${GREEN}Done!${NC}"

