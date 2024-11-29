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
    database: 'Farmacia_UFSCar',  // Substitua pelo nome do seu banco de dados
    password: '03042004',  // Substitua pela sua senha
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

// Rota para listar usuários
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario'); // Ajuste se sua tabela for "usuarios"
        res.status(200).json(result.rows.map(({ cpf, nome, cargo }) => ({ cpf, nome, cargo }))); // Retorna todos os usuários como JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários!' });
    }
});

// Iniciar o servidor na porta 3000
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
