async function buscarVendas() {
    const mes = document.getElementById('mes').value;
    const ano = document.getElementById('ano').value;

    if (!mes || !ano) {
        alert('Por favor, selecione um mês e um ano.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/receitamensal?mes=${mes}&ano=${ano}`);
        const data = await response.json();

        if (response.ok) {
            atualizarTabela(data.vendas);
            document.getElementById('totalVendido').textContent = data.totalVendido;
        } else {
            alert('Erro ao buscar as vendas: ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar ao servidor.');
    }
}

function atualizarTabela(vendas) {
    const tbody = document.querySelector('#vendasTable tbody');
    tbody.innerHTML = ''; // Limpa a tabela

    vendas.forEach((venda) => {
        const row = document.createElement('tr');

        const idCell = document.createElement('td');
        idCell.textContent = venda.id_produto;
        row.appendChild(idCell);

        const produtoCell = document.createElement('td');
        produtoCell.textContent = venda.produto;
        row.appendChild(produtoCell);

        const quantidadeCell = document.createElement('td');
        quantidadeCell.textContent = venda.total_quantidade; // Exibe a quantidade total vendida
        row.appendChild(quantidadeCell);

        const precoCell = document.createElement('td');
        const precoFloat = parseFloat(venda.preco_unitario);
        precoCell.textContent = `R$ ${precoFloat.toFixed(2)}`; // Exibe o preço unitário
        row.appendChild(precoCell);

        const totalCell = document.createElement('td');
        const totalFloat = parseFloat(venda.total_vendido);
        totalCell.textContent = `R$ ${totalFloat.toFixed(2)}`; // Exibe o total vendido por produto
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });
}
