import { Router } from "express";
import authRouter from "./auth.routes.js";
import inventarioRouter from "./inventario.routes.js";
import recintoRouter from "./recinto.routes.js";
import avisoRouter from "./aviso.routes.js";
import matchRouter from "./match.routes.js";
import tipoObjetoRouter from "./tipoObjeto.routes.js";

export function routerApi(app) {
  const router = Router();

  router.use("/auth", authRouter);
  router.use("/inventario", inventarioRouter);
  router.use("/recintos", recintoRouter);
  router.use("/avisos", avisoRouter);
  router.use("/match", matchRouter);

  app.use("/api", router);
}
