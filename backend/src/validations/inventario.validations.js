"use strict";
import Joi from "joi";

const idValidation = (campo) =>
  Joi.number().integer().positive().messages({
    "number.base": `El campo ${campo} debe ser un número`,
    "number.integer": `El campo ${campo} debe ser un entero`,
    "number.positive": `El campo ${campo} debe ser un número positivo`,
    "any.required": `El campo ${campo} es obligatorio`,
  });

/**
 * @brief Esquema de validación para los filtros del inventario (RF16).
 *        Todos los filtros son opcionales. Joi convierte los textos de req.query a números y fechas.
 */
export const inventarioQueryValidation = Joi.object({
  pagina: Joi.number().integer().min(1).messages({
    "number.base": `El campo pagina debe ser un número`,
    "number.min": `El campo pagina debe ser 1 o mayor`,
  }),
  recintoId: idValidation("recintoId"),
  tipoObjetoId: idValidation("tipoObjetoId"),
  estado: Joi.string().valid("Disponible", "Reservado", "Entregado").messages({
    "any.only": `El estado debe ser uno de: Disponible, Reservado, Entregado`,
  }),
  fechaDesde: Joi.date().iso().messages({
    "date.base": `El campo fechaDesde debe ser una fecha válida`,
    "date.format": `El campo fechaDesde debe tener formato ISO (YYYY-MM-DD)`,
  }),
  fechaHasta: Joi.date().iso().min(Joi.ref("fechaDesde")).messages({
    "date.base": `El campo fechaHasta debe ser una fecha válida`,
    "date.format": `El campo fechaHasta debe tener formato ISO (YYYY-MM-DD)`,
    "date.min": `La fecha hasta no puede ser anterior a la fecha desde`,
  }),
}).messages({
  "object.unknown": `El filtro {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para registrar un objeto encontrado (RF15).
 *        Las fotos no se validan aquí: llegan en req.files y las revisa multer.
 */
export const objetoBodyValidation = Joi.object({
  tipoObjetoId: idValidation("tipoObjetoId").required(),
  recintoHallazgoId: idValidation("recintoHallazgoId").required(),
  color: Joi.string().trim().max(40).required().messages({
    "string.base": `El campo color debe ser un texto`,
    "string.max": `El campo color no puede superar los 40 caracteres`,
    "string.empty": `El campo color no puede estar vacío`,
    "any.required": `El campo color es obligatorio`,
  }),
  descripcion: Joi.string().trim().min(20).max(500).required().messages({
    "string.base": `El campo descripcion debe ser un texto`,
    "string.min": `La descripción debe tener al menos 20 caracteres`,
    "string.max": `La descripción no puede superar los 500 caracteres`,
    "string.empty": `El campo descripcion no puede estar vacío`,
    "any.required": `El campo descripcion es obligatorio`,
  }),
  fechaRecepcion: Joi.date().iso().required().messages({
    "date.base": `El campo fechaRecepcion debe ser una fecha válida`,
    "date.format": `El campo fechaRecepcion debe tener formato ISO (YYYY-MM-DD)`,
    "any.required": `El campo fechaRecepcion es obligatorio`,
  }),
  entregadoPor: Joi.string().trim().max(120).messages({
    "string.base": `El campo entregadoPor debe ser un texto`,
    "string.max": `El campo entregadoPor no puede superar los 120 caracteres`,
  }),
}).messages({
  "object.unknown": `El campo {#label} no está permitido`,
});

/**
 * @brief Esquema de validación para corregir un objeto del inventario.
 *        Los mismos campos del registro, pero todos opcionales; debe venir al menos uno.
 */
export const objetoUpdateValidation = objetoBodyValidation
  .fork(["tipoObjetoId", "recintoHallazgoId", "color", "descripcion", "fechaRecepcion"], (campo) => campo.optional())
  .min(1)
  .messages({
    "object.min": `Debes enviar al menos un campo para actualizar`,
  });

export function validateInventarioQuery(input) {
  return inventarioQueryValidation.validate(input, { abortEarly: false });
}

export function validateObjetoBody(input) {
  return objetoBodyValidation.validate(input, { abortEarly: false });
}

export function validateObjetoUpdate(input) {
  return objetoUpdateValidation.validate(input, { abortEarly: false });
}
