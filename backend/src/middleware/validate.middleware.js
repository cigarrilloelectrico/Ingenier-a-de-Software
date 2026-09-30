import { handleErrorClient } from "../handlers/responseHandlers.js";

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
