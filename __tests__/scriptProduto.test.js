const { JSDOM } = require('jsdom');

// Mock global alert
global.alert = jest.fn();

const { cadastrarProduto } = require('../CadastroDeProdutos/scriptProduto');

describe('Teste da função cadastrarProduto', () => {
    let dom;
    let document;

    beforeEach(() => {
        // Configura um DOM virtual
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <body>
                <form id="cadastroProdutoForm">
                    <input type="radio" id="radio_medicamento" name="radio" value="medicamento" />
                    <input type="radio" id="radio_produto" name="radio" value="produto" />
                    <input type="text" id="nome" value="Paracetamol" />
                    <input type="text" id="composto_ativo" value="Paracetamol" />
                    <input type="number" id="preco_unitario" value="10.50" />
                    <input type="number" id="dosagem_numero" value="500" />
                    <select id="dosagem_unidade">
                        <option value="mg">Miligramas (mg)</option>
                    </select>
                    <input type="date" id="validade" value="2023-12-31" />
                    <input type="number" id="quantidade" value="100" />
                    <button type="submit">Cadastrar</button>
                </form>
            </body>
            </html>
        `);
        document = dom.window.document;
        global.document = document;
        global.window = dom.window;

        // Mock global fetch
        global.fetch = jest.fn();

        // Mock do console.error para evitar poluição do console
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve exibir uma mensagem de sucesso quando o cadastro for realizado com sucesso', async () => {
        // Mock da resposta do fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });

        const event = {
            preventDefault: jest.fn(),
        };

        // Simula a seleção do radio button "medicamento"
        document.getElementById('radio_medicamento').checked = true;

        await cadastrarProduto(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: 'Paracetamol',
                quantidade: '100',
                preco_unitario: '10.50',
                validade: '2023-12-31',
                dosagem: '500 mg',
                composto_ativo: 'Paracetamol',
                radio: 'medicamento',
            }),
        });
        expect(global.alert).toHaveBeenCalledWith('Produto cadastrado com sucesso!');
    });

    it('deve exibir uma mensagem de erro quando o cadastro falhar', async () => {
        // Mock da resposta do fetch com erro
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
        });

        const event = {
            preventDefault: jest.fn(),
        };

        // Simula a seleção do radio button "produto"
        document.getElementById('radio_produto').checked = true;

        await cadastrarProduto(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Erro ao cadastrar produto!');
    });

    it('deve exibir uma mensagem de erro inesperado em caso de exceção', async () => {
        // Mock de erro no fetch
        global.fetch.mockRejectedValueOnce(new Error('Erro inesperado'));

        const event = {
            preventDefault: jest.fn(),
        };

        // Simula a seleção do radio button "medicamento"
        document.getElementById('radio_medicamento').checked = true;

        await cadastrarProduto(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Erro inesperado ao cadastrar o produto. Por favor, tente novamente mais tarde.');
    });
});