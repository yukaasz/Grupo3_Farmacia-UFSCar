const { JSDOM } = require('jsdom');

const { carregarEstoque } = require('../Historico de Entradas e Saidas/scriptControleEstoque'); 

describe('carregarEstoque', () => {
    let dom;
    let document;
    let consoleErrorMock;

    beforeEach(() => {
        // Configurar o DOM
        dom = new JSDOM(`<!DOCTYPE html><html><body><table id="estoqueTable"><tbody></tbody></table></body></html>`);
        document = dom.window.document;
        global.document = document;
        global.window = dom.window;

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [ /* dados mockados */ ],
        });

        // Mock do console.error para evitar poluição do console
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restaura o mock do console.error
        consoleErrorMock.mockRestore();
    });

    it('deve preencher a tabela com os dados do estoque', async () => {
        // Mock da resposta do fetch
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id_produto: 1,
                    nome: 'Produto A',
                    quantidade: 20,
                },
                {
                    id_produto: 2,
                    nome: 'Produto B',
                    quantidade: 15,
                },
            ],
        });

        // Chamar a função que deve ser testada
        await carregarEstoque();

        // Verificar se os dados foram inseridos na tabela
        const rows = document.querySelectorAll('#estoqueTable tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('Produto A');
        expect(rows[0].textContent).toContain('20');
        expect(rows[1].textContent).toContain('Produto B');
        expect(rows[1].textContent).toContain('15');
    });

    it('deve exibir um erro se a requisição falhar', async () => {
        // Mock da falha do fetch
        global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao buscar o controle de estoque'));

        // Mock do alert para evitar que ele apareça no terminal
        global.alert = jest.fn();

        await carregarEstoque();

        // Verificar se o alerta foi chamado
        expect(global.alert).toHaveBeenCalledWith('Erro ao carregar o controle de estoque. Por favor, tente novamente mais tarde.');
    });
});
