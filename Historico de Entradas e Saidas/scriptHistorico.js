async function carregarHistorico() {
    try {
        const resposta = await fetch('http://localhost:8080/historico');
        if (!resposta.ok) {
            throw new Error('Erro ao buscar o histórico do banco de dados');
        }

        const historico = await resposta.json();
        const tbody = document.querySelector('#historicoTable tbody');

        // Preencher os dados na tabela
        historico.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id_transacao}</td>
                <td>${item.nome_produto || 'Produto Removido'}</td>
                <td>${item.quantidade}</td>
                <td>${new Date(item.date_hora).toLocaleString()}</td>
                <td>${item.tipo}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (erro) {
        console.error('Erro ao carregar o histórico:', erro);
        alert('Erro ao carregar o histórico. Por favor, tente novamente mais tarde.');
    }
}

// Carrega o histórico ao abrir a página
carregarHistorico();

module.exports = { carregarHistorico };