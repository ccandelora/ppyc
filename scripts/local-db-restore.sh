#!/usr/bin/env bash
# =============================================================================
# Local Database Restore Script
# Pulls the latest production backup from the VPS and restores it into the
# local ppyc_backend_development database.
#
# Usage:
#   ./scripts/local-db-restore.sh              # Pull latest backup from VPS
#   ./scripts/local-db-restore.sh <file.sql.gz> # Restore a specific local file
# =============================================================================

set -euo pipefail

VPS_HOST="31.97.148.52"
VPS_USER="root"
VPS_BACKUP_DIR="/var/www/ppyc/backups"
LOCAL_BACKUP_DIR="$(cd "$(dirname "$0")/.." && pwd)/backups"
LOCAL_DB="ppyc_backend_development"
PSQL="/opt/homebrew/opt/postgresql@15/bin/psql"
CREATEDB="/opt/homebrew/opt/postgresql@15/bin/createdb"
DROPDB="/opt/homebrew/opt/postgresql@15/bin/dropdb"

# Use system psql/createdb/dropdb if homebrew ones don't exist
command -v "$PSQL" >/dev/null 2>&1 || PSQL="psql"
command -v "$CREATEDB" >/dev/null 2>&1 || CREATEDB="createdb"
command -v "$DROPDB" >/dev/null 2>&1 || DROPDB="dropdb"

echo "=== PPYC Local Database Restore ==="
echo "Started: $(date)"

mkdir -p "$LOCAL_BACKUP_DIR"

if [ -n "${1:-}" ] && [ -f "$1" ]; then
  # Use a specific local backup file
  BACKUP_FILE="$1"
  echo "Using local file: $BACKUP_FILE"
else
  # Pull latest backup from VPS
  echo "Finding latest backup on VPS..."
  LATEST=$(ssh "${VPS_USER}@${VPS_HOST}" \
    "ls -t ${VPS_BACKUP_DIR}/ppyc_production_*.sql.gz 2>/dev/null | head -1")

  if [ -z "$LATEST" ]; then
    echo "ERROR: No backups found on VPS at ${VPS_BACKUP_DIR}"
    echo ""
    echo "You may need to run a backup first. SSH into the VPS and run:"
    echo "  /var/www/ppyc/scripts/vps-db-backup.sh"
    exit 1
  fi

  FILENAME=$(basename "$LATEST")
  BACKUP_FILE="${LOCAL_BACKUP_DIR}/${FILENAME}"

  if [ -f "$BACKUP_FILE" ]; then
    echo "Backup already downloaded: $FILENAME"
  else
    echo "Downloading: $FILENAME"
    scp "${VPS_USER}@${VPS_HOST}:${LATEST}" "$BACKUP_FILE"
    echo "Downloaded to: $BACKUP_FILE"
  fi
fi

echo ""
echo "Restoring into local database: ${LOCAL_DB}"

# Drop and recreate the dev database
echo "Dropping existing database (if any)..."
$DROPDB --if-exists "$LOCAL_DB" 2>/dev/null || true

echo "Creating fresh database..."
$CREATEDB "$LOCAL_DB"

# Restore from the gzipped dump
echo "Loading backup data..."
gunzip -c "$BACKUP_FILE" | $PSQL -q "$LOCAL_DB" 2>&1 | {
  # Filter out noise but show real errors
  grep -v "^SET$" | grep -v "^$" | grep -iE "error|fatal" || true
}

# Verify
TABLE_COUNT=$($PSQL -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" "$LOCAL_DB" | tr -d ' ')
echo ""
echo "Restore complete!"
echo "Tables in ${LOCAL_DB}: ${TABLE_COUNT}"

# Show row counts for key tables
echo ""
echo "Row counts:"
for table in users posts events pages slides settings; do
  COUNT=$($PSQL -t -c "SELECT count(*) FROM ${table};" "$LOCAL_DB" 2>/dev/null | tr -d ' ' || echo "N/A")
  printf "  %-20s %s\n" "$table" "$COUNT"
done

echo ""
echo "Finished: $(date)"
echo ""
echo "You can now start the Rails backend with:"
echo "  cd ppyc_backend && bin/rails server"
