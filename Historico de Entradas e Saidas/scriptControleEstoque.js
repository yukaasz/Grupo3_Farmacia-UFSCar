async function carregarEstoque() {
    try {
        const resposta = await fetch('http://localhost:8080/controleEstoque');
        if (!resposta.ok) {
            throw new Error('Erro ao buscar o estoque do banco de dados');
        }

        const estoque = await resposta.json();
        const tbody = document.querySelector('#estoqueTable tbody');

        // Preencher os dados na tabela
        estoque.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id_produto}</td>
                <td>${item.nome || 'Produto Removido'}</td>
                <td>${item.quantidade}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar o controle de estoque:', erro);
        alert('Erro ao carregar o controle de estoque. Por favor, tente novamente mais tarde.');
    }
}

// Carrega o histórico ao abrir a página
carregarEstoque();

module.exports = { carregarEstoque };