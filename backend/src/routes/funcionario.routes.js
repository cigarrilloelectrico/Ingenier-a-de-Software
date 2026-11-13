import { Router } from "express";
import { authMiddleware, authPasswordTemporalMiddleware, authorizeRoles } from "../middleware/auth.middleware.js";
import { visualizarFuncionariosController, obtenerFuncionarioController, crearFuncionarioController, cambiarRecintoFuncionarioController, desactivarFuncionarioController, reactivarFuncionarioController, cambiarPasswordTemporalController } from "../controllers/funcionario.controller.js";

const router = Router();

// El propio funcionario reemplaza su contraseña temporal en su primer ingreso (RF35).
// Usa authPasswordTemporalMiddleware porque con la contraseña temporal el resto de rutas le está bloqueado.
// Va antes de las rutas /:id para que "password-temporal" no se lea como un id
router.patch("/password-temporal", authPasswordTemporalMiddleware, authorizeRoles("Funcionario"), cambiarPasswordTemporalController);

// Administración de funcionarios: solo Rectoría (RF35 a RF38). Ninguna cuenta se elimina, se desactiva (RF37)
router.use(authMiddleware, authorizeRoles("Administrador"));
router.get("/", visualizarFuncionariosController);
router.get("/:id", obtenerFuncionarioController);
router.post("/", crearFuncionarioController);
router.patch("/:id/recinto", cambiarRecintoFuncionarioController);
router.patch("/:id/desactivar", desactivarFuncionarioController);
router.patch("/:id/reactivar", reactivarFuncionarioController);

export default router;
