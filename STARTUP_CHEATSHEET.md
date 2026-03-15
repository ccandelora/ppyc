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

### Production Env Vars (important)

This server loads Puma env vars from a wrapper script:
- Systemd service: `/etc/systemd/system/puma.service`
- ExecStart script: `/usr/local/bin/puma-with-env.sh`
- Env file sourced by script: `/root/ppyc_env.sh`

So, for backend API keys (Rails runtime), update `/root/ppyc_env.sh`:
```bash
export WEATHER_API_KEY="..."
export TIDECHECK_API_KEY="..."
export TIDECHECK_STATION_ID="8444012"
export TIDECHECK_DATUM="MLLW"
```

Then restart Puma:
```bash
sudo systemctl restart puma
```

Verify env vars are loaded in the running Puma process:
```bash
PID=$(sudo systemctl show puma --property=MainPID --value)
sudo tr '\0' '\n' < /proc/$PID/environ | grep -E '^TIDECHECK|^WEATHER_API_KEY|^RAILS_ENV'
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
# IMPORTANT: Build WITHOUT VITE_API_BASE_URL to use relative URLs (/api/v1)
# This avoids CORS issues by making requests to the same origin
unset VITE_API_BASE_URL
npm run build
# Note: Vite build automatically creates dist/index.html (no manual copy needed)
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

#### Tide endpoint falls back to WeatherAPI (no tide data)
If `/api/v1/weather/marine` returns `"source":"weatherapi"` in production:

```bash
# 1) Test TideCheck directly with current server env
source /root/ppyc_env.sh
curl -i -s -H "X-API-Key: $TIDECHECK_API_KEY" \
  "https://tidecheck.com/api/station/$TIDECHECK_STATION_ID/tides?days=3&datum=${TIDECHECK_DATUM:-MLLW}" | sed -n '1,40p'
```

If direct TideCheck call is 200 but app still falls back, Solid Cache is likely broken.

```bash
# 2) Verify Rails cache write
cd /var/www/ppyc/ppyc_backend
RAILS_ENV=production bundle exec rails runner 'Rails.cache.write("probe","ok",expires_in:60); puts Rails.cache.read("probe").inspect'
```

If you see `No unique index found for key_hash`, fix Solid Cache table/indexes:

```bash
RAILS_ENV=production bundle exec rails runner '
conn = SolidCache::Entry.connection
conn.execute <<~SQL
  CREATE TABLE IF NOT EXISTS solid_cache_entries (
    id bigserial PRIMARY KEY,
    key bytea NOT NULL,
    value bytea NOT NULL,
    created_at timestamp NOT NULL,
    key_hash bigint NOT NULL,
    byte_size integer NOT NULL
  );
SQL
conn.execute "CREATE INDEX IF NOT EXISTS index_solid_cache_entries_on_byte_size ON solid_cache_entries (byte_size);"
conn.execute "CREATE INDEX IF NOT EXISTS index_solid_cache_entries_on_key_hash_and_byte_size ON solid_cache_entries (key_hash, byte_size);"
conn.execute "DROP INDEX IF EXISTS index_solid_cache_entries_on_key_hash;"
conn.execute "CREATE UNIQUE INDEX index_solid_cache_entries_on_key_hash ON solid_cache_entries (key_hash);"
puts "Solid cache table/index ensured."
'
sudo systemctl restart puma
```

Re-test endpoint:
```bash
curl -s "http://localhost:3000/api/v1/weather/marine?location=Winthrop,MA&days=3"
# Expect: source is "tidecheck" or "tidecheck+weatherapi"
```

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
# Most CORS errors are caused by frontend using absolute API URLs
# Check if frontend was built with VITE_API_BASE_URL set
cd /var/www/ppyc/ppyc_frontend
echo $VITE_API_BASE_URL
# If it shows a URL like https://ppyc1910.org, rebuild without it:
unset VITE_API_BASE_URL
npm run build
sudo chown www-data:www-data dist/index.html
sudo systemctl reload nginx

# Also verify CORS config in Rails
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
# Verify index.html was created (Vite build plugin creates it automatically)
ls -la dist/index.html
# Verify script tag references /assets/ files, not /src/main.jsx
cat dist/index.html | grep -A 2 "script"
sudo chown -R www-data:www-data dist/
sudo systemctl reload nginx
```

#### MIME Type Error (Failed to load module script)
```bash
# This error means index.html is missing or has wrong script references
# Verify index.html exists and has correct script tag
cd /var/www/ppyc/ppyc_frontend
ls -la dist/index.html
cat dist/index.html | grep "script"
# Should show: <script type="module" src="/assets/index.prod-*.js"></script>
# NOT: <script type="module" src="/src/main.jsx"></script>

# If wrong, rebuild:
npm run build
sudo chown www-data:www-data dist/index.html
sudo chmod 644 dist/index.html
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
- [ ] `index.html` exists in `dist/` (created automatically by Vite)
- [ ] `index.html` has correct permissions (`www-data:www-data`, `644`)
- [ ] Script tag in `index.html` references `/assets/index.prod-*.js` (not `/src/main.jsx`)
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

