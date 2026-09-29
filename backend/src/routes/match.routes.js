import express from 'express';
import { getMatches } from '../controllers/match.controller.js';
import { validarIdObjeto } from '../validations/match.validation.js';

const router = express.Router();

router.get('/:id', validarIdObjeto, getMatches);

export default router;