import Joi from "joi";

/**
 * @brief Valida el dígito verificador de un rut chileno con módulo 11.
 *        Acepta el rut con o sin puntos y lo devuelve normalizado sin puntos: 12345678-9.
 *        Quita los ceros a la izquierda para que 01234567-4 y 1234567-4 no pasen como dos ruts distintos.
 */
function validarRut(valor, helpers) {
  const rut = valor.replace(/\./g, "").toUpperCase().replace(/^0+/, "");
  if (!/^\d{7,8}-[\dK]$/.test(rut)) return helpers.error("rut.formato");

  const [cuerpo, digitoVerificador] = rut.split("-");

  //Multiplicar cada dígito, de derecha a izquierda, por la serie 2, 3, 4, 5, 6, 7, 2, 3...
  let suma = 0;
  let multiplicador = 2;
  for (let posicion = cuerpo.length - 1; posicion >= 0; posicion--) {
    suma += Number(cuerpo[posicion]) * multiplicador;
    multiplicador++;
    if (multiplicador > 7) multiplicador = 2;
  }

  const resto = 11 - (suma % 11);
  let digitoEsperado = String(resto);
  if (resto === 11) digitoEsperado = "0";
  if (resto === 10) digitoEsperado = "K";

  if (digitoVerificador !== digitoEsperado) return helpers.error("rut.digitoVerificador");
  return rut;
}

/**
 * @brief Esquema de validación para crear la cuenta de un funcionario (RF35).
 *        La contraseña no viene en el formulario: el sistema la genera y la envía al correo.
 */
export const funcionarioBodyValidation = Joi.object({
  rut: Joi.string().trim().custom(validarRut).required().messages({
    "string.base": `El campo rut debe ser un texto`,
    "string.empty": `El campo rut no puede estar vacío`,
    "rut.formato": `El rut debe tener el formato 12345678-9`,
    "rut.digitoVerificador": `El dígito verificador del rut no es válido`,
    "any.required": `El campo rut es obligatorio`,
  }),
  nombre: Joi.string().trim().min(2).max(60).pattern(/^[\p{L}\s'-]+$/u).required().messages({
    "string.base": `El campo nombre debe ser un texto`,
    "string.min": `El nombre debe tener al menos 2 caracteres`,
    "string.max": `El nombre no puede superar los 60 caracteres`,
    "string.pattern.base": `El nombre solo puede contener letras, espacios, guiones y apóstrofes`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "any.required": `El campo nombre es obligatorio`,
  }),
  apellidos: Joi.string().trim().min(2).max(60).pattern(/^[\p{L}\s'-]+$/u).required().messages({
    "string.base": `El campo apellidos debe ser un texto`,
    "string.min": `Los apellidos deben tener al menos 2 caracteres`,
    "string.max": `Los apellidos no pueden superar los 60 caracteres`,
    "string.pattern.base": `Los apellidos solo pueden contener letras, espacios, guiones y apóstrofes`,
    "string.empty": `El campo apellidos no puede estar vacío`,
    "any.required": `El campo apellidos es obligatorio`,
  }),
  // TEMPORAL para pruebas: acepta cualquier correo. Para volver a exigir el institucional, agregar .pattern(/@ubiobio\.cl$/)
  correo: Joi.string().trim().lowercase().max(254).email().required().messages({
    "string.base": `El campo correo debe ser un texto`,
    "string.max": `El correo no puede superar los 254 caracteres`,
    "string.email": `El formato del correo no es válido`,
    "string.empty": `El campo correo no puede estar vacío`,
    "any.required": `El campo correo es obligatorio`,
  }),
  recintoId: Joi.number().integer().positive().required().messages({
    "number.base": `El recinto elegido no es válido`,
    "number.integer": `El recinto elegido no es válido`,
    "number.positive": `El recinto elegido no es válido`,
    "any.required": `Debes elegir un recinto`,
  }),
}).messages({
  "object.unknown": `El campo {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para los filtros del padrón de funcionarios (RF38).
 */
export const funcionarioQueryValidation = Joi.object({
  recintoId: Joi.number().integer().positive().messages({
    "number.base": `El filtro recintoId debe ser un número`,
    "number.integer": `El filtro recintoId debe ser un número entero`,
    "number.positive": `El filtro recintoId debe ser positivo`,
  }),
  estado: Joi.string().valid("Activo", "Desactivado").messages({
    "any.only": `El estado debe ser uno de: Activo, Desactivado`,
  }),
}).messages({
  "object.unknown": `El filtro {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para cambiar el recinto de un funcionario (RF36).
 */
export const funcionarioRecintoValidation = Joi.object({
  recintoId: Joi.number().integer().positive().required().messages({
    "number.base": `El recinto elegido no es válido`,
    "number.integer": `El recinto elegido no es válido`,
    "number.positive": `El recinto elegido no es válido`,
    "any.required": `Debes elegir un recinto`,
  }),
}).messages({
  "object.unknown": `El campo {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para reemplazar la contraseña temporal en el primer ingreso (RF35).
 *        Las condiciones de la contraseña se revisan en el servicio con verificarPoliticaPassword.
 */
export const passwordTemporalValidation = Joi.object({
  passwordNueva: Joi.string().max(72).required().messages({
    "string.base": `La nueva contraseña debe ser un texto`,
    "string.max": `La contraseña no puede superar los 72 caracteres`,
    "string.empty": `Escribe la nueva contraseña`,
    "any.required": `Escribe la nueva contraseña`,
  }),
  confirmarPassword: Joi.string().valid(Joi.ref("passwordNueva")).required().messages({
    "string.base": `La confirmación debe ser un texto`,
    "any.only": `Las contraseñas no coinciden`,
    "string.empty": `Repite la nueva contraseña`,
    "any.required": `Repite la nueva contraseña`,
  }),
}).messages({
  "object.unknown": `El campo {#label} no está permitido`,
});

export function validateFuncionarioBody(input) {
  return funcionarioBodyValidation.validate(input, { abortEarly: false });
}

export function validateFuncionarioQuery(input) {
  return funcionarioQueryValidation.validate(input, { abortEarly: false });
}

export function validateFuncionarioRecinto(input) {
  return funcionarioRecintoValidation.validate(input, { abortEarly: false });
}

export function validatePasswordTemporal(input) {
  return passwordTemporalValidation.validate(input, { abortEarly: false });
}
