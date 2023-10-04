const { Router } = require('express');
const transacoes = require('./controladores/transacoes');
const usuarios = require('./controladores/usuarios');
const { verificarAutenticacao } = require('./intermediarios/autenticacao')

const rotas = Router();

rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.fazerLogin);

rotas.use(verificarAutenticacao);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);
rotas.get('/categoria', usuarios.listarCategoriasCadastradas);
rotas.get('/transacao', transacoes.ListarTransacoesUsuarioLogado);
rotas.get('/transacao/:id', transacoes.detalharUmaTransacaoUsuarioLogado);
rotas.post('/transacao', transacoes.cadastrarTransacaoUsuarioLogado);
rotas.put('/transacao/:id', transacoes.atualizarTransacaoUsuarioLogado);
rotas.delete('/transacao/:id', transacoes.excluirTransacaoUsuarioLogado);
rotas.get('/transacao/extrato', transacoes.obterExtratoDasTransacoes);

module.exports = rotas