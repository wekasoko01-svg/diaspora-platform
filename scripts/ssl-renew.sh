#!/bin/bash
# Let's Encrypt SSL certificate renewal via Certbot
# Run weekly via cron: crontab -e
#   0 3 * * 1 /path/to/scripts/ssl-renew.sh >> /var/log/ssl-renew.log 2>&1

set -euo pipefail

DOMAIN="${1:-diasporalink.co.ke}"
EMAIL="${2:-admin@diasporalink.co.ke}"
WEBROOT="${3:-/var/www/html}"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }

log "Starting SSL renewal for $DOMAIN"

if command -v certbot &>/dev/null; then
  certbot renew --non-interactive --agree-tos --email "$EMAIL" --webroot -w "$WEBROOT" --deploy-hook "systemctl reload nginx" 2>&1 | tee -a /dev/null
  log "Certbot renewal completed"
else
  log "WARNING: certbot not installed. Install via: sudo apt install certbot python3-certbot-nginx"
  log "Manual renewal: certbot renew --quiet && systemctl reload nginx"
fi

# Check expiry
if command -v openssl &>/dev/null; then
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  if [ -f "$CERT_PATH" ]; then
    EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH" | cut -d= -f2)
    DAYS_LEFT=$(openssl x509 -checkend $((86400 * 30)) -noout -in "$CERT_PATH" && echo "more than 30" || echo "less than 30")
    log "Certificate for $DOMAIN expires: $EXPIRY ($DAYS_LEFT days remaining)"
  fi
fi

log "SSL renewal check complete"
