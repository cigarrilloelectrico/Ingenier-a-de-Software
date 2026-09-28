const validarIdObjeto = (req, res, next) => {
  const { id } = req.params;

  // Validar que el ID exista y sea un número válido
  const idNumerico = Number(id);

  if (!id || isNaN(idNumerico) || !Number.isInteger(idNumerico)) {
    return res.status(400).json({
      success: false,
      message: "Error de validación: El ID del objeto debe ser un número entero válido."
    });
  }

  if (idNumerico <= 0) {
    return res.status(400).json({
      success: false,
      message: "Error de validación: El ID del objeto debe ser mayor a cero."
    });
  }

  next();
};

module.exports = { validarIdObjeto };