const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(3000, () => console.log("Servidor iniciado"));