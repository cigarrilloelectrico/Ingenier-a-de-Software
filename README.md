# UBB Objetos Perdidos

Plataforma de objetos perdidos de la Universidad del Bío-Bío: backend en Express + Prisma (PostgreSQL) y frontend en React + Vite.

## Levantar el proyecto con Docker

Con Docker el proyecto funciona igual en Linux, Windows y macOS. No hace falta instalar Node ni PostgreSQL: solo [Docker Desktop](https://www.docker.com/products/docker-desktop/) (en Linux basta con Docker Engine y el plugin `docker compose`).

1. Crea `backend/.env` con al menos el secreto de las sesiones. Las variables de la base de datos no hacen falta: Docker las define solo.

   ```env
   JWT_SECRET=un-texto-largo-y-secreto
   # Opcional, para enviar correos (por ejemplo con Resend)
   EMAIL_HOST=smtp.resend.com
   EMAIL_PORT=465
   EMAIL_USER=resend
   EMAIL_PASS=re_tu_api_key
   EMAIL_FROM=noreply@tudominio.cl
   ```

2. Levanta todo desde la raíz del repositorio:

   ```bash
   docker compose up --build
   ```

   La primera vez tarda unos minutos. Al arrancar, el backend aplica las migraciones pendientes solo.

3. Abre:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000/api
   - PostgreSQL (para DBeaver, pgAdmin, etc.): `localhost:5435`, usuario `postgres`, contraseña `postgres`, base `ubb_objetos_perdidos`

Los cambios que hagas en el código se recargan solos, sin reiniciar los contenedores.

### Comandos útiles

| Para | Comando |
|---|---|
| Detener todo | `docker compose down` |
| Cargar los datos de prueba | `docker compose exec backend npm run db:seed` |
| Crear una migración tras cambiar un `.prisma` | `docker compose exec backend npx prisma migrate dev --name nombre-del-cambio` |
| Ver los logs del backend | `docker compose logs -f backend` |
| Borrar la base de datos y empezar de cero | `docker compose down -v` |

Si un `git pull` trae dependencias nuevas, no hay que hacer nada: al arrancar, cada contenedor detecta que cambió el `package-lock.json` y las reinstala.

### Si un puerto ya está ocupado

Crea un archivo `.env` en la raíz del repositorio (está en el `.gitignore`) con el puerto que quieras usar en tu máquina:

```env
BACKEND_HOST_PORT=3001
FRONTEND_HOST_PORT=5174
DB_HOST_PORT=5436
```

El frontend y el CORS del backend se ajustan solos al puerto elegido.

### Notas para Windows

- Instala Docker Desktop con el motor WSL 2 (la opción por defecto).
- Los scripts `.sh` deben tener finales de línea LF: el `.gitattributes` del repositorio lo asegura al clonar.
