const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(8080, () => console.log("Servidor iniciado"));

const usuarios = [];

//middleware de verificação de email
function emailExistente(request, response, next) {
    const email = request.body.email;
    const usuarioExiste = usuarios.some((usuario) => usuario.email === email);
    if (usuarioExiste) {
      return response.status(400).json('Email já está em uso.' );
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
                    senha: hash,
                    recados:[]
                })
                return response.status(200).json("Cadastrado!");
            } else {
                return response.status(400).json("Ocorreu um erro:" + err)
            }})
})
// login
app.post("/usuario/login", (request, response)=>{
    const login = request.body;
    const email = login.email;
    const senha = login.senha;

    const usuario = usuarios.find(usuario=> usuario.email===email)
    if(!usuario){return response.status(402).json("Digite um Email válido")}
    bcrypt.compare(senha, usuario.senha, function(err,result){
        if(result){
            return response.status(200).json(`Bem vindo ${usuario.nome}!`)
        } else{
            return response.status(402).json("Senha inválida!")
        }
    })
})

// ler usuarios
app.get("/usuarios", (request, response)=>{
    return response.json(usuarios)
})

//criar recado
app.post('/recados', (request, response) => {
    const usuarioId = request.body.usuarioId;
    const recado = request.body.recado;
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const novoRecado = { 
         id: Math.floor(Math.random() * 10000),
         titulo: recado.titulo, 
         descricao: recado.descricao 
        };
    usuario.recados.push(novoRecado);
    response.status(201).json('Recado criado com sucesso!');
  });
  
