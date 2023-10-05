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
        const usuarioExiste = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1', [email]
        );
        if (usuarioExiste.rowCount === 0) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)!" })
        }
        if (!await bcrypt.compare(senha, usuarioExiste.rows[0].senha)) {
            return res.status(400).json({ mensagem: "Email e/ou senha inválido(s)." });
        }

        const { senha: senhaCriptografada, ...usuario } = usuarioExiste.rows[0];
        const token = jwt.sign(usuario, chaveSecreta, { expiresIn: "1d" });

        return res.status(200).json({
            usuario,
            token
        });
    } catch (error) {
        return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
};
module.exports = fazerLogin;