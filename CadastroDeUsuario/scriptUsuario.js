async function cadastrarUsuario(e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    try {
        const cpf = document.getElementById('cpf').value;
        const nome = document.getElementById('nome').value;
        const cargo = document.getElementById('cargo').value;
        const senha = document.getElementById('senha').value;

        const cargosValidos = ['gerente', 'operador', 'farmaceutico'];
       
        if (!cpf || !nome || !senha) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        if (!cargosValidos.includes(cargo)) {
            alert('Cargo inválido! Escolha entre: Gerente, Operador de Caixa ou Farmacêutico.');
            return;
        }

        if (cpf.length !== 11) {
            alert('O CPF deve conter exatamente 11 dígitos!');
            return;
        }

        const response = await fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, nome, cargo, senha }),
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
        } else {
            alert('Erro ao cadastrar usuário!');
        }
    } catch (error) {
        alert('Erro inesperado ao cadastrar o usuário. Verifique sua conexão e tente novamente.');
        console.error(error);
    }
}


// Exporta a função para ser usada em outros arquivos
module.exports = { cadastrarUsuario };
