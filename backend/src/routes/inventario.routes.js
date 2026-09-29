"use strict";
import { Router } from "express";
import { subirFotos } from "../middleware/upload.middleware.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  visualizarInventarioController,
  registrarObjetoController,
  actualizarObjetoController,
} from "../controllers/inventario.controller.js";

const router = Router();

// El inventario es solo para funcionarios: el alumno nunca lo ve (antifraude) y el administrador no opera objetos (RF32)
router.use(authMiddleware);
router.use(authorizeRoles("Funcionario"));

router.get("/", visualizarInventarioController);
router.post("/", subirFotos, registrarObjetoController);
router.patch("/:id", actualizarObjetoController);

export default router;
