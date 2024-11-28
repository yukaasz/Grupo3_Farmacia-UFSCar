const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Configuração do servidor Express
const app = express();
app.use(express.json());
app.use(cors());  // Habilita CORS para aceitar requisições do frontend

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',  // Substitua pelo seu usuário do banco
    host: 'localhost',
    database: 'Farmacia_UFSCAR',  // Substitua pelo nome do seu banco de dados
    password: '03042004',  // Substitua pela sua senha
    port: 5432,
});

// Rota para cadastrar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { cpf, nome, cargo, senha } = req.body;

    // Verificar se os campos obrigatórios estão presentes
    if (!cpf || !nome || !cargo || !senha) {
        return res.status(400).json({ error: 'CPF, Nome, Cargo e Senha são obrigatórios!' });
    }

    try {
        // Verificar se o CPF já está registrado
        const checkCpf = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);

        if (checkCpf.rows.length > 0) {
            return res.status(400).json({ error: 'CPF já está cadastrado!' });
        }

        // Inserir o novo usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO usuarios (cpf, nome, cargo, senha) VALUES ($1, $2, $3, $4) RETURNING *',
            [cpf, nome, cargo, senha]
        );

        const novoUsuario = result.rows[0];
        return res.status(201).json(novoUsuario); // Retorna o novo usuário com status 201
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário!' });
    }
});

// Iniciar o servidor na porta 3000
app.listen(8080, () => {
    console.log('Servidor rodando na porta 3000');
});
