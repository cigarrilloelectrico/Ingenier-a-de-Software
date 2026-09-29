import { Router } from "express";
import inventarioRouter from "./inventario.routes.js";

/**
 * Mounts every API router under /api.
 * Add each module's router here as it is created, e.g. `router.use("/avisos", avisoRouter);`
 * @param {import("express").Express} app
 */
export function routerApi(app) {
  const router = Router();

  router.use("/inventario", inventarioRouter);

  app.use("/api", router);
}
