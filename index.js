const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(8080, () => console.log("Servidor iniciado"));

const usuarios = [];
const recados = [];

//middleware de verificação de email
function emailExistente(req, res, next) {
    const email = req.body.email;
    const userExists = usuarios.some((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }
    next();
  }

// criar usuario
app.post("/usuarios", emailExistente ,(request, response)=>{
    const usuario = request.body;
    const saltRounds = 10;
    
        bcrypt.hash(usuario.senha, saltRounds, function(err, hash) {
            if(hash){
                usuarios.push({
                    id: Math.floor(Math.random()*67676),
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: hash
                })
                return response.status(200).json("Cadastrado!");
            } else {
                return response.status(400).json("Ocorreu um erro:" + err)
            }})
})
// login
app.post("/usuario/login", (request, response)=>{
    const login = request.body;
    const id = login.id;
    const senha = login.senha;

    const usuario = usuarios.find(usuario=> usuario.id===id)
    if(!usuario){return response.status(402).json("Digite um ID válido")}
    bcrypt.compare(senha, usuario.senha, function(err,result){
        if(result){
            return response.status(200).json(`Bem vindo ${usuario}!`)
        } else{
            return response.status(402).json("Usuário inválido!")
        }
    })
})

// ler usuarios
app.get("/usuarios", (request, response)=>{
    return response.json(usuarios)
})