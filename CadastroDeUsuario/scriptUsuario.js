
/*
document.getElementById('cadastroUsuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {

        const cpf = document.getElementById('cpf').value;
        const nome = document.getElementById('nome').value;
        const cargo = document.getElementById('cargo').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf, nome, cargo, senha })
        });

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
        } else {
            alert('Erro ao cadastrar usuário!');
        }
    }
    catch (error) {
        alert('Erro inesperado ao cadastrar o usuário. Verifique sua conexão e tente novamente.');
    }

    console.log('EventListener registrado para o formulário de cadastro.');
});

*/

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('EventListener registrado para o formulário de cadastro.');

//     const form = document.getElementById('cadastroUsuarioForm');
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         // Obtém os valores dos campos do formulário
//         const cpf = document.getElementById('cpf').value;
//         const nome = document.getElementById('nome').value;
//         const cargo = document.getElementById('cargo').value;
//         const senha = document.getElementById('senha').value;

//         // Valida se todos os campos estão preenchidos
//         if (!cpf || !nome || !cargo || !senha) {
//             alert('Todos os campos devem ser preenchidos!');
//             return;
//         }

//         try {
//             // Envia a requisição ao servidor
//             const response = await fetch('http://localhost:8080/usuarios', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ cpf, nome, cargo, senha }),
//             });

//             // Verifica a resposta do servidor
//             if (response && response.ok) {
//                 alert('Usuário cadastrado com sucesso!');
//             } else {
//                 alert('Erro ao cadastrar usuário!');
//             }
//         } catch (error) {
//             // Captura erros de rede ou de processamento
//             console.error('Erro na requisição:', error);
//             alert('Erro ao cadastrar usuário! Verifique sua conexão.');
//         }
//     });
// });


document.getElementById('cadastroUsuarioForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão

    const form = event.target; // Captura o formulário corretamente
    try {
        const response = await fetch('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cpf: form.cpf.value,
                nome: form.nome.value,
                cargo: form.cargo.value,
                senha: form.senha.value,
            }),
        });

        if (response && response.ok) {
            alert('Usuário cadastrado com sucesso!');
        } else {
            alert('Erro ao cadastrar usuário!');
        }
    } catch (error) {
        alert('Erro ao cadastrar usuário! Verifique sua conexão.');
    }
});
