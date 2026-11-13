# Imagen de desarrollo del backend. docker-compose.yml monta el código sobre /app,
# así que los cambios hechos en el computador se recargan solos (tsx watch).
FROM node:22-slim

# El motor de migraciones de Prisma necesita OpenSSL
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Quita los finales de línea de Windows (CRLF) por si git convirtió el script al clonar
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

# Corre con el usuario "node" de la imagen (uid 1000), para que los archivos que crea en el computador
# (fotos subidas, cliente de Prisma) no queden con dueño root en Linux
WORKDIR /app
RUN chown node:node /app
USER node

# Las dependencias se instalan dentro de Linux; el hash permite al entrypoint detectar si cambió el package-lock.json
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci && sha256sum package-lock.json | cut -d " " -f 1 > node_modules/.package-lock.sha256

COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
# Aplica las migraciones pendientes, regenera el cliente de Prisma y levanta el servidor con recarga automática
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]
