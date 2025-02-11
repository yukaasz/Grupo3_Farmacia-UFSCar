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

    it('deve exibir uma mensagem de sucesso quando o cadastro de produto for realizado com sucesso', async () => {
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
        document.getElementById('radio_produto').checked = true;

        document.getElementById('nome').value = 'Fralda Huggies';
        document.getElementById('quantidade').value = '200';
        document.getElementById('preco_unitario').value = '100.50';
        document.getElementById('validade').value = '2029-12-11';
        document.getElementById('dosagem_numero').value = ''; // Produto não tem dosagem
        document.getElementById('dosagem_unidade').value = ''; // Produto não tem dosagem
        document.getElementById('composto_ativo').value = ''; // Produto não tem composto ativo
        document.getElementById('radio_produto').checked = true;


        await cadastrarProduto(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: 'Fralda Huggies',
                quantidade: '200',
                preco_unitario: '100.50',
                validade: '2029-12-11',
                dosagem: null,
                composto_ativo: null,
                radio: 'produto',
            }),
        });
        expect(global.alert).toHaveBeenCalledWith('Produto cadastrado com sucesso!');
    });

    it('deve exibir uma mensagem de sucesso quando o cadastro de medicamento for realizado com sucesso', async () => {
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

    it('deve exibir uma mensagem de erro quando a quantidade for menor que zero', async () => {
        const event = {
            preventDefault: jest.fn(),
        };
    
        // Simula a seleção do radio button "produto"
        document.getElementById('radio_produto').checked = true;
    
        // Define a quantidade como um valor negativo
        document.getElementById('quantidade').value = '-10';
    
        await cadastrarProduto(event);
    
        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).not.toHaveBeenCalled(); // O fetch não deve ser chamado
        expect(global.alert).toHaveBeenCalledWith('A quantidade não pode ser menor que zero!');
    });
});