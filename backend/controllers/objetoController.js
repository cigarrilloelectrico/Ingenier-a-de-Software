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

    if (!req.file) {
      const error = new Error('Debe adjuntar al menos una imagen')
      error.statusCode = 400
      throw error
    }

    const imagen = req.file

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