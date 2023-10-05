const { Router } = require('express');
const transacoes = require('./controladores/transacoes');
const usuarios = require('./controladores/usuarios');
const verificarAutenticacao = require('./intermediarios/autenticacao')

const rotas = Router();

rotas.post('/usuario', usuarios.cadastrarUsuario);

module.exports = rotas