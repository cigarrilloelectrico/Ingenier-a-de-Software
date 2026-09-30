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

const validarCaracteristicas = (caracteristicas) => {
  if (!caracteristicas || !caracteristicas.trim()) {
    const error = new Error('Las marcas o señas particulares son obligatorias')
    error.statusCode = 400
    throw error
  }

  const cantidadCaracteres = caracteristicas.trim().length

  if (cantidadCaracteres < 20 || cantidadCaracteres > 500) {
    const error = new Error(
      'Las marcas o señas particulares deben tener entre 20 y 500 caracteres'
    )
    error.statusCode = 400
    throw error
  }
}

const validarCamposObligatorios = (datosObjeto) => {
  const campos = [
    { valor: datosObjeto.tipo, nombre: 'tipo' },
    { valor: datosObjeto.color, nombre: 'color' },
    { valor: datosObjeto.lugarHallazgo, nombre: 'lugar del hallazgo' },
  ]

  for (const campo of campos) {
    if (!campo.valor || !campo.valor.trim()) {
      const error = new Error(`El campo ${campo.nombre} es obligatorio`)
      error.statusCode = 400
      throw error
    }
  }
}

export { validarFechaRecepcion, validarCaracteristicas, validarCamposObligatorios}