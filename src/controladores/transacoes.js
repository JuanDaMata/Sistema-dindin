const bcrypt = require('bcrypt');
const conexao = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const chaveSecreta = require('../chaveSecreta');
const { format } = require('date-fns');

const ListarTransacoesUsuarioLogado = () => {};

const detalharUmaTransacaoUsuarioLogado = () => {};

const cadastrarTransacaoUsuarioLogado = () => {};

const atualizarTransacaoUsuarioLogado = () => {};

const excluirTransacaoUsuarioLogado = () => {};

const obterExtratoDasTransacoes = () => {};

module.exports = {
    ListarTransacoesUsuarioLogado,
    detalharUmaTransacaoUsuarioLogado,
    cadastrarTransacaoUsuarioLogado,
    atualizarTransacaoUsuarioLogado,
    excluirTransacaoUsuarioLogado,
    obterExtratoDasTransacoes
}