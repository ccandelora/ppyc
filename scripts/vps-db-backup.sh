#!/usr/bin/env bash
# =============================================================================
# VPS Database Backup Script
# Run monthly via cron on the VPS (31.97.148.52)
# Dumps ppyc_production to a compressed file, retains 12 months of backups
#
# Cron entry (1st of each month at 2:00 AM):
#   0 2 1 * * /var/www/ppyc/scripts/vps-db-backup.sh >> /var/log/ppyc-backup.log 2>&1
# =============================================================================

set -euo pipefail

BACKUP_DIR="/var/www/ppyc/backups"
DB_NAME="ppyc_production"
DB_USER="ppyc_user"
TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/ppyc_production_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=365

# Load environment variables if available
if [ -f /root/ppyc_env.sh ]; then
  source /root/ppyc_env.sh
fi

# Set PGPASSWORD for non-interactive pg_dump
export PGPASSWORD="${PPYC_BACKEND_DATABASE_PASSWORD:?PPYC_BACKEND_DATABASE_PASSWORD not set}"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "=== PPYC Database Backup ==="
echo "Started: $(date)"
echo "Database: ${DB_NAME}"
echo "Output: ${BACKUP_FILE}"

# Dump and compress
pg_dump -U "$DB_USER" -h localhost "$DB_NAME" \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_FILE"

# Verify the backup isn't empty
FILESIZE=$(stat -c%s "$BACKUP_FILE" 2>/dev/null || stat -f%z "$BACKUP_FILE" 2>/dev/null)
if [ "$FILESIZE" -lt 1000 ]; then
  echo "ERROR: Backup file is suspiciously small (${FILESIZE} bytes). Something went wrong."
  rm -f "$BACKUP_FILE"
  exit 1
fi

echo "Backup complete: ${FILESIZE} bytes"

# Prune backups older than retention period
DELETED=$(find "$BACKUP_DIR" -name "ppyc_production_*.sql.gz" -mtime +${RETENTION_DAYS} -print -delete | wc -l)
echo "Pruned ${DELETED} backup(s) older than ${RETENTION_DAYS} days"

# List current backups
echo ""
echo "Current backups:"
ls -lh "$BACKUP_DIR"/ppyc_production_*.sql.gz 2>/dev/null || echo "  (none)"

echo ""
echo "Finished: $(date)"
