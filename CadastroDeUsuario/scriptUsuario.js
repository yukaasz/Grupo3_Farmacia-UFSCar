document.getElementById('cadastroUsuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();

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
});
