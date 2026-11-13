import { Router } from "express";
import { authPasswordTemporalMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";
import { cambiarPasswordTemporalController } from "../controllers/funcionario.controller.js";

const router = Router();

router.patch(
  "/password-temporal",
  authPasswordTemporalMiddleware,
  authorizeRoles("Funcionario"),
  cambiarPasswordTemporalController
);

export default router;
