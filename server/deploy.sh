#!/bin/bash
# Deploy Game Server to EC2
# Usage: ./deploy-game-server.sh

set -e

# ==================== CONFIGURATION ====================
SERVER_HOST="game-api.chaotok.site"
SERVER_USER="ubuntu"
SSH_KEY="~/chaotok-key.pem"
DEPLOY_PATH="/var/www/chaotok-game"
PM2_APP_NAME="chaotok-game-server"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==================== FUNCTIONS ====================
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==================== PRE-FLIGHT CHECKS ====================
log_info "Starting Game Server deployment..."
echo ""

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    log_error "SSH key not found: $SSH_KEY"
    exit 1
fi

# Check if we can connect to server
log_info "Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=5 "$SERVER_USER@$SERVER_HOST" "echo 'Connected'" > /dev/null 2>&1; then
    log_error "Cannot connect to server: $SERVER_HOST"
    exit 1
fi
log_success "SSH connection successful"

# ==================== BUILD LOCALLY ====================
log_info "Installing dependencies..."
npm install --production

# ==================== BACKUP CURRENT VERSION ====================
log_info "Creating backup on server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" << EOF
    if [ -d "$DEPLOY_PATH" ]; then
        timestamp=\$(date +%Y%m%d_%H%M%S)
        cp -r $DEPLOY_PATH ${DEPLOY_PATH}_backup_\$timestamp
        echo "Backup created: ${DEPLOY_PATH}_backup_\$timestamp"
    fi
EOF

# ==================== UPLOAD FILES ====================
log_info "Uploading files to server..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.env.example' \
    --exclude '*.log' \
    --exclude 'logs' \
    -e "ssh -i $SSH_KEY" \
    ./ "$SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/"

log_success "Files uploaded successfully"

# ==================== INSTALL & RESTART ====================
log_info "Installing dependencies and restarting server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" << 'EOF'
    cd /var/www/chaotok-game
    
    # Install dependencies
    echo "Installing npm packages..."
    npm install --production
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  WARNING: .env file not found! Please create one."
        echo "You can copy from .env.example and update values"
    fi
    
    # Restart PM2
    if pm2 describe chaotok-game-server > /dev/null 2>&1; then
        echo "Restarting existing PM2 process..."
        pm2 restart chaotok-game-server
    else
        echo "Starting new PM2 process..."
        pm2 start npm --name "chaotok-game-server" -- start
        pm2 save
    fi
    
    # Show logs
    echo ""
    echo "Recent logs:"
    pm2 logs chaotok-game-server --lines 20 --nostream
    
    # Show status
    echo ""
    pm2 status
EOF

# ==================== HEALTH CHECK ====================
log_info "Running health check..."
sleep 3

if curl -f -s "https://$SERVER_HOST/health" > /dev/null; then
    log_success "Server is healthy!"
else
    log_warning "Health check failed. Please check logs manually."
fi

# ==================== SUMMARY ====================
echo ""
echo "======================================"
log_success "Deployment Complete!"
echo "======================================"
echo ""
echo "Server: https://$SERVER_HOST"
echo "Health: https://$SERVER_HOST/health"
echo ""
echo "To view logs:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST"
echo "  pm2 logs $PM2_APP_NAME"
echo ""
