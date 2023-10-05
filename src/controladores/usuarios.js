const bcrypt = require('bcrypt');
const pool = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const chaveSecreta = require('../chaveSecreta');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios!" });
    }

    try {
        const existeEmail = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1', [email]
        );

        if (existeEmail.rowCount > 0) {
            return res.status(400).json({ mensagem: "Email já cadastrado! Por favor inserir um outro email!" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioCadastrado = await pool.query(
            'INSERT INTO usuarios(nome, email, senha) VALUES ($1, $2, $3) RETURNING *', [nome, email, senhaCriptografada]
        );

        const { senha: senhaUsuario, ...usuarioCriado } =
            usuarioCadastrado.rows[0];

        return res.status(201).json(usuarioCriado);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};


const fazerLogin = () => { };

const detalharUsuario = () => { };

const atualizarUsuario = () => { };

const listarCategoriasCadastradas = () => { };

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    atualizarUsuario,
    listarCategoriasCadastradas
}
