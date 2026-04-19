#!/bin/bash
# Initial server setup for SymFlowBuilder
# Run once on the VPS as root

set -e

APP_DIR="/var/www/symflowbuilder"
DB_NAME="symflowbuilder"
DB_USER="symflowbuilder"

read -sp "Enter PostgreSQL password for user '$DB_USER': " DB_PASSWORD
echo
if [ -z "$DB_PASSWORD" ]; then
    echo "Error: password cannot be empty"
    exit 1
fi

echo "==> Creating PostgreSQL database and user..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "==> Creating app directory..."
mkdir -p "$APP_DIR"
chown debian:debian "$APP_DIR"

echo "==> Installing Node.js 20 (if not installed)..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

echo "==> Cloning repository..."
if [ ! -d "$APP_DIR/.git" ]; then
    sudo -u debian git clone https://github.com/vandetho/symflowbuilder.git "$APP_DIR"
fi

echo "==> Creating .env.production..."
if [ ! -f "$APP_DIR/.env.production" ]; then
    cat > "$APP_DIR/.env.production" << 'ENVEOF'
# Generate with: openssl rand -base64 32
AUTH_SECRET=

# GitHub OAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Database
DATABASE_URL=postgresql://symflowbuilder:${DB_PASSWORD}@localhost:5432/symflowbuilder

# App
NEXT_PUBLIC_APP_URL=https://symflowbuilder.com
AUTH_URL=https://symflowbuilder.com
AUTH_TRUST_HOST=true
ENVEOF
    chown debian:debian "$APP_DIR/.env.production"
    chmod 600 "$APP_DIR/.env.production"
    echo ">>> IMPORTANT: Edit $APP_DIR/.env.production with your actual secrets!"
fi

echo "==> Fixing ownership and cleaning stale node_modules..."
rm -rf "$APP_DIR/node_modules"
mkdir -p /home/debian/.npm /home/debian/.pm2
chown -R debian:debian "$APP_DIR" /home/debian/.npm /home/debian/.pm2

echo "==> Installing dependencies and building..."
cd "$APP_DIR"
sudo -u debian npm ci
sudo -u debian npm run prisma:generate
sudo -u debian npm run prisma:migrate
sudo -u debian npm run build

echo "==> Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
echo "==> Creating logs directory..."
sudo -u debian mkdir -p "$APP_DIR/logs"
echo "==> Starting app with PM2..."
sudo -u debian pm2 start "$APP_DIR/ecosystem.config.cjs"
sudo -u debian pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u debian --hp /home/debian

echo "==> Setting up Nginx..."
cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/symflowbuilder.com.conf
ln -sf /etc/nginx/sites-available/symflowbuilder.com.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "==> Setting up SSL with certbot..."
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
fi
echo ">>> Run: certbot --nginx -d symflowbuilder.com -d www.symflowbuilder.com"

echo ""
echo "==> Setup complete!"
echo "    1. Edit /var/www/symflowbuilder/.env.production with your secrets"
echo "    2. Run: certbot --nginx -d symflowbuilder.com -d www.symflowbuilder.com"
echo "    3. Run: sudo -u debian pm2 restart symflowbuilder"
