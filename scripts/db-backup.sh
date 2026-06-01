#!/bin/bash
# Database backup script for DiasporaLink
# Run daily via cron: crontab -e
#   0 2 * * * /path/to/scripts/db-backup.sh

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/diaspora}"
DB_NAME="${DB_NAME:-diaspora_platform}"
DB_USER="${DB_USER:-diaspora}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BUCKET:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
FILENAME="${DB_NAME}_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${FILENAME}"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }

notify() {
  local message="$1"
  local level="${2:-info}"
  log "[${level}] ${message}"
  if [ -n "$SLACK_WEBHOOK" ]; then
    curl -s -X POST -H "Content-type: application/json" \
      --data "{\"text\":\"[${level}] DiasporaDB Backup: ${message}\"}" \
      "$SLACK_WEBHOOK" &>/dev/null || true
  fi
}

mkdir -p "$BACKUP_DIR"

# Dump and compress
notify "Starting backup of ${DB_NAME}@${DB_HOST}:${DB_PORT}"
PGPASSWORD="${DB_PASSWORD:-}" pg_dump \
  -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-acl \
  | gzip > "$BACKUP_PATH"

# Verify
FILE_SIZE=$(stat -c%s "$BACKUP_PATH" 2>/dev/null || stat -f%z "$BACKUP_PATH" 2>/dev/null || echo 0)
if [ "$FILE_SIZE" -lt 1000 ]; then
  notify "Backup file too small (${FILE_SIZE}B), possible failure" "error"
  exit 1
fi

notify "Backup created: ${FILENAME} (${FILE_SIZE} bytes)"

# Upload to S3
if [ -n "$S3_BUCKET" ]; then
  if command -v aws &>/dev/null; then
    aws s3 cp "$BACKUP_PATH" "s3://${S3_BUCKET}/backups/${FILENAME}" --storage-class STANDARD_IA
    notify "Uploaded to S3: s3://${S3_BUCKET}/backups/${FILENAME}"
  else
    notify "AWS CLI not available, skipping S3 upload" "warn"
  fi
fi

# Rotate old backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime +"${RETENTION_DAYS}" -delete

notify "Backup complete. Retention: ${RETENTION_DAYS} days"

# Restore command (manual):
# gunzip -c diaspora_platform_20260101_020000.sql.gz | PGPASSWORD=xxx psql -h localhost -U diaspora -d diaspora_platform
