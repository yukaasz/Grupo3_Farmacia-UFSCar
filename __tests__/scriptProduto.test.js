/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, getByPlaceholderText, getByText, render } from '@testing-library/react';
import '../CadastroDeProdutos/Cadastro_Produto.html'; // Importa o HTML para que os elementos estejam disponíveis

describe('Cadastro de Produto', () => {
    let nomeInput, quantidadeInput, precoInput, validadeInput, dosagemNumeroInput, dosagemUnidadeInput, compostoAtivoInput, radioMedicamento, radioProduto, submitButton;

    beforeEach(() => {
        document.body.innerHTML = document.documentElement.innerHTML; // Reseta o HTML antes de cada teste
        nomeInput = getByPlaceholderText(document.body, /nome/i);
        quantidadeInput = getByPlaceholderText(document.body, /quantidade/i);
        precoInput = getByPlaceholderText(document.body, /preço unitário/i);
        validadeInput = getByPlaceholderText(document.body, /validade/i);
        dosagemNumeroInput = getByPlaceholderText(document.body, /dosagem número/i);
        dosagemUnidadeInput = getByPlaceholderText(document.body, /dosagem unidade/i);
        compostoAtivoInput = getByPlaceholderText(document.body, /composto ativo/i);
        radioMedicamento = getByText(document.body, /medicamento/i).querySelector('input');
        radioProduto = getByText(document.body, /produto/i).querySelector('input');
        submitButton = getByText(document.body, /cadastrar/i);
    });

    test('deve cadastrar um produto com sucesso', async () => {
        // Preenche os campos do formulário
        fireEvent.change(nomeInput, { target: { value: 'Produto Teste' } });
        fireEvent.change(quantidadeInput, { target: { value: '10' } });
        fireEvent.change(precoInput, { target: { value: '20.00' } });
        fireEvent.change(validadeInput, { target: { value: '2025-12-31' } });
        fireEvent.change(dosagemNumeroInput, { target: { value: '500' } });
        fireEvent.change(dosagemUnidadeInput, { target: { value: 'mg' } });
        fireEvent.change(compostoAtivoInput, { target: { value: 'Composto Ativo Teste' } });
        fireEvent.click(radioMedicamento); // ou radioProduto, dependendo do que você deseja testar

        // Mock da função fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })
        );

        // Envia o formulário
        fireEvent.submit(submitButton);

        // Verifica se o alert foi chamado
        expect(window.alert).toHaveBeenCalledWith('Produto cadastrado com sucesso!');

        // Limpeza do mock
        global.fetch.mockClear();
    });

    test('deve mostrar erro ao cadastrar produto', async () => {
        // Mock da função fetch para simular erro
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        // Envia o formulário
        fireEvent.submit(submitButton);

        // Verifica se o alert foi chamado
        expect(window.alert).toHaveBeenCalledWith('Erro ao cadastrar produto!');

        // Limpeza do mock
        global.fetch.mockClear();
    });
});