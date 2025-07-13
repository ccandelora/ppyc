# PPYC Production Installation Guide for Ubuntu 24.04 LTS

This comprehensive guide will help you install and deploy the PPYC (Pleasant Park Yacht Club) application on Ubuntu 24.04 LTS as the root user.

## Table of Contents

1. [System Overview](#system-overview)
2. [Prerequisites and System Update](#prerequisites-and-system-update)
3. [PostgreSQL Installation](#postgresql-installation)
4. [Ruby Installation](#ruby-installation)
5. [Node.js Installation](#nodejs-installation)
6. [Nginx Installation](#nginx-installation)
7. [Redis Installation](#redis-installation)
8. [Application Deployment](#application-deployment)
9. [Environment Variables](#environment-variables)
10. [Database Setup](#database-setup)
11. [Frontend Build](#frontend-build)
12. [Service Configuration](#service-configuration)
13. [SSL/TLS Setup](#ssltls-setup)
14. [Monitoring and Logs](#monitoring-and-logs)
15. [Backup Configuration](#backup-configuration)

## System Overview

**PPYC Application Stack:**
- **Backend**: Ruby 3.3.5 + Rails 8.0.1 + Puma
- **Frontend**: Node.js 20+ + React 19 + Vite
- **Database**: PostgreSQL 15+
- **Cache**: solid_cache (database-backed)
- **Background Jobs**: solid_queue (database-backed)
- **WebSocket**: Redis 7 (Action Cable only)
- **Web Server**: Nginx (reverse proxy)
- **Image Storage**: Cloudinary
- **Process Manager**: Systemd

**Directory Structure:**
- **Application**: `/var/www/ppyc/` (standard web app location)
- **Admin Config**: `/root/ppyc_env.sh` (system-wide environment variables)
- **Logs**: `/var/log/nginx/ppyc/` + `/var/www/ppyc/ppyc_backend/log/`
- **Backups**: `/var/backups/ppyc/`
- **SSL Certificates**: `/etc/nginx/ssl/` (if using manual SSL)

**Security Notes:**
- All operations performed as `root` user for maximum control
- Application files owned by `root:www-data` for web server access
- Environment variables secured in `/root/` directory
- Services run as `root` for production deployment flexibility

## Prerequisites and System Update

```bash
# Update the system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget gnupg2 software-properties-common apt-transport-https \
  ca-certificates lsb-release build-essential git vim htop tree unzip

# Install additional build dependencies
apt install -y autoconf bison libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev libdb-dev \
  libxml2-dev libxslt1-dev libcurl4-openssl-dev libicu-dev \
  imagemagick libmagickwand-dev libpq-dev

# Set timezone (adjust as needed)
timedatectl set-timezone America/New_York
```

## PostgreSQL Installation

```bash
# Install PostgreSQL 15 with development headers
# libpq-dev is required for the pg gem to compile
apt install -y postgresql postgresql-contrib postgresql-client-15 libpq-dev

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Check PostgreSQL status
systemctl status postgresql

# Create database user and databases
sudo -u postgres psql << EOF
-- Create user
CREATE USER ppyc_user WITH PASSWORD 'Bytes1010';
ALTER USER ppyc_user CREATEDB;

-- Create databases
CREATE DATABASE ppyc_production OWNER ppyc_user;
CREATE DATABASE ppyc_backend_production_cache OWNER ppyc_user;
CREATE DATABASE ppyc_backend_production_queue OWNER ppyc_user;
CREATE DATABASE ppyc_backend_production_cable OWNER ppyc_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ppyc_production TO ppyc_user;
GRANT ALL PRIVILEGES ON DATABASE ppyc_backend_production_cache TO ppyc_user;
GRANT ALL PRIVILEGES ON DATABASE ppyc_backend_production_queue TO ppyc_user;
GRANT ALL PRIVILEGES ON DATABASE ppyc_backend_production_cable TO ppyc_user;

-- Set default privileges
\c ppyc_production
GRANT ALL PRIVILEGES ON SCHEMA public TO ppyc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ppyc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ppyc_user;

\q
EOF

# Configure PostgreSQL for production
cp /etc/postgresql/15/main/postgresql.conf /etc/postgresql/15/main/postgresql.conf.backup

# Edit PostgreSQL configuration
cat >> /etc/postgresql/15/main/postgresql.conf << EOF

# PPYC Production Settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.7
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
EOF

# Restart PostgreSQL
systemctl restart postgresql
```

## Ruby Installation

```bash
# Install rbenv and ruby-build
cd /root
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build

# Add rbenv to PATH
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Install Ruby 3.3.5
rbenv install 3.3.5
rbenv global 3.3.5
rbenv rehash

# Verify Ruby installation
ruby -v
which ruby

# Install bundler
gem install bundler:2.5.0
rbenv rehash
```

## Node.js Installation

```bash
# Install Node.js 20 via NodeSource repository (required for React Router 7+ and Vite 7+)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version

# Install global packages (optional)
npm install -g pm2 yarn

# Verify installations
pm2 --version
yarn --version
```

## Nginx Installation

```bash
# Install Nginx
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx

# Check status
systemctl status nginx

# Remove default site
rm /etc/nginx/sites-enabled/default

# Create log directory
mkdir -p /var/log/nginx/ppyc
```

## Redis Installation

```bash
# Install Redis (ONLY needed for Action Cable WebSocket connections)
# NOTE: PPYC uses solid_cache and solid_queue (database-backed) for caching and background jobs
apt install -y redis-server

# Configure Redis for production (lightweight config for WebSocket connections only)
cp /etc/redis/redis.conf /etc/redis/redis.conf.backup

# Edit Redis configuration for Action Cable use
sed -i 's/^# maxmemory <bytes>/maxmemory 128mb/' /etc/redis/redis.conf
sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
sed -i 's/^save 900 1/# save 900 1/' /etc/redis/redis.conf
sed -i 's/^save 300 10/# save 300 10/' /etc/redis/redis.conf
sed -i 's/^save 60 10000/# save 60 10000/' /etc/redis/redis.conf

# Enable and restart Redis
systemctl enable redis-server
systemctl restart redis-server
systemctl status redis-server
```

## Application Deployment

```bash
# Create application directory (standard web application location)
mkdir -p /var/www
cd /var/www

# Clone the repository
git clone https://github.com/ccandelora/ppyc.git ppyc
cd ppyc

# Set proper ownership and permissions
# root:www-data allows web server access while maintaining root control
chown -R root:www-data /var/www/ppyc
chmod -R 755 /var/www/ppyc

# Create necessary directories with proper permissions
mkdir -p /var/www/ppyc/ppyc_backend/tmp/{pids,cache,sockets}
mkdir -p /var/www/ppyc/ppyc_backend/log
mkdir -p /var/www/ppyc/ppyc_backend/storage
chmod -R 755 /var/www/ppyc/ppyc_backend/tmp
chmod -R 755 /var/www/ppyc/ppyc_backend/log
chmod -R 755 /var/www/ppyc/ppyc_backend/storage

# Install backend dependencies
cd /var/www/ppyc/ppyc_backend
bundle config set --local deployment 'true'
bundle config set --local without 'development test'
bundle install --jobs 4 --retry 3

# Install frontend dependencies
cd /var/www/ppyc/ppyc_frontend
npm ci --only=production --silent
```

## Environment Variables

Create environment configuration file:

```bash
# Create environment file
cat > /root/ppyc_env.sh << 'EOF'
#!/bin/bash

# PPYC Production Environment Variables

# Database Configuration
export PPYC_BACKEND_DATABASE_PASSWORD="Bytes1010"
export PPYC_BACKEND_DATABASE_USERNAME="ppyc_user"
export PPYC_BACKEND_DATABASE_HOST="localhost"
export PPYC_BACKEND_DATABASE_PORT="5432"

# Rails Configuration
export RAILS_ENV="production"
export SECRET_KEY_BASE="$(openssl rand -hex 64)"
export RAILS_LOG_LEVEL="info"
export RAILS_MAX_THREADS="5"
export RAILS_MIN_THREADS="5"
export RAILS_SERVE_STATIC_FILES="false"
export RAILS_LOG_TO_STDOUT="false"

# Application Settings
export PORT="3000"
export DOMAIN="ppyc1910.org"
export CORS_ORIGINS="https://ppyc1910.org,https://www.ppyc1910.org"

# Cloudinary Configuration (REQUIRED - Add your credentials)
export CLOUDINARY_CLOUD_NAME="dqb8hp68j"
export CLOUDINARY_API_KEY="481132845846848"
export CLOUDINARY_API_SECRET="RsFvwJxHPXxC1AmgX3JnDp4yIfw"

# Weather API Configuration
export WEATHER_API_KEY="d3ed71458891490098a10757250307"

# Frontend Build Variables
export VITE_API_BASE_URL="https://ppyc1910.org/api/v1"
export VITE_CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME"
export VITE_CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY"
export VITE_CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET"

# Weather API Configuration
export VITE_WEATHER_API_KEY="d3ed71458891490098a10757250307"
export VITE_TINYMCE_API_KEY="sxunz7ojrryz3zc9w0ui8sod8pu3eci06hyleryngheewzml"


# Redis Configuration
export REDIS_URL="redis://localhost:6379/1"

# Database URLs for Rails multi-database
export DATABASE_URL="postgresql://$PPYC_BACKEND_DATABASE_USERNAME:$PPYC_BACKEND_DATABASE_PASSWORD@$PPYC_BACKEND_DATABASE_HOST:$PPYC_BACKEND_DATABASE_PORT/ppyc_production"

echo "PPYC environment variables loaded successfully"
EOF

# Make executable and source
chmod +x /root/ppyc_env.sh
source /root/ppyc_env.sh

# Add to .bashrc for persistence
echo 'source /root/ppyc_env.sh' >> ~/.bashrc
```

**⚠️ IMPORTANT**: Edit `/root/ppyc_env.sh` and replace the Cloudinary placeholders with your actual credentials:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Database Setup

```bash
# Source environment variables
source /root/ppyc_env.sh

# Navigate to backend directory
cd /var/www/ppyc/ppyc_backend

# Run database health check
bundle exec rails db:health_check

# Run database migrations
bundle exec rails db:migrate

# Seed the database (optional)
bundle exec rails db:seed

# Verify database setup
bundle exec rails db:migrate:status
```

## Frontend Build

```bash
# Navigate to frontend directory
cd /var/www/ppyc/ppyc_frontend

# Build the frontend
npm run build

# Verify build
ls -la dist/

# Create dist directory symlink for nginx
ln -sf /var/www/ppyc/ppyc_frontend/dist /var/www/ppyc/frontend_build
```

## Service Configuration

### Create Puma Service

```bash
# Create a wrapper script that loads environment variables
# This is necessary because systemd cannot read shell script format environment files
cat > /usr/local/bin/puma-with-env.sh << 'EOF'
#!/bin/bash
source /root/ppyc_env.sh
cd /var/www/ppyc/ppyc_backend
exec bundle exec puma -C config/puma.rb
EOF

# Make the wrapper script executable
chmod +x /usr/local/bin/puma-with-env.sh

# Create Puma systemd service
cat > /etc/systemd/system/puma.service << 'EOF'
[Unit]
Description=Puma HTTP Server for PPYC Backend
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/ppyc/ppyc_backend
ExecStart=/usr/local/bin/puma-with-env.sh
ExecReload=/bin/kill -USR1 $MAINPID
StandardOutput=journal
StandardError=journal
SyslogIdentifier=puma
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=30
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```



### Configure Nginx

```bash
# Create Nginx configuration for PPYC
cat > /etc/nginx/sites-available/ppyc << 'EOF'
# Upstream for Rails backend
upstream ppyc_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

# Alternative: Use Unix socket for better performance (optional)
# upstream ppyc_backend {
#     server unix:/var/www/ppyc/ppyc_backend/tmp/sockets/puma.sock;
#     keepalive 32;
# }

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=assets:10m rate=30r/s;

server {
    listen 80;
    server_name ppyc1910.org www.ppyc1910.org srv894370.hstgr.cloud;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Root directory for React app
    root /var/www/ppyc/ppyc_frontend/dist;
    index index.html;
    
    # Logging
    access_log /var/log/nginx/ppyc/access.log;
    error_log /var/log/nginx/ppyc/error.log;
    
    # Client settings
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # API requests to Rails backend
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://ppyc_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp)$ {
        limit_req zone=assets burst=50 nodelay;
        
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # CORS for fonts
        location ~* \.(woff|woff2|ttf|eot)$ {
            add_header Access-Control-Allow-Origin "*";
        }
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # React Router SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/ppyc /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Create log directory
mkdir -p /var/log/nginx/ppyc
```

### Start Services

```bash
# Reload systemd
systemctl daemon-reload

# Enable and start services
systemctl enable puma nginx
systemctl start puma nginx

# Check service status
systemctl status puma
systemctl status nginx
systemctl status postgresql
systemctl status redis-server
```

## SSL/TLS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d ppyc1910.org -d www.ppyc1910.org

# Test automatic renewal
certbot renew --dry-run

# Setup automatic renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Setup

```bash
# Create SSL directory
mkdir -p /etc/nginx/ssl

# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/ppyc.key \
  -out /etc/nginx/ssl/ppyc.crt \
  -subj "/C=US/ST=MA/L=Winthrop/O=PPYC/CN=ppyc1910.org"

# Update Nginx configuration for SSL
# (Add SSL server block to /etc/nginx/sites-available/ppyc)
```

## Monitoring and Logs

### Log Management

```bash
# Create log rotation for Rails
cat > /etc/logrotate.d/ppyc << 'EOF'
/var/www/ppyc/ppyc_backend/log/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        systemctl reload puma
    endscript
}
EOF

# Create monitoring script
cat > /root/check_ppyc.sh << 'EOF'
#!/bin/bash

echo "=== PPYC Health Check ===" 
echo "Date: $(date)"
echo

# Check services
echo "Service Status:"
systemctl is-active puma && echo "✅ Puma: Running" || echo "❌ Puma: Failed"
systemctl is-active sidekiq && echo "✅ Sidekiq: Running" || echo "❌ Sidekiq: Failed"
systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Failed"
systemctl is-active postgresql && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Failed"
systemctl is-active redis-server && echo "✅ Redis: Running" || echo "❌ Redis: Failed"
echo

# Check disk space
echo "Disk Usage:"
df -h /var/www/ppyc
echo

# Check memory
echo "Memory Usage:"
free -h
echo

# Check database
echo "Database Check:"
cd /var/www/ppyc/ppyc_backend
source /root/ppyc_env.sh
bundle exec rails db:health_check 2>/dev/null && echo "✅ Database: OK" || echo "❌ Database: Error"
EOF

chmod +x /root/check_ppyc.sh

# Add to crontab for daily checks
echo "0 8 * * * /root/check_ppyc.sh | mail -s 'PPYC Daily Health Check' admin@yourdomain.com" | crontab -
```

## Backup Configuration

```bash
# Create backup script
mkdir -p /var/backups/ppyc

cat > /root/backup_ppyc.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/ppyc"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting PPYC backup at $(date)"

# Database backup
sudo -u postgres pg_dump ppyc_production > "$BACKUP_DIR/ppyc_db_$DATE.sql"
sudo -u postgres pg_dump ppyc_backend_production_cache > "$BACKUP_DIR/ppyc_cache_db_$DATE.sql"
sudo -u postgres pg_dump ppyc_backend_production_queue > "$BACKUP_DIR/ppyc_queue_db_$DATE.sql"
sudo -u postgres pg_dump ppyc_backend_production_cable > "$BACKUP_DIR/ppyc_cable_db_$DATE.sql"

# Compress database backups
gzip "$BACKUP_DIR"/*_$DATE.sql

# Application files backup
tar -czf "$BACKUP_DIR/ppyc_app_$DATE.tar.gz" -C /var/www ppyc

# Remove backups older than 7 days
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete

echo "Backup completed at $(date)"
EOF

chmod +x /root/backup_ppyc.sh

# Schedule daily backups
echo "0 2 * * * /root/backup_ppyc.sh >> /var/log/ppyc_backup.log 2>&1" | crontab -
```

## Final Steps and Verification

```bash
# Source environment variables
source /root/ppyc_env.sh

# Verify directory structure and permissions
echo "=== Directory Structure Verification ==="
ls -la /var/www/ppyc/
ls -la /var/www/ppyc/ppyc_backend/tmp/
ls -la /var/www/ppyc/ppyc_frontend/dist/

# Final health check
echo "=== Database Health Check ==="
cd /var/www/ppyc/ppyc_backend
bundle exec rails db:health_check

# Check all services
echo "=== Service Status Check ==="
systemctl status puma sidekiq nginx postgresql redis-server

# Test the application endpoints
echo "=== Application Testing ==="
curl -I http://localhost/health
curl -I http://localhost/api/v1/health
curl -I http://localhost/ # Frontend

# Verify file ownership
echo "=== Permission Verification ==="
ls -la /var/www/ppyc/ppyc_backend/tmp/
ps aux | grep puma | head -1

# Check logs for any errors
echo "=== Log Check ==="
tail -5 /var/www/ppyc/ppyc_backend/log/production.log
tail -5 /var/log/nginx/ppyc/error.log

echo "=== PPYC Installation Complete ==="
echo "Application Directory: /var/www/ppyc/"
echo "Configuration: /root/ppyc_env.sh"
echo "Frontend URL: http://your-domain.com"
echo "API Base URL: http://your-domain.com/api/v1"
echo "Admin Panel: http://your-domain.com/admin"
echo
echo "Directory Structure:"
echo "  /var/www/ppyc/ - Main application (root:www-data)"
echo "  /root/ppyc_env.sh - Environment configuration (root only)"
echo "  /var/log/nginx/ppyc/ - Nginx logs"
echo "  /var/backups/ppyc/ - Database backups"
echo
echo "Next steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Update Cloudinary credentials in /root/ppyc_env.sh"
echo "3. Set up SSL certificates with Let's Encrypt"
echo "4. Configure monitoring and alerts"
echo "5. Test all functionality thoroughly"
echo "6. Run daily health check: /root/check_ppyc.sh"
```

## Troubleshooting

### Common Issues

#### Node.js Version Compatibility
**Problem**: npm warnings about unsupported Node.js version during frontend install

**Solution**: The application requires Node.js 20+ for optimal compatibility. If using Node.js 18, you may see warnings but the application should still work. To upgrade:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Should show v20.x.x
```

#### Environment Variables Not Loading in Puma Service
**Problem**: Puma service fails to start or can't access environment variables

**Solution**: Ensure the wrapper script approach is used:
```bash
# Check if wrapper script exists and is executable
ls -la /usr/local/bin/puma-with-env.sh

# Test the wrapper script manually
/usr/local/bin/puma-with-env.sh

# If needed, recreate the wrapper script
cat > /usr/local/bin/puma-with-env.sh << 'EOF'
#!/bin/bash
source /root/ppyc_env.sh
cd /var/www/ppyc/ppyc_backend
exec bundle exec puma -C config/puma.rb
EOF
chmod +x /usr/local/bin/puma-with-env.sh
```

### Legacy Issues (Fixed in Current Version)

1. **Service won't start**: Check logs with `journalctl -u service_name -f`
2. **Database connection errors**: Verify credentials and run `bundle exec rails db:health_check`
3. **Frontend not loading**: Check nginx logs and verify build exists
4. **502 Bad Gateway**: Ensure Puma is running and accessible on port 3000
5. **Bundle install fails with pg gem error**: Install PostgreSQL development headers
   ```bash
   apt install -y libpq-dev
   cd /var/www/ppyc/ppyc_backend && bundle install
   ```
6. **Permission denied errors**: Verify ownership with `ls -la /var/www/ppyc/`

### Useful Commands

```bash
# Restart all services
systemctl restart puma sidekiq nginx

# View application logs
tail -f /var/www/ppyc/ppyc_backend/log/production.log

# Check process status
ps aux | grep -E "(puma|nginx|postgres|redis)"

# Test database connection
cd /var/www/ppyc/ppyc_backend && bundle exec rails console

# Update application (pull latest changes)
cd /var/www/ppyc
git pull origin main
cd ppyc_backend && bundle install
cd ../ppyc_frontend && npm ci && npm run build
systemctl restart puma nginx

# Check file permissions
ls -la /var/www/ppyc/
stat /var/www/ppyc/ppyc_backend/tmp/pids/

# Monitor resource usage
htop
df -h
free -h
```

---

## Summary

### Required Services for PPYC Production

✅ **Services that MUST be running:**
- **PostgreSQL** (`systemctl status postgresql`) - Database
- **Redis** (`systemctl status redis-server`) - Action Cable WebSocket connections only
- **Puma** (`systemctl status puma`) - Rails API server
- **Nginx** (`systemctl status nginx`) - Web server and reverse proxy

❌ **Services NOT needed:**
- ~~Sidekiq~~ - PPYC uses solid_queue (database-backed background jobs)
- ~~Memcached~~ - PPYC uses solid_cache (database-backed caching)

### Architecture Overview

**PPYC uses the Rails 8 "Solid" stack for simplified deployment:**
- **solid_queue** - Database-backed background jobs (no separate service needed)
- **solid_cache** - Database-backed caching (no separate service needed)
- **Redis** - Only for Action Cable WebSocket connections (not for jobs/cache)

### Quick Health Check

```bash
# Check all required services
systemctl status postgresql puma nginx redis-server

# Test application endpoints
curl http://localhost:3000/up        # Rails health check
curl http://localhost/               # Frontend application

# Check logs if issues
journalctl -u puma -f
tail -f /var/log/nginx/error.log
```

🎉 **Your PPYC application should now be running successfully!**

### Security Considerations for Root Deployment

Since this guide uses root deployment, consider these additional security measures:

```bash
# 1. Configure firewall (UFW)
ufw enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw status

# 2. Secure SSH access
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# 3. Set up fail2ban
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# 4. Regular security updates
echo '0 3 * * * apt update && apt upgrade -y' | crontab -e

# 5. Monitor log files for suspicious activity
tail -f /var/log/auth.log
tail -f /var/log/nginx/ppyc/access.log
```

---

This guide provides a complete installation process for the PPYC application on Ubuntu 24.04 LTS with root user deployment. The application follows Linux best practices with `/var/www/ppyc` for the web application while maintaining root control for deployment and administration. Make sure to customize domain names, credentials, and SSL certificates according to your specific setup. 