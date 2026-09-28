import { validarFechaRecepcion } from '../utils/validacionesObjeto.js'

const registrarObjeto = async (datosObjeto) => {
  validarFechaRecepcion(datosObjeto.fechaRecepcion)

  const objeto = {
    ...datosObjeto,
    estado: 'disponible',
  }

  // La persistencia se implementará cuando se confirme
  // la estructura de PostgreSQL.
  return objeto
}

export { registrarObjeto }