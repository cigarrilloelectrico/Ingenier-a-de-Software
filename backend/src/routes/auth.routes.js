import { Router } from "express";
import {
  registrarAlumnoController,
  loginAlumnoController,
  loginFuncionarioController,
  loginPersonalController,
  logoutController,
  perfilController,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginFuncionarioSchema,
  loginSchema,
  registroAlumnoSchema,
} from "../schemas/auth.schema.js";
import { authPasswordTemporalMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/registro",
  validate(registroAlumnoSchema, "Datos de registro inválidos."),
  registrarAlumnoController
);

/**
 * Iniciar sesión como Alumno.
 * Valida correo institucional @alumnos.ubiobio.cl y contraseña.
 */
router.post(
  "/login",
  validate(loginSchema, "Datos de inicio de sesión inválidos."),
  loginAlumnoController
);

router.post(
  "/login/funcionario",
  validate(loginFuncionarioSchema, "Datos de inicio de sesión inválidos."),
  loginFuncionarioController
);

/**
 * Iniciar sesión como personal de la UBB: funcionario o administrador (RF31).
 * Usa la misma validación del funcionario: correo @ubiobio.cl y contraseña.
 */
router.post(
  "/login/personal",
  validate(loginFuncionarioSchema, "Datos de inicio de sesión inválidos."),
  loginPersonalController
);

/**
 * Cerrar sesión activa.
 * Abierta también a quien tiene contraseña temporal, para que pueda salir sin cambiarla.
 */
router.post("/logout", authPasswordTemporalMiddleware, logoutController);

/**
 * Obtener perfil del usuario logueado actualmente.
 * Abierta también a quien tiene contraseña temporal: el front lee `passwordTemporal` para mostrar el popup de cambio.
 */
router.get("/me", authPasswordTemporalMiddleware, perfilController);

export default router;
