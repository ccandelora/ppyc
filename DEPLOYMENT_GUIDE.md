# PPYC Website Deployment Guide

## Phase 8: Production Deployment

This guide covers deploying the PPYC website to production with proper configuration, security, and performance optimizations.

## Prerequisites

- Ruby 3.3.5+ installed on production server
- Node.js 18+ for frontend builds
- PostgreSQL database server
- Cloudinary account for image hosting
- Domain name configured (e.g., ppyc.com)

## Backend Deployment (Rails API)

### 1. Environment Configuration

Create a `.env.production` file in `ppyc_backend/`:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ppyc_production
RAILS_ENV=production
SECRET_KEY_BASE=your-secret-key-base

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Origins
CORS_ORIGINS=https://ppyc.com,https://www.ppyc.com
```

### 2. Database Setup

```bash
cd ppyc_backend
RAILS_ENV=production rake db:create
RAILS_ENV=production rake db:migrate
RAILS_ENV=production rake db:seed
```

### 3. Assets and Precompilation

```bash
RAILS_ENV=production rake assets:precompile
```

### 4. Start Production Server

```bash
# Using Puma (recommended)
RAILS_ENV=production bundle exec puma -C config/puma.rb

# Or using systemd service (recommended for production)
sudo systemctl start ppyc-api
```

## Frontend Deployment (React)

### 1. Environment Configuration

Create a `.env.production` file in `ppyc_frontend/`:

```bash
VITE_API_BASE_URL=https://api.ppyc.com/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
```

### 2. Build for Production

```bash
cd ppyc_frontend
npm run build
```

### 3. Deploy to Web Server

```bash
# Copy dist/ folder to web server
rsync -avz dist/ user@server:/var/www/ppyc.com/
```

## Security Configuration

### 1. SSL/TLS Setup

Ensure SSL certificates are installed and configured:

```nginx
server {
    listen 443 ssl http2;
    server_name ppyc.com www.ppyc.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location / {
        root /var/www/ppyc.com;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

## Performance Optimizations

### 1. Rails Performance

- Enable caching in production
- Configure Redis for session storage
- Optimize database queries
- Use CDN for static assets

### 2. Frontend Performance

- Implement lazy loading for components
- Optimize images and assets
- Enable gzip compression
- Configure browser caching

## Monitoring and Logging

### 1. Application Monitoring

- Set up error tracking (e.g., Sentry)
- Monitor application performance
- Configure log rotation

### 2. Health Checks

- Rails: `/up` endpoint
- Frontend: Automated accessibility testing
- Database connectivity checks

## Backup Strategy

### 1. Database Backups

```bash
# Daily database backup
pg_dump ppyc_production > backup_$(date +%Y%m%d).sql
```

### 2. Media Backups

- Cloudinary provides automatic backups
- Consider additional backup for critical images

## Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrated and seeded
- [ ] Frontend built and deployed
- [ ] DNS configured correctly
- [ ] Firewall rules applied
- [ ] Monitoring tools setup
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit completed

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check origins in `cors.rb`
2. **Database Connection**: Verify DATABASE_URL
3. **Image Upload Issues**: Check Cloudinary credentials
4. **Session Problems**: Ensure session middleware is configured

### Logs Location

- Rails: `log/production.log`
- Nginx: `/var/log/nginx/`
- System: `journalctl -u ppyc-api`

## Support

For deployment support, contact the development team or refer to the main README.md file. 