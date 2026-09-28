import { Router } from 'express'
import { registrarObjeto } from '../controllers/objetoController.js'
import upload from '../config/upload.js'

const router = Router()

router.post('/', upload.single('imagen'), registrarObjeto)

export default router