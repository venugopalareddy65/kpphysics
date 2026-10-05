#!/usr/bin/env bash
# ==============================================================================
# KP Physics Academy — Automated Production Deployment & Hardening Script
# Usage: chmod +x scripts/deploy-prod.sh && ./scripts/deploy-prod.sh
# ==============================================================================
set -euo pipefail

echo "============================================================"
echo "🚀 KP Physics Academy — Production Rollout Starting"
echo "============================================================"

# 1. Verify .env configuration exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Copying from .env.example..."
  cp .env.example .env
fi

# 2. Optional UFW Firewall Hardening (when run as root on Ubuntu VM)
if command -v ufw >/dev/null 2>&1 && [ "$(id -u)" -eq 0 ]; then
  echo "🔒 Applying UFW Firewall Rules (Allow 22, 80, 443 only)..."
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
fi

# 3. Build and start production containers
echo "📦 Building and starting Docker Compose production stack..."
docker compose -f docker-compose.prod.yml --env-file .env up -d --build --remove-orphans

# 4. Wait for /api/health endpoint verification
echo "🩺 Waiting for application health check on port 3000..."
sleep 5
docker exec kp-physics-prod-app curl -fsS http://localhost:3000/api/health || {
  echo "❌ Healthcheck failed! Inspect logs with: docker compose -f docker-compose.prod.yml logs"
  exit 1
}

echo "✅ Deployment succeeded! KP Physics Academy is live and healthy."
