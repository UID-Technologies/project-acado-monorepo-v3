#!/bin/bash
# =============================================================================
# ACADO Platform - Deployment Script
# Run this script on the Azure VM to deploy the application
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_DIR="$(dirname "$DEPLOY_DIR")"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ACADO Platform Deployment Script    ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}Warning: Running as root. Consider running as a regular user with docker group access.${NC}"
fi

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    echo "Run: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
fi

# Check MongoDB
if ! command -v mongosh &> /dev/null; then
    echo -e "${YELLOW}Warning: MongoDB shell (mongosh) not found. Make sure MongoDB is installed.${NC}"
fi

# Check if MongoDB is running
if systemctl is-active --quiet mongod 2>/dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}Warning: MongoDB service is not running.${NC}"
    echo -e "Start it with: sudo systemctl start mongod"
fi

# Navigate to deploy directory
cd "$DEPLOY_DIR"

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp env.template .env
    echo -e "${YELLOW}Please edit the .env file with your configuration before continuing.${NC}"
    echo "nano .env"
    exit 1
fi

echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  Project directory: $PROJECT_DIR"
echo "  Deploy directory: $DEPLOY_DIR"
echo ""

# Parse command line arguments
ACTION=${1:-"up"}

case $ACTION in
    "up"|"start")
        echo -e "${GREEN}Building and starting containers...${NC}"
        docker compose up -d --build
        
        echo ""
        echo -e "${GREEN}Waiting for services to be healthy...${NC}"
        sleep 10
        
        echo ""
        echo -e "${GREEN}Container Status:${NC}"
        docker compose ps
        
        echo ""
        echo -e "${GREEN}✓ Deployment complete!${NC}"
        echo ""
        echo "Access URLs:"
        echo "  - Client App:      http://localhost:80"
        echo "  - Admin Dashboard: http://localhost:8080"
        echo "  - API:             http://localhost:5000"
        echo "  - API Docs:        http://localhost:5000/api-docs"
        ;;
        
    "down"|"stop")
        echo -e "${YELLOW}Stopping containers...${NC}"
        docker compose down
        echo -e "${GREEN}✓ Containers stopped${NC}"
        ;;
        
    "restart")
        echo -e "${YELLOW}Restarting containers...${NC}"
        docker compose restart
        echo -e "${GREEN}✓ Containers restarted${NC}"
        ;;
        
    "logs")
        SERVICE=${2:-""}
        if [ -n "$SERVICE" ]; then
            docker compose logs -f "$SERVICE"
        else
            docker compose logs -f
        fi
        ;;
        
    "rebuild")
        echo -e "${YELLOW}Rebuilding containers (no cache)...${NC}"
        docker compose build --no-cache
        docker compose up -d
        echo -e "${GREEN}✓ Containers rebuilt${NC}"
        ;;
        
    "status")
        docker compose ps
        ;;
        
    "clean")
        echo -e "${YELLOW}Cleaning up unused Docker resources...${NC}"
        docker system prune -f
        echo -e "${GREEN}✓ Cleanup complete${NC}"
        ;;
        
    "init-db")
        echo -e "${GREEN}Initializing database with test data...${NC}"
        
        # Create test users
        if [ -f "$PROJECT_DIR/acado-api/scripts/create-test-users.js" ]; then
            mongosh acadodb "$PROJECT_DIR/acado-api/scripts/create-test-users.js"
        fi
        
        # Generate sample data
        if [ -f "$PROJECT_DIR/acado-api/scripts/generate-sample-data.js" ]; then
            mongosh acadodb "$PROJECT_DIR/acado-api/scripts/generate-sample-data.js"
        fi
        
        echo -e "${GREEN}✓ Database initialized${NC}"
        ;;
        
    *)
        echo "Usage: $0 {up|down|restart|logs|rebuild|status|clean|init-db}"
        echo ""
        echo "Commands:"
        echo "  up, start   - Build and start all containers"
        echo "  down, stop  - Stop all containers"
        echo "  restart     - Restart all containers"
        echo "  logs [svc]  - View logs (optionally for specific service)"
        echo "  rebuild     - Rebuild all containers without cache"
        echo "  status      - Show container status"
        echo "  clean       - Clean up unused Docker resources"
        echo "  init-db     - Initialize database with test data"
        exit 1
        ;;
esac

