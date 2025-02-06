const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 

// Configuração do servidor Express
const app = express();
app.use(express.json());
app.use(cors());  // Habilita CORS para aceitar requisições do frontend

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',  
    host: 'localhost',
    database: 'Farmacia_UFSCar',  
    password: '03042004',  
    port: 5432,
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Conexão bem-sucedida com o banco de dados!');
        client.release();
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
})();

// Rota para cadastrar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { cpf, nome, cargo, senha } = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!cpf || !nome || !cargo || !senha) {
        return res.status(400).json({ error: 'CPF, Nome, Cargo e Senha são obrigatórios!' });
    }

    try {
        // Verificar se o CPF já está registrado
        const checkCpf = await pool.query('SELECT * FROM usuario WHERE cpf = $1', [cpf]);

        if (checkCpf.rows.length > 0) {
            return res.status(400).json({ error: 'CPF já está cadastrado!' });
        }

        // Inserir o novo usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO usuario (cpf, nome, cargo, senha) VALUES ($1, $2, $3, $4) RETURNING *',
            [cpf, nome, cargo, senha]
        );

        const novoUsuario = result.rows[0];
        return res.status(201).json(novoUsuario); // Retorna o novo usuário com status 201
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário!' });
    }
});

// Rota para cadastrar um novo produto
app.post('/produtos', async (req, res) => {
    const { nome, quantidade, preco_unitario, validade, dosagem, composto_ativo, radio } = req.body;

    // Validação de campos obrigatórios
    if (!nome || !preco_unitario || !validade || !quantidade) {
        return res.status(400).json({ error: 'Nome, Preço, Validade e Quantidade são obrigatórios!' });
    }

    if (radio == "medicamento"){
        try {
            // Inserir o produto no banco de dados
            const result = await pool.query(
                'INSERT INTO medicamento (nome, quantidade, preco_unitario, validade, dosagem, composto_ativo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [nome, quantidade, preco_unitario, validade, dosagem, composto_ativo]
            );

            const novoMedicamento = result.rows[0];
            res.status(201).json(novoMedicamento); // Retorna o produto cadastrado
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao cadastrar o medicamento!' });
        }
    }

    else if (radio == "produto"){
        try {
            // Inserir o produto no banco de dados
            const result = await pool.query(
                'INSERT INTO produto (nome, quantidade, preco_unitario, validade) VALUES ($1, $2, $3, $4) RETURNING *',
                [nome, quantidade, preco_unitario, validade]
            );

            const novoProduto = result.rows[0];
            res.status(201).json(novoProduto); // Retorna o produto cadastrado
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao cadastrar o produto!' });
        }
    }

});

// Rota para listar usuários
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario'); 
        res.status(200).json(result.rows.map(({ cpf, nome, cargo }) => ({ cpf, nome, cargo }))); // Retorna todos os usuários como JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários!' });
    }
});


// Rota para listar todos os produtos
app.get('/produtos', async (req, res) => {
    const nomeProduto = req.query.nome; // Pega o nome do produto da query string

    // Busca o produto no banco de dados
    const produto = await db.produtos.findOne({ where: { nome: nomeProduto } });

    if (produto) {
        res.json(produto); // Retorna os detalhes do produto
    } else {
        res.status(404).json({ mensagem: "Produto não encontrado" }); // Retorna erro se não encontrar
    }
});

app.get('/historico', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT h.id_transacao, h.produto, p.nome AS nome_produto, h.quantidade, h.date_hora, h.tipo
            FROM historico h
            JOIN produto p ON h.produto = p.id_produto
            ORDER BY h.date_hora DESC
        `);
        res.status(200).json(result.rows); // Retorna os dados no formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar o histórico!' });
    }
});

// Rota para listar o controle de estoque
app.get('/controleEstoque', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.ID_Produto,
                p.nome,
                p.quantidade
            FROM produto p
            ORDER BY p.id_produto
        `);
        res.status(200).json(result.rows); // Retorna os dados no formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar o controle de estoque!' });
    }
});

// Rota para processar uma venda
// app.post('/vendas', async (req, res) => {
//     const { produto, quantidade } = req.body;

//     if (!produto || !quantidade || quantidade <= 0) {
//         return res.status(400).json({ error: 'Produto e quantidade válidos são obrigatórios!' });
//     }

//     try {
//         // Verifica se o produto existe e tem quantidade suficiente
//         const produtoResult = await pool.query('SELECT * FROM produto WHERE nome = $1', [produto]);

//         if (produtoResult.rows.length === 0) {
//             return res.status(404).json({ error: 'Produto não encontrado!' });
//         }

//         const produtoData = produtoResult.rows[0];
//         if (produtoData.quantidade < quantidade) {
//             return res.status(400).json({ error: 'Quantidade insuficiente no estoque!' });
//         }

//         // Registra a venda
//         const vendaResult = await pool.query(
//             'INSERT INTO venda (produto, quantidade) VALUES ($1, $2) RETURNING *',
//             [produto, quantidade]
//         );

//         res.status(201).json(vendaResult.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Erro ao processar a venda!' });
//     }
// });

// Rota para processar uma venda
app.post('/vendas', async (req, res) => {
    const { produtoId, quantidade } = req.body;
    const quantidadeInt = parseInt(quantidade, 10);


    if (!produtoId || !quantidadeInt || quantidadeInt <= 0) {
        return res.status(400).json({ error: 'Produto ID e quantidade válidos são obrigatórios!' });
    }

    try {
        // Verifica se o produto existe e tem quantidade suficiente
        const produtoResult = await pool.query('SELECT * FROM produto WHERE id_produto = $1', [produtoId]);

        if (produtoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado!' });
        }

        const produtoData = produtoResult.rows[0];
        if (produtoData.quantidadeInt < quantidadeInt) {
            return res.status(400).json({ error: 'Quantidade insuficiente no estoque!' });
        }
        // Registra a venda
        const vendaResult = await pool.query(
            'INSERT INTO venda (produto, quantidade) VALUES ($1, $2) RETURNING *',
            [produtoId, quantidadeInt]
        );

        res.status(201).json(vendaResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar a venda!' });
    }
});


// Rota para listar todos os produtos
app.get('/vendas', async (req, res) => {
    try {
        const result = await pool.query('SELECT p.id_produto, p.nome, p.quantidade, p.preco_unitario, p.validade, m.dosagem, m.composto_ativo FROM medicamento m right join produto p ON m.id_produto = p.id_produto ORDER BY p.nome;');
        res.status(200).json(result.rows); // Retorna todos os produtos como JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar os produtos!' });
    }
});

// Rota para o controle de receita
// app.get('/receitamensal', async (req, res) => {
//     const { mes, ano } = req.query;

//     if (!mes || !ano) {
//         return res.status(400).json({ error: 'Mês e ano são obrigatórios!' });
//     }

//     try {
//         // Consulta para buscar as vendas no mês e ano especificados
//         const result = await pool.query(
//             `SELECT p.id_produto, p.nome AS produto, v.quantidade, v.date_hora, p.preco_unitario
//              FROM venda v
//              JOIN produto p ON v.produto = p.id_produto
//              WHERE EXTRACT(MONTH FROM v.date_hora) = $1 AND EXTRACT(YEAR FROM v.date_hora) = $2`,
//             [mes, ano]
//         );

//         // Calcular o valor total vendido
//         let totalVendido = 0;
//         result.rows.forEach((venda) => {
//             totalVendido += venda.quantidade * venda.preco_unitario;
//         });

//         // Retornar os dados das vendas e o total vendido
//         res.status(200).json({
//             vendas: result.rows,
//             totalVendido: totalVendido.toFixed(2),
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Erro ao buscar as vendas!' });
//     }
// });
app.get('/receitamensal', async (req, res) => {
    const { mes, ano } = req.query;

    if (!mes || !ano) {
        return res.status(400).json({ error: 'Mês e ano são obrigatórios!' });
    }

    try {
        // Consulta para buscar as vendas agrupadas por produto
        const result = await pool.query(
            `SELECT p.id_produto, p.nome AS produto, SUM(v.quantidade) AS total_quantidade, p.preco_unitario
             FROM venda v
             JOIN produto p ON v.produto = p.id_produto
             WHERE EXTRACT(MONTH FROM v.date_hora) = $1 AND EXTRACT(YEAR FROM v.date_hora) = $2
             GROUP BY p.id_produto, p.nome, p.preco_unitario`,
            [mes, ano]
        );

        // Calcular o valor total vendido por produto
        let totalVendido = 0;
        result.rows.forEach((venda) => {
            venda.total_vendido = venda.total_quantidade * venda.preco_unitario;
            totalVendido += venda.total_vendido;
        });

        // Retornar os dados das vendas agrupadas e o total vendido
        res.status(200).json({
            vendas: result.rows,
            totalVendido: totalVendido.toFixed(2),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar as vendas!' });
    }
});


// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
