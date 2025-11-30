# PPYC App Startup Cheatsheet

Quick reference for starting the app locally and on the VPS.

## 🏠 Local Development

### Start Both Services

```bash
# Terminal 1: Backend (Rails)
cd /Users/ccandelora/Sites/ppyc/ppyc_backend
bin/rails server

# Terminal 2: Frontend (Vite)
cd /Users/ccandelora/Sites/ppyc/ppyc_frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Endpoints**: http://localhost:5173/api/v1/* (proxied to backend)

### Verify Services Are Running

```bash
# Check processes
ps aux | grep -E "(rails|vite|puma)" | grep -v grep

# Check ports
lsof -i :3000 -i :5173 | grep LISTEN
```

### Stop Services
- Press `Ctrl+C` in each terminal, or:
```bash
# Kill by port
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 🚀 VPS Production (Hostinger)

### SSH Access
```bash
ssh root@31.97.148.52
# Password: 00hdn0Bn@i#aoPw3D3g&
```

### After Repository Update

#### 1. Pull Latest Code
```bash
cd /var/www/ppyc
git pull origin main
```

#### 2. Update Backend
```bash
cd /var/www/ppyc/ppyc_backend
bundle install
bundle exec rails db:migrate RAILS_ENV=production
sudo systemctl restart puma
```

#### 3. Update Frontend
```bash
cd /var/www/ppyc/ppyc_frontend
npm install
npm run build
sudo cp index.prod.html dist/index.html
sudo chown www-data:www-data dist/index.html
sudo chmod 644 dist/index.html
sudo systemctl reload nginx
```

### Service Management

#### Check Service Status
```bash
# Backend (Puma)
sudo systemctl status puma

# Web Server (Nginx)
sudo systemctl status nginx

# List all PPYC services
sudo systemctl list-units | grep -E "ppyc|puma|nginx"
```

#### Restart Services
```bash
# Restart backend
sudo systemctl restart puma

# Restart web server
sudo systemctl restart nginx

# Or reload (no downtime)
sudo systemctl reload nginx
```

#### View Logs
```bash
# Backend logs
sudo journalctl -u puma -f
tail -f /var/www/ppyc/ppyc_backend/log/production.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check for errors
sudo tail -50 /var/log/nginx/error.log
```

### Verify Services Are Running

```bash
# Check if Puma is listening
sudo netstat -tlnp | grep 3000

# Check if Nginx is listening
sudo netstat -tlnp | grep -E ":80|:443"

# Test backend directly
curl http://localhost:3000/api/v1/health

# Test frontend
curl -I http://localhost/
```

---

## 🔧 Common Troubleshooting

### Local Development

#### Frontend won't start
```bash
# Check Node version (needs 18+)
node --version

# Clear node_modules and reinstall
cd ppyc_frontend
rm -rf node_modules package-lock.json
npm install
```

#### Backend won't start
```bash
# Check database connection
cd ppyc_backend
bundle exec rails db:migrate:status

# Check for port conflicts
lsof -i :3000
```

### VPS Production

#### 500 Internal Server Error
```bash
# Check Nginx error log
sudo tail -50 /var/log/nginx/error.log

# Check Puma logs
sudo journalctl -u puma -n 50

# Verify Nginx config
sudo nginx -t

# Check file permissions
ls -la /var/www/ppyc/ppyc_frontend/dist/
ls -la /var/www/ppyc/ppyc_frontend/dist/index.html
```

#### CORS Errors
```bash
# Verify CORS config in Rails
grep -r "allowed_origins" /var/www/ppyc/ppyc_backend/config/

# Check Nginx CORS headers
sudo tail -f /var/log/nginx/error.log | grep -i cors
```

#### Database Connection Issues
```bash
# Test database connection
cd /var/www/ppyc/ppyc_backend
bundle exec rails db:health_check

# Check PostgreSQL status
sudo systemctl status postgresql
```

#### Frontend Not Updating
```bash
# Rebuild frontend
cd /var/www/ppyc/ppyc_frontend
rm -rf dist/*
npm run build
sudo cp index.prod.html dist/index.html
sudo chown -R www-data:www-data dist/
sudo systemctl reload nginx
```

---

## 📋 Quick Checklist

### Local Startup
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] API calls work (check browser console)

### VPS After Update
- [ ] `git pull` completed
- [ ] Backend dependencies installed (`bundle install`)
- [ ] Database migrations run (`rails db:migrate`)
- [ ] Frontend built (`npm run build`)
- [ ] `index.html` copied and has correct permissions
- [ ] Services restarted (`systemctl restart puma`, `systemctl reload nginx`)
- [ ] Site accessible at http://srv894370.hstgr.cloud
- [ ] No errors in logs

---

## 🔗 Important Paths

### Local
- Backend: `/Users/ccandelora/Sites/ppyc/ppyc_backend`
- Frontend: `/Users/ccandelora/Sites/ppyc/ppyc_frontend`

### VPS
- Root: `/var/www/ppyc`
- Backend: `/var/www/ppyc/ppyc_backend`
- Frontend: `/var/www/ppyc/ppyc_frontend`
- Frontend dist: `/var/www/ppyc/ppyc_frontend/dist`
- Nginx config: `/etc/nginx/sites-enabled/default`
- Nginx logs: `/var/log/nginx/`

---

## 📝 Notes

- **VPS Domain**: http://srv894370.hstgr.cloud (temporary)
- **Production Domain**: https://ppyc1910.org (permanent)
- **Backend Port**: 3000 (internal, proxied through Nginx)
- **Frontend Port**: 80 (Nginx serves static files)
- **Nginx proxies** `/api/*` requests to backend on port 3000

