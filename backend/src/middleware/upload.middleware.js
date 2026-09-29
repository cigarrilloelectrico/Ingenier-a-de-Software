import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Carpeta backend/uploads, sin importar desde dónde se ejecute el servidor
export const UPLOADS_DIR = path.join(import.meta.dirname, "../../uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Solo JPG y PNG (RF8, RF9, RF15). La extensión sale del tipo y no del nombre que manda el usuario
const EXTENSIONES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const storage = multer.diskStorage({ // DiskStorage -> Almacenamiento local

  destination: function (req, file, callback) {
    callback(null, UPLOADS_DIR); // callback recibe 2 argumentos: error y carpeta
  },

  filename: function (req, file, callback) {
    // Nombre aleatorio: no se repite y no se puede adivinar la URL de la foto de otro objeto
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
    fileSize: 5 * 1024 * 1024, // 5 Megas (RF8, RF9, RF15)
    files: 5,
  },
  fileFilter: filter, // guardar la función que multer va a ocupar
});

export default uploadMiddleware;
