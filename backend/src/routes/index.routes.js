import { Router } from "express";
import inventarioRouter from "./inventario.routes.js";
import recintoRouter from "./recinto.routes.js";
import matchRouter from "./matchRoutes.js";

/**
 * Mounts every API router under /api.
 * Add each module's router here as it is created, e.g. `router.use("/avisos", avisoRouter);`
 * @param {import("express").Express} app
 */
export function routerApi(app) {
  const router = Router();

  router.use("/inventario", inventarioRouter);
  router.use("/recintos", recintoRouter);
  // Sin authMiddleware mientras el cruce de coincidencias (RF20) use mockData; al conectarlo a la base debe quedar solo para funcionarios
  router.use("/match", matchRouter);

  app.use("/api", router);
}
