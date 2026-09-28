require('dotenv').config();
const express = require("express");
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');
const { globalErrorHandler } = require('./handlers/errorHandler');
const { connectDB } = require('./config/db');

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de CORS
app.use(cors());

// Middleware
app.use(express.json());

// Rutas
app.use('/api/match', matchRoutes);

// Manejo de errores global
app.use(globalErrorHandler);

// Ruta raíz para verificar que el backend está funcionando
app.get("/", (req, res) => {
	res.json({ message: "Backend funcionando" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});