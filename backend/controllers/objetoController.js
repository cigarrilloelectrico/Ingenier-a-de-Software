import { registrarObjeto as registrarObjetoService } from '../services/objetoService.js'

const registrarObjeto = async (req, res, next) => {
  try {
    const {
      tipo,
      color,
      caracteristicas,
      lugarHallazgo,
      fechaRecepcion,
    } = req.body

    const imagen = req.file ?? null

    const datosObjeto = {
      tipo,
      color,
      caracteristicas,
      lugarHallazgo,
      fechaRecepcion,
      imagen,
    }

    const objeto = await registrarObjetoService(datosObjeto)

    res.status(201).json({
      success: true,
      message: 'Datos del objeto procesados correctamente',
      data: objeto,
    })
  } catch (error) {
    next(error)
  }
}

export { registrarObjeto }