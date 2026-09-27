import { esFechaFutura } from '../utils/validacionesObjeto.js'

const registrarObjeto = async (datosObjeto) => {
  if (esFechaFutura(datosObjeto.fechaRecepcion)) {
    const error = new Error('La fecha de recepción no puede ser futura')
    error.statusCode = 400
    throw error
  }

  const objeto = {
    ...datosObjeto,
    estado: 'disponible',
  }

  // La persistencia se implementará cuando se confirme
  // la estructura de PostgreSQL.
  return objeto
}

export { registrarObjeto }