import { Router } from 'express'
import { registrarObjeto } from '../controllers/objetoController.js'

const router = Router()

router.post('/', registrarObjeto)

export default router