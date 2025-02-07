const { JSDOM } = require('jsdom');

// Mock global alert
global.alert = jest.fn();

const { buscarVendas, atualizarTabela } = require('../Vendas/scriptVenda'); 

describe('Testes para buscarVendas e atualizarTabela', () => {
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
                    <h1>Buscar Vendas</h1>
                    <form id="buscarVendasForm">
                        <label for="mes">Mês:</label>
                        <input type="number" id="mes" name="mes" min="1" max="12" required>
                        <label for="ano">Ano:</label>
                        <input type="number" id="ano" name="ano" min="2000" max="2100" required>
                        <button type="submit">Buscar Vendas</button>
                    </form>
                    <table id="vendasTable">
                        <thead>
                            <tr>
                                <th>ID Produto</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Total Vendido</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <p id="totalVendido"></p>
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

    describe('buscarVendas', () => {
        it('deve buscar as vendas com sucesso e atualizar a tabela', async () => {
            // Mock da resposta do fetch
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    vendas: [
                        {
                            id_produto: 1,
                            produto: 'Produto A',
                            total_quantidade: 10,
                            preco_unitario: '10.50',
                            total_vendido: '105.00'
                        },
                        {
                            id_produto: 2,
                            produto: 'Produto B',
                            total_quantidade: 5,
                            preco_unitario: '20.00',
                            total_vendido: '100.00'
                        }
                    ],
                    totalVendido: '205.00'
                }),
            });

            // Simular a seleção de mês e ano
            document.getElementById('mes').value = 10;
            document.getElementById('ano').value = 2023;

            // Chamar a função que deve ser testada
            await buscarVendas();

            // Verificar se o fetch foi chamado corretamente
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/receitamensal?mes=10&ano=2023');

            // Verificar se a tabela foi atualizada corretamente
            const rows = document.querySelectorAll('#vendasTable tbody tr');
            expect(rows.length).toBe(2);

            // Verificar os dados da primeira linha
            const firstRowCells = rows[0].querySelectorAll('td');
            expect(firstRowCells[0].textContent).toBe('1');
            expect(firstRowCells[1].textContent).toBe('Produto A');
            expect(firstRowCells[2].textContent).toBe('10');
            expect(firstRowCells[3].textContent).toBe('R$ 10.50');
            expect(firstRowCells[4].textContent).toBe('R$ 105.00');

            // Verificar os dados da segunda linha
            const secondRowCells = rows[1].querySelectorAll('td');
            expect(secondRowCells[0].textContent).toBe('2');
            expect(secondRowCells[1].textContent).toBe('Produto B');
            expect(secondRowCells[2].textContent).toBe('5');
            expect(secondRowCells[3].textContent).toBe('R$ 20.00');
            expect(secondRowCells[4].textContent).toBe('R$ 100.00');

            // Verificar o total vendido
            expect(document.getElementById('totalVendido').textContent).toBe('205.00');
        });

        it('deve exibir um erro se o mês ou ano não forem selecionados', async () => {
            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Chamar a função que deve ser testada sem selecionar mês e ano
            await buscarVendas();

            // Verificar se o alerta de erro foi chamado
            expect(global.alert).toHaveBeenCalledWith('Por favor, selecione um mês e um ano.');
        });

        it('deve exibir um erro se a requisição falhar', async () => {
            // Mock da falha do fetch
            global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao conectar ao servidor'));

            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Simular a seleção de mês e ano
            document.getElementById('mes').value = 10;
            document.getElementById('ano').value = 2023;

            // Chamar a função que deve ser testada
            await buscarVendas();

            // Verificar se o alerta de erro foi chamado
            expect(global.alert).toHaveBeenCalledWith('Erro ao conectar ao servidor.');
        });

        it('deve exibir um erro se a resposta não for ok', async () => {
            // Mock da resposta do fetch com erro
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                json: async () => ({ error: 'Erro ao buscar as vendas' }),
            });

            // Mock do alert para evitar que ele apareça no terminal
            global.alert = jest.fn();

            // Simular a seleção de mês e ano
            document.getElementById('mes').value = 10;
            document.getElementById('ano').value = 2023;

            // Chamar a função que deve ser testada
            await buscarVendas();

            // Verificar se o alerta de erro foi chamado
            expect(global.alert).toHaveBeenCalledWith('Erro ao buscar as vendas: Erro ao buscar as vendas');
        });
    });

    describe('atualizarTabela', () => {
        it('deve atualizar a tabela corretamente com os dados fornecidos', () => {
            const vendas = [
                {
                    id_produto: 1,
                    produto: 'Produto A',
                    total_quantidade: 10,
                    preco_unitario: '10.50',
                    total_vendido: '105.00'
                },
                {
                    id_produto: 2,
                    produto: 'Produto B',
                    total_quantidade: 5,
                    preco_unitario: '20.00',
                    total_vendido: '100.00'
                }
            ];

            // Chamar a função que deve ser testada
            atualizarTabela(vendas);

            // Verificar se a tabela foi atualizada corretamente
            const rows = document.querySelectorAll('#vendasTable tbody tr');
            expect(rows.length).toBe(2);

            // Verificar os dados da primeira linha
            const firstRowCells = rows[0].querySelectorAll('td');
            expect(firstRowCells[0].textContent).toBe('1');
            expect(firstRowCells[1].textContent).toBe('Produto A');
            expect(firstRowCells[2].textContent).toBe('10');
            expect(firstRowCells[3].textContent).toBe('R$ 10.50');
            expect(firstRowCells[4].textContent).toBe('R$ 105.00');

            // Verificar os dados da segunda linha
            const secondRowCells = rows[1].querySelectorAll('td');
            expect(secondRowCells[0].textContent).toBe('2');
            expect(secondRowCells[1].textContent).toBe('Produto B');
            expect(secondRowCells[2].textContent).toBe('5');
            expect(secondRowCells[3].textContent).toBe('R$ 20.00');
            expect(secondRowCells[4].textContent).toBe('R$ 100.00');
        });
    });
});