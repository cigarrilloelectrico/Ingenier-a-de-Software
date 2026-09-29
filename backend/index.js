"use strict";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/configDb.js";
import { HOST, PORT } from "./src/config/configEnv.js";
import { routerApi } from "./src/routes/index.routes.js";

const app = express();

const allowedOrigins = ["http://localhost:5173"];
if (process.env.CORS_ORIGIN) allowedOrigins.push(process.env.CORS_ORIGIN);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de UBB Objetos Perdidos!");
});

routerApi(app);

await connectDB();
app.listen(PORT, () => {
  console.log(`Servidor iniciado en ${HOST}:${PORT}`);
});
