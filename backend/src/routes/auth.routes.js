"use strict";
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

router.post(
  "/login/personal",
  validate(loginFuncionarioSchema, "Datos de inicio de sesión inválidos."),
  loginPersonalController
);

/**
 * Cerrar sesión activa.
 */
router.post("/logout", authPasswordTemporalMiddleware, logoutController);

/**
 * Obtener perfil del alumno logueado actualmente.
 */
router.get("/me", authPasswordTemporalMiddleware, perfilController);

export default router;
