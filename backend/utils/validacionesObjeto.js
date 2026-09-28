const validarFechaRecepcion = (fecha) => {
  if (!fecha) {
    const error = new Error('La fecha de recepción es obligatoria')
    error.statusCode = 400
    throw error
  }

  const fechaRecepcion = new Date(`${fecha}T00:00:00`)

  if (Number.isNaN(fechaRecepcion.getTime())) {
    const error = new Error('La fecha de recepción no es válida')
    error.statusCode = 400
    throw error
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  if (fechaRecepcion > hoy) {
    const error = new Error('La fecha de recepción no puede ser futura')
    error.statusCode = 400
    throw error
  }
}

export { validarFechaRecepcion }