# PPYC Backend Deployment Guide

This guide covers the complete deployment process for the PPYC Backend Rails application, with special focus on database setup and configuration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Deployment Steps](#deployment-steps)
5. [Health Checks](#health-checks)
6. [Troubleshooting](#troubleshooting)
7. [Service Management](#service-management)

## Prerequisites

### System Requirements
- Ubuntu 20.04+ or similar Linux distribution
- PostgreSQL 12+ installed and running
- Ruby 3.3+ with rbenv or similar
- Bundler gem installed
- Nginx (for production)
- Systemd for service management

### Software Installation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Ruby dependencies
sudo apt install git curl libssl-dev libreadline-dev zlib1g-dev \
  autoconf bison build-essential libyaml-dev libreadline-dev \
  libncurses5-dev libffi-dev libgdbm-dev -y

# Install rbenv (if not already installed)
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
```

## Environment Variables

### Required Variables
The following environment variables are required for production deployment:

```bash
# Database Configuration
export PPYC_BACKEND_DATABASE_PASSWORD="your_secure_password"

# Rails Configuration
export SECRET_KEY_BASE="$(openssl rand -hex 64)"
export RAILS_ENV="production"

# Optional but recommended
export RAILS_LOG_LEVEL="info"
export RAILS_MAX_THREADS="5"
export PORT="3000"
```

### Optional Variables
```bash
# Cloudinary (for image uploads)
export CLOUDINARY_CLOUD_NAME="your_cloud_name"
export CLOUDINARY_API_KEY="your_api_key"
export CLOUDINARY_API_SECRET="your_api_secret"

# Database Connection (if different from defaults)
export PPYC_BACKEND_DATABASE_USERNAME="ppyc_user"
export PPYC_BACKEND_DATABASE_HOST="localhost"
export PPYC_BACKEND_DATABASE_PORT="5432"
```

### Setting Environment Variables Permanently

#### Option 1: User Profile (for deploy user)
```bash
# Add to ~/.bashrc or ~/.zshrc
echo 'export PPYC_BACKEND_DATABASE_PASSWORD="your_password"' >> ~/.bashrc
echo 'export SECRET_KEY_BASE="your_secret_key"' >> ~/.bashrc
echo 'export RAILS_ENV="production"' >> ~/.bashrc
```

#### Option 2: Environment File
Create `/var/www/ppyc/ppyc_backend/.env.production`:
```bash
PPYC_BACKEND_DATABASE_PASSWORD=your_password
SECRET_KEY_BASE=your_secret_key
RAILS_ENV=production
```

#### Option 3: Systemd Service (recommended for production)
Add to your systemd service file:
```ini
[Service]
Environment=PPYC_BACKEND_DATABASE_PASSWORD=your_password
Environment=SECRET_KEY_BASE=your_secret_key
Environment=RAILS_ENV=production
```

## Database Setup

### Automated Setup (Recommended)
Use the provided setup script:

```bash
# Set the database password
export PPYC_BACKEND_DATABASE_PASSWORD="Bytes1010"

# Run the setup script
cd /var/www/ppyc/ppyc_backend
bin/setup-database
```

### Manual Setup
If you prefer to set up the database manually:

1. **Create Database User**
```sql
sudo -u postgres psql -c "CREATE USER ppyc_user WITH PASSWORD 'Bytes1010';"
sudo -u postgres psql -c "ALTER USER ppyc_user CREATEDB;"
```

2. **Create Database**
```sql
sudo -u postgres psql -c "CREATE DATABASE ppyc_production OWNER ppyc_user;"
```

3. **Set Permissions**
```sql
sudo -u postgres psql -d ppyc_production << EOF
GRANT ALL PRIVILEGES ON DATABASE ppyc_production TO ppyc_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO ppyc_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ppyc_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ppyc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ppyc_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ppyc_user;
EOF
```

## Deployment Steps

### 1. Code Deployment
```bash
# Clone or pull latest code
cd /var/www/ppyc
git pull origin main

# Install dependencies
cd ppyc_backend
bundle install --deployment --without development test
```

### 2. Database Migration
```bash
# Set environment variables
export PPYC_BACKEND_DATABASE_PASSWORD="Bytes1010"
export SECRET_KEY_BASE="$(openssl rand -hex 64)"
export RAILS_ENV="production"

# Run migrations
bundle exec rails db:migrate

# Optional: seed database
bundle exec rails db:seed
```

### 3. Asset Compilation (if needed)
```bash
bundle exec rails assets:precompile
```

### 4. Service Restart
```bash
sudo systemctl restart puma
sudo systemctl restart nginx
```

## Health Checks

### Database Health Check
Use the built-in health check rake task:
```bash
bundle exec rails db:health_check
```

### Test Database Connection
```bash
bundle exec rails db:test_connection[ppyc_user,Bytes1010]
```

### Environment Validation
The application will automatically validate environment variables on startup. To manually validate:
```bash
VALIDATE_ENV_VARS=true bundle exec rails runner "puts 'Environment validation passed'"
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
**Problem**: `PG::ConnectionBad: password authentication failed`

**Solutions**:
- Check if environment variable is set: `echo $PPYC_BACKEND_DATABASE_PASSWORD`
- Test direct connection: `PGPASSWORD=Bytes1010 psql -h localhost -U ppyc_user -d ppyc_production -c "SELECT current_user;"`
- Reset password: `sudo -u postgres psql -c "ALTER USER ppyc_user WITH PASSWORD 'Bytes1010';"`

#### 2. Schema Migrations Permission Error
**Problem**: `ERROR: permission denied for table schema_migrations`

**Solutions**:
- Reset permissions: `bin/setup-database permissions`
- Check table owner: `sudo -u postgres psql -d ppyc_production -c "\dt"`
- Recreate schema_migrations table if needed

#### 3. Environment Variables Not Loading
**Problem**: Required environment variables not set

**Solutions**:
- Check if variables are exported: `printenv | grep PPYC`
- Reload shell configuration: `source ~/.bashrc`
- Check systemd service environment settings

#### 4. Rails Application Won't Start
**Problem**: Various startup errors

**Solutions**:
- Check logs: `sudo journalctl -u puma -f`
- Validate environment: `bundle exec rails db:health_check`
- Check file permissions: `ls -la /var/www/ppyc/ppyc_backend`

### Debugging Commands

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='ppyc_production';"

# Check Rails logs
tail -f log/production.log

# Check system logs
sudo journalctl -u puma -f
sudo journalctl -u nginx -f

# Test database setup script
bin/setup-database test
```

## Service Management

### Systemd Service File Example
Create `/etc/systemd/system/puma.service`:

```ini
[Unit]
Description=Puma HTTP Server for PPYC Backend
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/ppyc/ppyc_backend
Environment=RAILS_ENV=production
Environment=PPYC_BACKEND_DATABASE_PASSWORD=Bytes1010
Environment=SECRET_KEY_BASE=your_secret_key_here
ExecStart=/home/deploy/.rbenv/shims/bundle exec puma -C config/puma.rb
ExecReload=/bin/kill -USR1 $MAINPID
StandardOutput=journal
StandardError=journal
SyslogIdentifier=puma
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=5
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
```

### Service Commands
```bash
# Enable and start service
sudo systemctl enable puma
sudo systemctl start puma

# Check status
sudo systemctl status puma

# Restart service
sudo systemctl restart puma

# View logs
sudo journalctl -u puma -f
```

## Security Considerations

1. **Database Passwords**: Use strong, unique passwords
2. **Environment Variables**: Never commit sensitive variables to version control
3. **File Permissions**: Ensure proper file ownership and permissions
4. **Firewall**: Configure firewall to restrict database access
5. **SSL/TLS**: Use SSL for database connections in production

## Monitoring and Maintenance

### Regular Health Checks
```bash
# Daily health check
bundle exec rails db:health_check

# Check for pending migrations
bundle exec rails db:migrate:status

# Monitor disk usage
df -h

# Monitor memory usage
free -h
```

### Log Rotation
Configure log rotation for Rails logs:
```bash
# Add to /etc/logrotate.d/ppyc
/var/www/ppyc/ppyc_backend/log/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
}
```

---

For additional help, check the application logs and use the built-in health check tools. If issues persist, verify all environment variables are set correctly and the database is accessible. 