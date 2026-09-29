"use strict";
import Joi from "joi";

/**
 * @brief Esquema de validación para el filtro del listado de recintos.
 */
export const recintoQueryValidation = Joi.object({
  estado: Joi.string().valid("Activo", "Inactivo").messages({
    "any.only": `El estado debe ser uno de: Activo, Inactivo`,
  }),
}).messages({
  "object.unknown": `El filtro {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para crear un recinto (RF33).
 *        La latitud y la longitud ubican el recinto en el mapa y se usan en el cruce de coincidencias (RF20).
 */
export const recintoBodyValidation = Joi.object({
  nombre: Joi.string().trim().min(3).max(80).required().messages({
    "string.base": `El campo nombre debe ser un texto`,
    "string.min": `El nombre debe tener al menos 3 caracteres`,
    "string.max": `El nombre no puede superar los 80 caracteres`,
    "string.empty": `El campo nombre no puede estar vacío`,
    "any.required": `El campo nombre es obligatorio`,
  }),
  latitud: Joi.number().min(-90).max(90).required().messages({
    "number.base": `El campo latitud debe ser un número`,
    "number.min": `La latitud debe estar entre -90 y 90`,
    "number.max": `La latitud debe estar entre -90 y 90`,
    "any.required": `El campo latitud es obligatorio`,
  }),
  longitud: Joi.number().min(-180).max(180).required().messages({
    "number.base": `El campo longitud debe ser un número`,
    "number.min": `La longitud debe estar entre -180 y 180`,
    "number.max": `La longitud debe estar entre -180 y 180`,
    "any.required": `El campo longitud es obligatorio`,
  }),
  horarioAtencion: Joi.string().trim().max(150).required().messages({
    "string.base": `El campo horarioAtencion debe ser un texto`,
    "string.max": `El horario de atención no puede superar los 150 caracteres`,
    "string.empty": `El campo horarioAtencion no puede estar vacío`,
    "any.required": `El campo horarioAtencion es obligatorio`,
  }),
}).messages({
  "object.unknown": `El campo {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para editar un recinto (RF34).
 *        Los mismos campos de la creación, pero todos opcionales; debe venir al menos uno.
 */
export const recintoUpdateValidation = recintoBodyValidation
  .fork(["nombre", "latitud", "longitud", "horarioAtencion"], (campo) => campo.optional())
  .min(1)
  .messages({
    "object.min": `Debes enviar al menos un campo para actualizar`,
  });

export function validateRecintoQuery(input) {
  return recintoQueryValidation.validate(input, { abortEarly: false });
}

export function validateRecintoBody(input) {
  return recintoBodyValidation.validate(input, { abortEarly: false });
}

export function validateRecintoUpdate(input) {
  return recintoUpdateValidation.validate(input, { abortEarly: false });
}
