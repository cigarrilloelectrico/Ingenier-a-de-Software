import { Router } from "express";
import inventarioRouter from "./inventario.routes.js";
import recintoRouter from "./recinto.routes.js";
import matchRouter from "./matchRoutes.js";
import avisoRouter from "./aviso.routes.js";

export function routerApi(app) {
  const router = Router();

  router.use("/inventario", inventarioRouter);
  router.use("/recintos", recintoRouter);
  router.use("/avisos", avisoRouter);
  router.use("/match", matchRouter);

  app.use("/api", router);
}
