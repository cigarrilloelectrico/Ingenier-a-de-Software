const crearObjeto = (datosObjeto) => {
  return {
    tipo: datosObjeto.tipo,
    color: datosObjeto.color,
    caracteristicas: datosObjeto.caracteristicas,
    lugarHallazgo: datosObjeto.lugarHallazgo,
    fechaRecepcion: datosObjeto.fechaRecepcion,
    imagen: datosObjeto.imagen,
    estado: 'disponible',
  }
}

export { crearObjeto }