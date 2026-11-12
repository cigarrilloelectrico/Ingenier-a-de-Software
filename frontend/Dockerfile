# Imagen de desarrollo del frontend. docker-compose.yml monta el código sobre /app,
# así que los cambios hechos en el computador se recargan solos (Vite).
FROM node:22-slim

# Quita los finales de línea de Windows (CRLF) por si git convirtió el script al clonar
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app
RUN chown node:node /app
USER node

# Las dependencias (incluidas las nativas, como las de Tailwind) se instalan dentro de Linux
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci && sha256sum package-lock.json | cut -d " " -f 1 > node_modules/.package-lock.sha256

COPY --chown=node:node . .

EXPOSE 5173
ENTRYPOINT ["docker-entrypoint.sh"]
# --host 0.0.0.0 permite entrar a Vite desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
