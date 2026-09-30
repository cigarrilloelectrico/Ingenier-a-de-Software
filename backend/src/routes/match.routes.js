import express from 'express';
import { getMatches } from '../controllers/match.controller.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware.js';
import { validarIdObjeto } from '../validations/match.validation.js';

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles('Funcionario'));
router.get('/:id', validarIdObjeto, getMatches);

export default router;