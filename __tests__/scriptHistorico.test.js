const { JSDOM } = require('jsdom');

const { carregarHistorico } = require('../Historico de Entradas e Saidas/scriptHistorico');

describe('carregarHistorico', () => {
    let dom;
    let document;
    let consoleErrorMock;

    beforeEach(() => {
        // Configurar o DOM
        dom = new JSDOM(`<!DOCTYPE html><html><body><table id="historicoTable"><tbody></tbody></table></body></html>`);
        document = dom.window.document;
        global.document = document;
        global.window = dom.window;

        // Mock do console.error para ocultar logs de erro
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // Restaura o mock do console.error
        consoleErrorMock.mockRestore();
    });

    it('deve preencher a tabela com os dados do histórico', async () => {
        // Mock da resposta do fetch
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id_transacao: 1,
                    nome_produto: 'Produto A',
                    quantidade: 10,
                    date_hora: '2025-01-01T12:00:00',
                    tipo: 'entrada',
                },
            ],
        });

        // Chamar a função que deve ser testada
        await carregarHistorico();

        // Verificar se os dados foram inseridos na tabela
        const rows = document.querySelectorAll('#historicoTable tbody tr');
        expect(rows.length).toBe(1);
        expect(rows[0].textContent).toContain('Produto A');
        expect(rows[0].textContent).toContain('10');
    });

    it('deve exibir um erro se a requisição falhar', async () => {
        // Mock da falha do fetch
        global.fetch = jest.fn().mockRejectedValue(new Error('Erro ao buscar o histórico'));

        // Mock do alert para evitar que ele apareça no terminal
        global.alert = jest.fn();

        await carregarHistorico();

        // Verificar se o alerta foi chamado
        expect(global.alert).toHaveBeenCalledWith('Erro ao carregar o histórico. Por favor, tente novamente mais tarde.');
    });
});
