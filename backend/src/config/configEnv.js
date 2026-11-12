import { config } from 'dotenv';
config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name} en el archivo .env`);
  return value;
}

export const db = {
  user: process.env.DB_USERNAME || process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || process.env.HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DATABASE || process.env.DB_NAME
}

export const DATABASE_URL =
  `postgresql://${encodeURIComponent(db.user)}:${encodeURIComponent(db.password)}` +
  `@${db.host}:${db.port}/${db.database}`;

export const PORT = Number(process.env.PORT) || 3000;
export const HOST = process.env.HOST || 'localhost';
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
export const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
export const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

export const getJwtSecret = () => required('JWT_SECRET');

// Session limits from RF4: 30 minutes of inactivity or 12 hours since login.
// The JWT is signed with SESSION_MAX_MS; inactivity is checked against Sesion.ultimaActividadAt
export const SESSION_IDLE_MS = 30 * 60 * 1000;
export const SESSION_MAX_MS  = 12 * 60 * 60 * 1000;
