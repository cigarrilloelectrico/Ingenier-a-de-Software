import { handleErrorClient } from "../handlers/responseHandlers.js";

/**
 * Middleware genérico de validación para esquemas Zod.
 * Intercepta la petición antes de que llegue al controlador.
 * Si algún campo falta o no cumple las reglas, devuelve una respuesta HTTP 400
 * con el listado detallado de errores y detiene la petición.
 *
 * @param {import("zod").ZodSchema} schema - Esquema de Zod contra el cual validar req.body
 * @returns {import("express").RequestHandler}
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => ({
      campo: issue.path.join(".") || "cuerpo",
      mensaje: issue.message,
    }));

    return handleErrorClient(
      res,
      400,
      "Error de validación en los campos del aviso",
      errorDetails
    );
  }

  // Asignamos la data ya parseada y sanitizada (con números convertidos y strings recortados)
  req.body = result.data;
  next();
};
