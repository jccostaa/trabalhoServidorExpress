const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(3000, () => console.log("Servidor iniciado"));

const usuarios = [];
const recados = [];


// criar usuario
app.post("/usuarios", (request, response)=>{
    const usuario = request.body;
    const saltRounds = 10;
    
    bcrypt.hash(usuario.senha, saltRounds, function(err, hash) {
        if(hash){
            usuarios.push({
                id: Math.floor(Math.random()*67676),
                nome: usuario.nome,
                email: usuario.email,
                senha: hash
            }); 
            return response.status(204).json();
        } else {
            return response.status(400).json("Ocorreu um erro:" + err)
        }
    });
})

// ler usuarios
app.get("/usuarios", (request, response)=>{
    
})