import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { handleErrorClient } from "../handlers/responseHandlers.js";

export const UPLOADS_DIR = path.join(import.meta.dirname, "../../uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const EXTENSIONES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const storage = multer.diskStorage({

  destination: function (req, file, callback) {
    callback(null, UPLOADS_DIR);
  },

  filename: function (req, file, callback) {
    callback(null, randomUUID() + EXTENSIONES[file.mimetype]);
  },
});

const filter = (req, file, callback) => {
  if (EXTENSIONES[file.mimetype]) {
    return callback(null, true);
  }
  callback(new Error("Formato no válido. Solo se permiten imágenes JPG o PNG"), false);
};

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: filter,
});

export default uploadMiddleware;

const ERRORES_MULTER = {
  LIMIT_FILE_SIZE: "Cada foto puede pesar como máximo 5 MB",
  LIMIT_FILE_COUNT: "Puedes subir como máximo 5 fotos",
  LIMIT_UNEXPECTED_FILE: "Puedes subir como máximo 5 fotos en el campo fotos",
};

export function subirFotos(req, res, next) {
  uploadMiddleware.array("fotos", 5)(req, res, (error) => {
    if (!error) return next();
    handleErrorClient(res, 400, ERRORES_MULTER[error.code] || error.message);
  });
}

export function subirFotoAviso(req, res, next) {
  uploadMiddleware.single("fotografia")(req, res, (error) => {
    if (!error) return next();
    handleErrorClient(res, 400, ERRORES_MULTER[error.code] || error.message);
  });
}
