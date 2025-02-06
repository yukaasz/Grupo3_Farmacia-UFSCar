function formatarData(data) {
    if (!data) return 'N/A'; // Se a data for nula ou indefinida, retorna 'N/A'
    const date = new Date(data); // Converte para objeto Date (caso não seja)
    return date.toLocaleDateString('pt-BR'); // Formata para o padrão brasileiro (dd/mm/aaaa)
}

// Função para carregar os produtos do banco de dados
async function carregarProdutos() {
    try {
        // Faz uma requisição GET para a rota /produtos
        const resposta = await fetch('http://localhost:8080/vendas');
        if (!resposta.ok) {
            throw new Error('Erro ao carregar os produtos');
        }

        // Converte a resposta para JSON
        const produtos = await resposta.json();

        // Seleciona o elemento <select> do formulário
        const selectProduto = document.getElementById('produto');

        // Limpa o conteúdo atual do <select>
        selectProduto.innerHTML = '';

        // Adiciona uma opção padrão
        const optionPadrao = document.createElement('option');
        optionPadrao.value = '';
        optionPadrao.textContent = 'Selecione um produto';
        selectProduto.appendChild(optionPadrao);

        // Adiciona cada produto como uma opção no <select>
        produtos.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id_produto; // Valor do produto (ID)
            option.textContent = `Id:${produto.id_produto} - ${produto.nome || 'N/A'} - ${produto.dosagem || 'N/A'} - R$ ${(produto.preco_unitario || 0)} - Qtd: ${produto.quantidade || 0} - Val: ${formatarData(produto.validade)}`;
            selectProduto.appendChild(option);
        });
    } catch (erro) {
        console.error('Erro ao carregar os produtos:', erro);
        document.getElementById('mensagem').textContent = 'Erro ao carregar os produtos. Tente novamente mais tarde.';
    }
}


async function realizarVenda(e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    try {
        const selectProduto = document.getElementById("produto");
        const produtoId = selectProduto.value.split(" - ")[0]; // Obtém apenas o ID do produto
        const quantidade = document.getElementById("quantidade").value;

        if (!produtoId) {
            alert("Por favor, selecione um produto!");
            return;
        }

        // Agora, processa a venda com o ID do produto diretamente
        const response = await fetch("http://localhost:8080/vendas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ produtoId, quantidade }),
        });
    
        if (response.ok) {
            alert("Venda registrada com sucesso!");
        } else {
            alert("Erro ao registrar a venda!");
        }
    } catch (error) {
        alert("Erro inesperado ao registrar a venda. Verifique sua conexão e tente novamente.");
        console.error(error);
    }
}

if (typeof window !== "undefined") {
    window.onload = carregarProdutos;
}
// Exporta a função para ser usada em outros arquivos
module.exports = { realizarVenda, carregarProdutos };   