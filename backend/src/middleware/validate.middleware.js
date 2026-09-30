import { handleErrorClient } from "../handlers/responseHandlers.js";

export const validate = (schema, defaultMessage = "Error de validación en los datos enviados") => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => ({
      campo: issue.path.join(".") || "cuerpo",
      mensaje: issue.message,
    }));

    return handleErrorClient(
      res,
      400,
      defaultMessage,
      errorDetails
    );
  }

  // Asignamos la data ya parseada y sanitizada
  req.body = result.data;
  next();
};
