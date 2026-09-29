"use strict";
import { Router } from "express";
import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  visualizarRecintosController,
  crearRecintoController,
  actualizarRecintoController,
  desactivarRecintoController,
  reactivarRecintoController,
} from "../controllers/recinto.controller.js";

const router = Router();

// Toda ruta de recintos requiere sesión activa
router.use(authMiddleware);

// Lectura: todos los roles la necesitan (formularios de avisos y objetos, y el mapa)
router.get("/", authorizeRoles("Alumno", "Funcionario", "Administrador"), visualizarRecintosController);
// Administración: solo Rectoría crea, edita, desactiva y reactiva recintos (RF33, RF34)
router.post("/", authorizeRoles("Administrador"), crearRecintoController);
router.patch("/:id", authorizeRoles("Administrador"), actualizarRecintoController);
router.patch("/:id/desactivar", authorizeRoles("Administrador"), desactivarRecintoController);
router.patch("/:id/reactivar", authorizeRoles("Administrador"), reactivarRecintoController);

export default router;
