const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (request, response) => {
	response.json({ message: "Backend funcionando" });
});

app.listen(port, () => {
	console.log(`Backend ejecutandose en http://localhost:${port}`);
});
