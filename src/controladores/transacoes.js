const pool = require('../bancodedados/conexao');

const ListarTransacoesUsuarioLogado = async (req, res) => {
    const usuarioLogado = req.usuario.rows[0].id;

    try {
        const transacoesUsuario = await pool.query(
            `SELECT 
             transacoes.*, categorias.descricao AS categoria_nome
             FROM
             transacoes 
             INNER JOIN
             categorias ON transacoes.categoria_id = categorias.id
             WHERE
             usuario_id = $1`,
            [usuarioLogado]
        );

        return res.status(200).json(transacoesUsuario.rows);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const detalharUmaTransacaoUsuarioLogado = async (req, res) => {
    const { id } = req.params;
    const usuarioLogado = req.usuario.rows[0].id;

    try {
        const detalharUmaTransacao = await pool.query(
           `SELECT
            transacoes.*,categorias.descricao AS categoria_nome
            FROM 
            transacoes 
            INNER JOIN 
            categorias ON transacoes.categoria_id = categorias.id
            WHERE
            transacoes.id = $1 and usuario_id = $2;`,
            [id, usuarioLogado]
        );
         
        if (detalharUmaTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        return res.status(200).json(detalharUmaTransacao.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const cadastrarTransacaoUsuarioLogado = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const usuarioLogado = req.usuario.rows[0].id;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
    }

    try {
        const existeCategoria = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (existeCategoria.rowCount === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
             return res.status(400).json({ mensagem: "O tipo deve corresponder a palavra: entrada ou a palavra: saida" });
        }

        const transacaoCadastrada = await pool.query(
            'INSERT INTO transacoes(tipo, descricao, valor, data, categoria_id, usuario_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', 
            [tipo, descricao, valor, data, categoria_id, usuarioLogado]
        );

        transacaoCadastrada.rows[0].categoria_nome = existeCategoria.rows[0].descricao;
        
        return res.status(201).json(transacaoCadastrada.rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno do Servidor" });
    };
};

const atualizarTransacaoUsuarioLogado = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const usuarioLogado = req.usuario.rows[0].id;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
    }

    try {
        const existeTransacaoUsuarioLogado = await pool.query(
            'SELECT * FROM transacoes WHERE id = $1 and usuario_id = $2', 
            [id, usuarioLogado]
        );
        
        if (existeTransacaoUsuarioLogado.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        const existeCategoria = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (existeCategoria.rowCount === 0) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "O tipo deve corresponder a palavra: entrada ou a palavra: saida" })
        }

        const atualizarTransacao = await pool.query(
            'UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6', 
            [descricao, valor, data, categoria_id, tipo, id]
        );

        return res.status(204).json(atualizarTransacao);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const excluirTransacaoUsuarioLogado = async (req, res) => {
    const usuarioLogado = req.usuario.rows[0].id;
    const { id } = req.params;
    
    try {
        const deletarTransacao = await pool.query(
            'DELETE FROM transacoes WHERE usuario_id = $1 and id = $2',
             [usuarioLogado, id]
        );

        if (deletarTransacao.rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." })
        }

        return res.status(204).json(deletarTransacao);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};

const obterExtratoDasTransacoes = async (req, res) => {
    const usuarioLogado = req.usuario.rows[0].id;

    try {
        const entrada = await pool.query(
            'SELECT SUM(valor) FROM transacoes WHERE tipo = $1 and usuario_id = $2',
             ['entrada', usuarioLogado]
        );
        
        let somaEntrada = Number(entrada.rows[0].sum);
        if (entrada.rowCount === 0) {
           somaEntrada = 0;
        }
      
        const saida = await pool.query(
            'SELECT SUM(valor) FROM transacoes WHERE tipo = $1 and usuario_id = $2',
             ['saida', usuarioLogado]
        );
        
        let somaSaida = Number(saida.rows[0].sum);
        if (saida.rowCount === 0) {
           somaSaida = 0;
        }
       
        return res.status(200).json({ entrada: somaEntrada, saida: somaSaida});
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
};

module.exports = {
    ListarTransacoesUsuarioLogado,
    detalharUmaTransacaoUsuarioLogado,
    cadastrarTransacaoUsuarioLogado,
    atualizarTransacaoUsuarioLogado,
    excluirTransacaoUsuarioLogado,
    obterExtratoDasTransacoes
}