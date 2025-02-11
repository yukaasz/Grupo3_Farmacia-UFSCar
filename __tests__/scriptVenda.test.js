const { JSDOM } = require('jsdom');

// Mock global alert
global.alert = jest.fn();

const { realizarVenda, carregarProdutos } = require('../Vendas/scriptVenda'); 

describe('Testes para Processamento de Vendas', () => {
    let dom;
    let document;
    let window;
    let consoleErrorMock;

    beforeEach(() => {
        // Configurar o DOM
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <body>
                <div class="container">
                    <h1>Registrar Venda</h1>
                    <form id="vendaForm">
                        <label for="produto">Produto:</label>
                        <select id="produto" name="produto" required>
                            <option value="" disabled selected>Selecionar</option>
                        </select>
                        <label for="quantidade">Quantidade:</label>
                        <input type="number" id="quantidade" name="quantidade" min="1" required>
                        <button type="submit">Registrar Venda</button>
                    </form>
                    <p id="mensagem"></p>
                </div>
            </body>
            </html>
        `);
        document = dom.window.document;
        window = dom.window;
        global.document = document;
        global.window = window;

        // Mock do console.error para evitar poluição do console
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restaura o mock do console.error
        consoleErrorMock.mockRestore();
    });

    describe('carregarProdutos', () => {
        it('deve carregar os produtos no select', async () => {
            // Mock da resposta do fetch
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => [
                    {
                        id_produto: 1,
                        nome: 'Produto A',
                        dosagem: '100mg',
                        preco_unitario: 10.5,
                        quantidade: 20,
                        validade: '2023-12-31'
                    },
                    {
                        id_produto: 2,
                        nome: 'Produto B',
                        dosagem: '200mg',
                        preco_unitario: 15.0,
                        quantidade: 15,
                        validade: '2024-01-15'
                    }
                ],
            });

            // Chamar a função que deve ser testada
            await carregarProdutos();

            // Verificar se os produtos foram carregados no select
            const options = document.querySelectorAll('#produto option');
            expect(options.length).toBe(3); // 2 produtos + 1 opção padrão
            expect(options[1].textContent).toContain('Produto A');
            expect(options[2].textContent).toContain('Produto B');
        });

        it('deve exibir uma mensagem de erro se a requisição falhar', async () => {
            // Mock da falha do fetch
            global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao carregar os produtos'));

            // Chamar a função que deve ser testada
            await carregarProdutos();

            // Verificar se a mensagem de erro foi exibida
            const mensagem = document.getElementById('mensagem').textContent;
            expect(mensagem).toBe('Erro ao carregar os produtos. Tente novamente mais tarde.');
        });
    });

    describe('realizarVenda', () => {
        it('deve registrar uma venda com sucesso', async () => {
            // Mock da resposta do fetch
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
            });

            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Simular a seleção de um produto e a quantidade
            document.getElementById('produto').innerHTML = `
                <option value="1 - Produto A">Id:1 - Produto A - 100mg - R$ 10.5 - Qtd: 20 - Val: 31/12/2023</option>
            `;
            document.getElementById('quantidade').value = 2;

            // Simular o envio do formulário
            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);

            form.dispatchEvent(new window.Event('submit'));

            // Verificar se o fetch foi chamado corretamente
            await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a execução assíncrona
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/vendas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ produtoId: '1', quantidade: '2' }),
            });

            // Verificar se o alerta de sucesso foi chamado
            expect(global.alert).toHaveBeenCalledWith('Venda registrada com sucesso!');
        });

        it('deve exibir um erro se o produto não for selecionado', async () => {
            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Simular o envio do formulário sem selecionar um produto
            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);

            form.dispatchEvent(new window.Event('submit'));

            // Verificar se o alerta de erro foi chamado
            expect(global.alert).toHaveBeenCalledWith('Por favor, selecione um produto!');
        });

        it('deve exibir um erro se a requisição falhar', async () => {
            // Mock da falha do fetch
            global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao registrar a venda'));

            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Simular a seleção de um produto e a quantidade
            document.getElementById('produto').innerHTML = `
                <option value="1 - Produto A">Id:1 - Produto A - 100mg - R$ 10.5 - Qtd: 20 - Val: 31/12/2023</option>
            `;
            document.getElementById('quantidade').value = 2;

            // Simular o envio do formulário
            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);

            form.dispatchEvent(new window.Event('submit'));

            // Verificar se o alerta de erro foi chamado
            await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a execução assíncrona
            expect(global.alert).toHaveBeenCalledWith('Erro inesperado ao registrar a venda. Verifique sua conexão e tente novamente.');

            
        });

        it('não deve permitir selecionar um produto inválido', async () => {
            global.alert = jest.fn();
            document.getElementById('produto').value = ""; // Opção padrão
            document.getElementById('quantidade').value = 1;
            
            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);
            form.dispatchEvent(new window.Event('submit'));

            expect(global.alert).toHaveBeenCalledWith('Por favor, selecione um produto!');
        });

        it('não deve permitir inserir uma quantidade inválida', async () => {
            global.alert = jest.fn();
            document.getElementById('produto').innerHTML = `<option value="1">Produto A</option>`;
            document.getElementById('produto').value = "1";
            document.getElementById('quantidade').value = 0; // Quantidade inválida

            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);
            form.dispatchEvent(new window.Event('submit'));

            expect(global.alert).toHaveBeenCalledWith('Por favor, insira uma quantidade válida!');
        });

        it('não deve permitir registrar venda se o produto não tiver estoque suficiente', async () => {
            global.alert = jest.fn();
            document.getElementById('produto').innerHTML = `<option value="1">Produto A</option>`;
            document.getElementById('produto').value = "1";
            document.getElementById('quantidade').value = 100; // Maior que o estoque

            // Mock da resposta do fetch para verificar o estoque
            global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: false, // Simula uma resposta de erro
                json: async () => ({ error: 'Quantidade insuficiente no estoque!' }), // Estoque insuficiente
            });

            const form = document.getElementById('vendaForm');
            form.onsubmit = (e) => realizarVenda(e);
            form.dispatchEvent(new window.Event('submit'));

            // Verificar se o alerta de erro foi chamado
            await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a execução assíncrona
            expect(global.alert).toHaveBeenCalledWith('Erro ao registrar a venda!');

            // expect(global.alert).toHaveBeenCalledWith('Estoque insuficiente para a quantidade desejada!');
            // Verificar se o alerta de erro foi chamado
            // await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a execução assíncrona
            // expect(global.alert).toHaveBeenCalledWith('Estoque insuficiente para a quantidade desejada!');
        });
    });
});