const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(8080, () => console.log("Servidor iniciado"));

const usuarios = [];

function emailExistente(request, response, next) {
    const email = request.body.email;
    const usuarioExiste = usuarios.some((usuario) => usuario.email === email);
    if (usuarioExiste) {
      return response.status(400).json('Email já está em uso.' );
    }
    next();
  }
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

app.get("/usuarios", (request, response)=>{
    return response.json(usuarios)
})

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
  
app.get('/usuarios/:id/recados', (request, response) => {
    const usuarioId = parseInt(request.params.id);
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const recados = usuario.recados;
    return response.json(recados);
  });

  app.get('/usuarios/:id/recados/:recadoId', (request, response) => {
    const usuarioId = parseInt(request.params.id);
    const recadoId = parseInt(request.params.recadoId);
    const usuario = usuarios.find((usu) => usu.id === usuarioId);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const recado = usuario.recados.find((rec) => rec.id === recadoId);
    if (!recado) {
      return response.status(404).json('Recado não encontrado.');
    }
    return response.json(recado);
  });

  app.put('/usuarios/:id/recados/:recadoId', (request, response) => {
    const usuarioId = parseInt(request.params.id);
    const recadoId = parseInt(request.params.recadoId);
    const novoRecado = request.body;
    const usuario = usuarios.find((usu) => usu.id === usuarioId);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const recadoIndex = usuario.recados.findIndex((rec) => rec.id === recadoId);
    if (recadoIndex < 0) {
      return response.status(404).json('Recado não encontrado.');
    }
    usuario.recados[recadoIndex] = {
      id: recadoId,
      titulo: novoRecado.titulo,
      descricao: novoRecado.descricao,
    };
    return response.json('Recado editado com sucesso!');
  });
  
app.delete('/usuarios/:idUsuario/:idRecado', (request, response) => {
    const idUsuario = Number(request.params.idUsuario);
    const idRecado = Number(request.params.idRecado);
    const usuario = usuarios.find((u) => u.id === idUsuario);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const recadoIndex = usuario.recados.findIndex((r) => r.id === idRecado);
    if (recadoIndex < 0) {
      return response.status(404).json('Recado não encontrado.');
    }
    usuario.recados.splice(recadoIndex, 1);
  
    return response.status(200).json("Recado deletado!");
  });