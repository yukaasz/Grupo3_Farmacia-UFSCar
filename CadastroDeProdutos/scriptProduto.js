async function cadastrarProduto(e) {
    e.preventDefault();

    try {
        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco_unitario = document.getElementById('preco_unitario').value;
        const validade = document.getElementById('validade').value;
        const dosagem = document.getElementById('dosagem_numero').value + ' ' + document.getElementById('dosagem_unidade').value;
        const composto_ativo = document.getElementById('composto_ativo').value;
        let radio;

        if (document.getElementById('radio_medicamento').checked) {
            radio = document.getElementById('radio_medicamento').value;
        } else if (document.getElementById('radio_produto').checked) {
            radio = document.getElementById('radio_produto').value;
        }

        // Montagem do corpo da requisição
        const produto = { nome, quantidade, preco_unitario, validade, dosagem, composto_ativo, radio };

        // Envio da requisição POST
        const response = await fetch('http://localhost:8080/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        // Manipulação da resposta
        if (response && response.ok) {
            // Limpar os campos
            document.getElementById('nome').value = "";
            document.getElementById('quantidade').value = "";
            document.getElementById('preco_unitario').value = "";
            document.getElementById('validade').value = "";
            document.getElementById('dosagem_numero').value = "";
            document.getElementById('dosagem_unidade').value = "";
            document.getElementById('composto_ativo').value = "";
            document.getElementById('radio_medicamento').checked = false;
            document.getElementById('radio_produto').checked = false;
            
            alert('Produto cadastrado com sucesso!');
        } else {
            alert('Erro ao cadastrar produto!');
        }
    } catch (erro) {
        alert('Erro inesperado ao cadastrar o produto. Por favor, tente novamente mais tarde.');
        console.error(erro);
    }
}

// Exporta a função para ser usada em outros arquivos
module.exports = { cadastrarProduto };
