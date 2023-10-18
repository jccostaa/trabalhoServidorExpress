const express = require("express");
const bcrypt = require("bcrypt")
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());



app.get('/', (request, response) => {
return response.json('Rodando')});
app.listen(3000, () => console.log("Servidor iniciado"));

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
                const novoUsuario = {
                    id: Math.floor(Math.random()*67676),
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: hash,
                    recados:[]
                }
                usuarios.push(novoUsuario);
                return response.status(200).json({
                  message: "Cadastrado!",
                  id:novoUsuario.id
                });
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
            return response.status(200).json({
              message:`Bem vindo ${usuario.nome}!`,
              id:usuario.id})
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
app.post('/usuarios/:id/recados', (request, response) => {
  const usuarioId = request.body.usuarioId;
  const recado = request.body.recado;
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (!usuario) {
    return response.status(404).json({
      message: `Usuário não encontrado. ID: ${usuarioId}`
    });
  }
  const novoRecado = {
    id: Math.floor(Math.random() * 10000),
    titulo: recado.titulo,
    descricao: recado.descricao
  };
  usuario.recados.push(novoRecado);
  response.status(201).json('Recado criado com sucesso!');
});

// ler recados e paginação
app.get('/usuarios/:id/recados', (request, response) => {
    const usuarioId = parseInt(request.params.id);
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const page = request.query.page || 1;
    const pages = Math.ceil(usuario.recados?.length / 3);
    const indice = (page - 1) * 3;
    const aux = [...usuario.recados];
    const result = aux.splice(indice, 3);
  
    return response.status(201).json(
        { 
          total: usuario.recados.length,
          recados: result, pages 
        }
      );
  });

  //ler um recado especifico
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

  //edição de recado
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
  
  // deletar um recado
  app.delete('/usuarios/:idUsuario/:idRecado', (request, response) => {
    const idUsuario = Number(request.params.idUsuario);
    const idRecado = Number(request.params.idRecado);
    const usuario = usuarios.find((u) => u.id === idUsuario);
    if (!usuario) {
      return response.status(404).json('Usuário não encontrado.');
    }
    const recadosFiltrados = usuario.recados.filter((r) => r.id !== idRecado);
    if (recadosFiltrados.length === usuario.recados.length) {
      return response.status(404).json('Recado não encontrado.');
    }
    usuario.recados = recadosFiltrados;
  
    return response.status(200).json("Recado deletado!");
 });