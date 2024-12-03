document.getElementById('cadastroProdutoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco_unitario = document.getElementById('preco_unitario').value;
    const validade = document.getElementById('validade').value;
    const dosagem = document.getElementById('dosagem_numero').value + ' ' + document.getElementById('dosagem_unidade').value;
    const composto_ativo = document.getElementById('composto_ativo').value;
    let radio;

    if (document.getElementById('radio_medicamento').checked) {
        radio = document.getElementById('radio_medicamento').value;
    }
    else if (document.getElementById('radio_produto').checked) {
        radio = document.getElementById('radio_produto').value;
    }

    const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, quantidade, preco_unitario, validade, dosagem, composto_ativo, radio })
    });

    if (response.ok) {
        alert('Produto cadastrado com sucesso!');
        document.getElementById('radio_medicamento').value = "";
        document.getElementById('radio_produto').value = "";
        document.getElementById('nome').value = "";
        document.getElementById('quantidade').value = "";
        document.getElementById('preco_unitario').value = "";
        document.getElementById('validade').value = "";
        document.getElementById('dosagem_numero').value = "";
        document.getElementById('dosagem_unidade').value = "";
        document.getElementById('quantidade').value = "";
    } else {
        alert('Erro ao cadastrar produto!');
    }
});
