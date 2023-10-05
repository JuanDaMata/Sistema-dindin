const jwt = require('jsonwebtoken');
const chaveSecreta = require('../chaveSecreta');
const bcrypt = require('bcrypt');
const pool = require('../bancodedados/conexao');

const fazerLogin = async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Os campos email e senha são obrigatórios!" });
    }
    try {

    } catch (error) {

    }
};
module.exports = fazerLogin;