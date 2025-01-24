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
    try {
        const result = await pool.query('SELECT * FROM produto');
        res.status(200).json(result.rows.map(({ nome, quantidade, preco_unitario, validade }) => ({ nome, quantidade, preco_unitario, validade }))); // Retorna todos os produtos como JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar os produtos!' });
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

// Iniciar o servidor na porta 8080
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
