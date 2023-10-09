const pool = require('../bancodedados/conexao');

const listarCategoriasCadastradas = async (req, res) => {
    try {
        const { rows: categorias } = await pool.query("SELECT * FROM categorias");
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json({ mensagen: "Categoria não encontrada." });
    }
};
module.exports = listarCategoriasCadastradas;   