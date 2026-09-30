"use strict";
import { Router } from "express";
import {
  crearAvisoController,
  obtenerMisAvisosController,
  obtenerCatalogosController,
} from "../controllers/aviso.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { crearAvisoSchema } from "../schemas/aviso.schema.js";
import { subirFotoAviso } from "../middleware/upload.middleware.js";

const router = Router();

/**
 * Obtiene las opciones de las listas fijas (recintos y tipos de objeto activos)
 * para los selectores del formulario de aviso.
 */
router.get("/catalogos", obtenerCatalogosController);

/**
 * Obtiene los avisos de pérdida publicados por el alumno en sesión.
 * Cumple con la regla de privacidad: no expone en ningún momento objetos en depósito.
 */
router.get("/mis-avisos", obtenerMisAvisosController);

/**
 * Publica un aviso de pérdida de objeto.
*/
router.post(
  "/",
  subirFotoAviso,
  validate(crearAvisoSchema),
  crearAvisoController
);

export default router;
