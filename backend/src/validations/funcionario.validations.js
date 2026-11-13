import Joi from "joi";

const passwordTemporalSchema = Joi.object({
  passwordNueva: Joi.string().max(72).required().messages({
    "string.empty": "Escribe la nueva contraseña",
    "string.max": "La contraseña no puede superar los 72 caracteres",
    "any.required": "Escribe la nueva contraseña",
  }),
  confirmarPassword: Joi.string().valid(Joi.ref("passwordNueva")).required().messages({
    "any.only": "Las contraseñas no coinciden",
    "string.empty": "Repite la nueva contraseña",
    "any.required": "Repite la nueva contraseña",
  }),
}).unknown(false);

export function validatePasswordTemporal(input) {
  return passwordTemporalSchema.validate(input, { abortEarly: false });
}
