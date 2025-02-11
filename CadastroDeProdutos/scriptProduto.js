function atualizarCampos() { 
    const isMedicamento = document.getElementById('radio_medicamento').checked;

    document.getElementById('composto_ativo').disabled = !isMedicamento;
    document.getElementById('dosagem_numero').disabled = !isMedicamento;
    document.getElementById('dosagem_unidade').disabled = !isMedicamento;

    if (isMedicamento){
        document.getElementById('dosagem_numero').placeholder = 'Ex: 200';
        document.getElementById('opt_selecione').style.visibility = "visible";
        document.getElementById('opt_selecione').selected = "selected";
        document.getElementById('opt_nenhuma').style.visibility = "hidden";
        document.getElementById('composto_ativo').placeholder = 'Ex: Dipirona';
        document.getElementById('composto_ativo').className = '';
        document.getElementById('dosagem_numero').className = '';
        document.getElementById('dosagem_unidade').className = '';
    }
    else {
        document.getElementById('dosagem_numero').placeholder = 'Nenhuma';
        document.getElementById('opt_selecione').style.visibility = "hidden";
        document.getElementById('opt_nenhuma').style.visibility = "visible";
        document.getElementById('opt_nenhuma').style.visibility = "hidden";
        document.getElementById('composto_ativo').placeholder = 'Nenhum';
        document.getElementById('composto_ativo').className = 'input_cinza';
        document.getElementById('dosagem_numero').className = 'input_cinza';
        document.getElementById('dosagem_unidade').className = 'input_cinza';
    }
}

async function cadastrarProduto(e) {
    e.preventDefault();

    try {
        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco_unitario = document.getElementById('preco_unitario').value;
        const validade = document.getElementById('validade').value;
        const dosagemNumero = document.getElementById('dosagem_numero').value;
        const dosagemUnidade = document.getElementById('dosagem_unidade').value;
        const dosagem = dosagemNumero ? `${dosagemNumero} ${dosagemUnidade}` : null;
        const composto_ativo = document.getElementById('composto_ativo').value || null;
        let radio;

        // Validação da quantidade
    if (quantidade < 0) {
        alert('A quantidade não pode ser menor que zero!');
        return; // Interrompe a execução da função
    }

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
