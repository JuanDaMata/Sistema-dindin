const jwt = require('jsonwebtoken');
const chaveSecreta = require('../chaveSecreta');
const pool = require('../bancodedados/conexao')

const verificarAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            Mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado."
        });
    }
    const token = authorization.split(" ")[1];
    try {
        const tokenDescripto = jwt.verify(token, chaveSecreta);
        const { id } = tokenDescripto;

        const usuarioLogado = await pool.query(
            "select * from usuarios where id = $1",
            [id]
        );
        if (usuarioLogado.rowCount === 0) {
            return res.status(400).json({
                Mensagem: "Usuário não existe.",
            });
        }

        req.usuario = usuarioLogado;
        next();
    } catch (error) {
        return res.status(401).json({ Mensagem: "Token inválido ou expirado." });
    }
};

module.exports = verificarAutenticacao;
