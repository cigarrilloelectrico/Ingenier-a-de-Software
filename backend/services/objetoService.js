import {
  validarFechaRecepcion,
  validarCaracteristicas,
  validarCamposObligatorios,
} from '../utils/validacionesObjeto.js'

import { crearObjeto } from '../models/objetoModel.js'

const registrarObjeto = async (datosObjeto) => {
  validarFechaRecepcion(datosObjeto.fechaRecepcion)
  validarCaracteristicas(datosObjeto.caracteristicas)
  validarCamposObligatorios(datosObjeto)
  const objeto = crearObjeto(datosObjeto)

  // La persistencia en PostgreSQL queda pendiente
  // hasta conocer la estructura real de la base de datos.
  return objeto
}

export { registrarObjeto }