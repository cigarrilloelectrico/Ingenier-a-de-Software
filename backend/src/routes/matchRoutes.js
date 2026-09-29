import { Router } from 'express';
import { getMatches } from '../controllers/matchController.js';
import { validarIdObjeto } from '../validations/matchValidation.js';

const router = Router();

router.get('/:id', validarIdObjeto, getMatches);

export default router;
