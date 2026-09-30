"use strict";
import { Router } from "express";
import {
  loginAlumnoController,
  logoutController,
  perfilController,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Iniciar sesión como Alumno.
 * Valida correo institucional @alumnos.ubiobio.cl y contraseña.
 */
router.post(
  "/login",
  validate(loginSchema, "Datos de inicio de sesión inválidos."),
  loginAlumnoController
);

/**
 * Cerrar sesión activa.
 */
router.post("/logout", authMiddleware, logoutController);

/**
 * Obtener perfil del alumno logueado actualmente.
 */
router.get("/me", authMiddleware, perfilController);

export default router;
