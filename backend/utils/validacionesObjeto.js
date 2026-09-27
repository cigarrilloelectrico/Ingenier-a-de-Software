const esFechaFutura = (fecha) => {
  const fechaRecepcion = new Date(`${fecha}T00:00:00`)
  const hoy = new Date()

  hoy.setHours(0, 0, 0, 0)

  return fechaRecepcion > hoy
}

export { esFechaFutura }