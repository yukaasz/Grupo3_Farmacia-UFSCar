const { JSDOM } = require('jsdom');

// Mock global alert
global.alert = jest.fn();

const { cadastrarUsuario } = require('../CadastroDeUsuario/scriptUsuario');

describe('Teste da função cadastrarUsuario', () => {
    let dom;
    let document;

    beforeEach(() => {
        // Configura um DOM virtual
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <body>
                <form id="cadastroUsuarioForm">
                    <input type="text" id="cpf" value="12345678901" />
                    <input type="text" id="nome" value="Fulano" />
                    <select id="cargo">
                        <option value="gerente" selected>Gerente</option>
                    </select>
                    <input type="password" id="senha" value="1234" />
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

        await cadastrarUsuario(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cpf: '12345678901',
                nome: 'Fulano',
                cargo: 'gerente',
                senha: '1234',
            }),
        });
        expect(global.alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso!');
    });

    it('deve exibir erro se o CPF for curto demais', async () => {
        document.getElementById('cpf').value = '12345';
        document.getElementById('nome').value = 'Fulano';
        document.getElementById('cargo').value = 'gerente';
        document.getElementById('senha').value = '1234';

        const event = { preventDefault: jest.fn() };
        await cadastrarUsuario(event);

        expect(global.alert).toHaveBeenCalledWith('O CPF deve conter exatamente 11 dígitos!');
    });

    it('deve exibir erro se algum campo obrigatório estiver vazio', async () => {
        document.getElementById('cpf').value = '';
        document.getElementById('nome').value = '';
        document.getElementById('cargo').value = '';
        document.getElementById('senha').value = '';

        const event = { preventDefault: jest.fn() };
        await cadastrarUsuario(event);

        expect(global.alert).toHaveBeenCalledWith('Todos os campos são obrigatórios!');
    });

    it('deve exibir erro se o cargo for inválido', async () => {
        document.getElementById('cpf').value = '12345678901';
        document.getElementById('nome').value = 'Fulano';
        document.getElementById('cargo').value = 'CEO';
        document.getElementById('senha').value = '1234';

        const event = { preventDefault: jest.fn() };
        await cadastrarUsuario(event);

        expect(global.alert).toHaveBeenCalledWith('Cargo inválido! Escolha entre: Gerente, Operador de Caixa ou Farmacêutico.');
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

        await cadastrarUsuario(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Erro ao cadastrar usuário!');
    });

    it('deve exibir uma mensagem de erro inesperado em caso de exceção', async () => {
        // Mock de erro no fetch
        global.fetch.mockRejectedValueOnce(new Error('Erro inesperado'));

        const event = {
            preventDefault: jest.fn(),
        };

        await cadastrarUsuario(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(global.fetch).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith(
            'Erro inesperado ao cadastrar o usuário. Verifique sua conexão e tente novamente.'
        );
    });
});