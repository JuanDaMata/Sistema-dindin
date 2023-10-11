const bcrypt = require('bcrypt');
const pool = require('../bancodedados/conexao');

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

const detalharUsuario = async (req, res) => {
    const usuario = req.usuario;

    const { senha, ...usuarioDetalhado } = usuario.rows[0];

    return res.status(200).json(usuarioDetalhado);
};

const atualizarUsuario = async (req, res) => {

    const usuario = req.usuario;
    const { id } = usuario.rows[0];

    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Os campos nome, email e senha são obrigatórios!" });
    }

    try {
        const existeEmail = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1', [email]
        );
        if (existeEmail.rowCount > 0) {
            return res.status(200).json({
                Mensagem: "Este email já está cadastrado em outro usuário. Por favor, cadastre outro email.",
            });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioAtualizado = await pool.query(
            "update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *;",
            [nome, email, senhaCriptografada, id]
        );

        return res.status(200).json(usuarioAtualizado.rows[0]);
    } catch (error) {
        return res.status(500).json({ Mensagem: "Erro ao atualizar dados do usuário." });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario,
}
