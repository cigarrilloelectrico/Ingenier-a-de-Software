require('dotenv').config();
const express = require("express");
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

app.use(cors()); 
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.use('/api/match', matchRoutes);

app.get("/", (req, res) => {
	res.json({ message: "Backend funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});