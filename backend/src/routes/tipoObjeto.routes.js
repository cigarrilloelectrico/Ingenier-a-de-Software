"use strict";

import { Router } from "express";
import { authMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";
import { visualizarTiposObjetoController } from "../controllers/tipoObjeto.controller.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  authorizeRoles("Alumno", "Funcionario", "Administrador"),
  visualizarTiposObjetoController
);

export default router;