#!/bin/bash
set -euo pipefail

ENV_FILE="/home/ec2-user/BACKEND/.env"
BACKUP_DIR="/opt/db-backups/hprinfravrcms"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

set -a
# shellcheck disable=SC1090
source <(cat "$ENV_FILE" | tr -d '\r')
set +a

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
CNF_FILE=$(mktemp)
chmod 600 "$CNF_FILE"
trap 'rm -f "$CNF_FILE"' EXIT

cat > "$CNF_FILE" <<EOF
[client]
host=$DB_HOST
port=${DB_PORT:-3306}
user=$DB_USER
password=$DB_PASSWORD
EOF

OUT_FILE="$BACKUP_DIR/${DB_NAME}-${TIMESTAMP}.sql.gz"

mysqldump --defaults-extra-file="$CNF_FILE" \
  --single-transaction --routines --triggers --quick --no-tablespaces \
  "$DB_NAME" | gzip > "$OUT_FILE"

find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "$(date '+%Y-%m-%d %H:%M:%S') backup ok: $(basename "$OUT_FILE") ($(du -h "$OUT_FILE" | cut -f1)), total dir size: $(du -sh "$BACKUP_DIR" | cut -f1)" >> "$BACKUP_DIR/backup.log"
