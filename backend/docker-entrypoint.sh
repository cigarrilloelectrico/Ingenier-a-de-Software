#!/bin/sh
# Se ejecuta cada vez que arranca el contenedor, antes del comando (CMD)
set -e

# Reinstala las dependencias solo si el package-lock.json cambió desde la última instalación (por ejemplo, tras un git pull)
HASH_ACTUAL=$(sha256sum package-lock.json | cut -d " " -f 1)
HASH_INSTALADO=$(cat node_modules/.package-lock.sha256 2>/dev/null || true)

if [ "$HASH_ACTUAL" != "$HASH_INSTALADO" ]; then
  echo "package-lock.json cambió: reinstalando dependencias..."
  npm ci
  echo "$HASH_ACTUAL" > node_modules/.package-lock.sha256
fi

exec "$@"
