#!/bin/sh
# ==============================================================================
# KP Physics Academy — Automated Daily PostgreSQL Backup Loop
# ==============================================================================
set -e

mkdir -p /backups
echo "[KP-Backup] Automated PostgreSQL backup daemon started."

while true; do
  STAMP=$(date +%Y-%m-%d_%H-%M)
  TARGET="/backups/kp_physics_${STAMP}.sql.gz"
  echo "[KP-Backup] Creating compressed database snapshot: ${TARGET}"
  PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "${TARGET}"
  # Retain last 14 days of backups to stay within Free Tier storage limits
  find /backups -name "kp_physics_*.sql.gz" -mtime +14 -delete
  echo "[KP-Backup] Snapshot complete. Sleeping 24h..."
  sleep 86400
done
