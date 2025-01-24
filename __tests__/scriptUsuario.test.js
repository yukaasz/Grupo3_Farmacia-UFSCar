
// const { JSDOM } = require('jsdom');

// describe('Cadastro de Usuário', () => {
//     let dom;
//     let document;

//     beforeEach(() => {
//         dom = new JSDOM(`
//             <!DOCTYPE html>
//             <html>
//                 <body>
//                     <form id="cadastroUsuarioForm">
//                         <input id="cpf" value="12345678900" />
//                         <input id="nome" value="João Silva" />
//                         <input id="cargo" value="Gerente" />
//                         <input id="senha" value="123456" />
//                         <button type="submit">Cadastrar</button>
//                     </form>
//                 </body>
//             </html>
//         `);

//         document = dom.window.document;
//         global.document = document;
//         global.window = dom.window;

//         global.fetch = jest.fn();
//         global.alert = jest.fn();

//         // Importa o script
//         require('../CadastroDeUsuario/scriptUsuario'); // Substitua pelo caminho correto
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('deve cadastrar o usuário com sucesso', async () => {
//         global.fetch.mockResolvedValueOnce({ ok: true });

//         const form = document.getElementById('cadastroUsuarioForm');
//         await form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

//         await new Promise(process.nextTick);

//         expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 cpf: '12345678900',
//                 nome: 'João Silva',
//                 cargo: 'Gerente',
//                 senha: '123456',
//             }),
//         });
//         expect(global.alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso!');
//     });

//     it('deve exibir uma mensagem de erro ao falhar no cadastro', async () => {
//         global.fetch.mockResolvedValueOnce({ ok: false });

//         const form = document.getElementById('cadastroUsuarioForm');
//         await form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));

//         await new Promise(process.nextTick);

//         expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 cpf: '12345678900',
//                 nome: 'João Silva',
//                 cargo: 'Gerente',
//                 senha: '123456',
//             }),
//         });
//         expect(global.alert).toHaveBeenCalledWith('Erro ao cadastrar usuário!');
//     });
// });

// describe('Cadastro de Usuário', () => {
//     let dom;
//     let document;

//     beforeEach(() => {
//         dom = new JSDOM(`
//             <!DOCTYPE html>
//             <html>
//                 <body>
//                     <form id="cadastroUsuarioForm">
//                         <input id="cpf" value="12345678900" />
//                         <input id="nome" value="João Silva" />
//                         <select id="cargo">
//                             <option value="gerente" selected>Gerente</option>
//                             <option value="operador_caixa">Operador de Caixa</option>
//                             <option value="farmaceutico">Farmacêutico</option>
//                         </select>
//                         <input id="senha" value="123456" />
//                         <button type="submit">Cadastrar</button>
//                     </form>
//                 </body>
//             </html>
//         `);

//         document = dom.window.document;
//         global.document = document;
//         global.window = dom.window;

//         global.fetch = jest.fn();
//         global.alert = jest.fn();

//         require('../CadastroDeUsuario/scriptUsuario'); // Ajuste o caminho conforme necessário
//         document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('deve cadastrar o usuário com sucesso', async () => {
//         global.fetch.mockResolvedValueOnce({
//             ok: true,
//             json: jest.fn().mockResolvedValue({}),
//         });
        
//         const form = document.getElementById('cadastroUsuarioForm');
//         form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        
//         await flushPromises(); 
        
//         expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 cpf: '12345678900',
//                 nome: 'João Silva',
//                 cargo: 'gerente',
//                 senha: '123456',
//             }),
//         });
//         expect(global.alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso!');
//     });

//     it('deve exibir uma mensagem de erro ao falhar no cadastro', async () => {
//         global.fetch.mockResolvedValueOnce({
//             ok: false,
//             json: jest.fn().mockResolvedValue({ error: 'Falha no cadastro' }),
//         });
    
//         const form = document.getElementById('cadastroUsuarioForm');
//         form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        
//         await flushPromises(); 
        
//         expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 cpf: '12345678900',
//                 nome: 'João Silva',
//                 cargo: 'gerente',
//                 senha: '123456',
//             }),
//         });
//         expect(global.alert).toHaveBeenCalledWith('Erro ao cadastrar usuário!');
//     });

// });



const { JSDOM } = require('jsdom');

describe('Cadastro de Usuário', () => {
    let dom;
    let document;

    // Função auxiliar para aguardar promessas
    function flushPromises() {
        return new Promise(resolve => setImmediate(resolve));
    }

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
                <body>
                    <form id="cadastroUsuarioForm">
                        <input id="cpf" value="12345678900" />
                        <input id="nome" value="João Silva" />
                        <select id="cargo">
                            <option value="gerente" selected>Gerente</option>
                            <option value="operador_caixa">Operador de Caixa</option>
                            <option value="farmaceutico">Farmacêutico</option>
                        </select>
                        <input id="senha" value="123456" />
                        <button type="submit">Cadastrar</button>
                    </form>
                </body>
            </html>
        `);

        document = dom.window.document;
        global.document = document;
        global.window = dom.window;

        global.fetch = jest.fn();
        global.alert = jest.fn();

        require('../CadastroDeUsuario/scriptUsuario'); // Substitua pelo caminho correto
        document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve cadastrar o usuário com sucesso', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({}), // Mock da resposta JSON
        });
        
        const form = document.getElementById('cadastroUsuarioForm');
        form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        
        // Aguarda as promessas assíncronas
        await flushPromises(); 
        
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cpf: '12345678900',
                nome: 'João Silva',
                cargo: 'gerente',
                senha: '123456',
            }),
        });
        expect(global.alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso!');
    });

    it('deve exibir uma mensagem de erro ao falhar no cadastro', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValue({ error: 'Falha no cadastro' }), // Mock da resposta JSON com erro
        });
    
        const form = document.getElementById('cadastroUsuarioForm');
        form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
        
        // Aguarda as promessas assíncronas
        await flushPromises(); 
        
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cpf: '12345678900',
                nome: 'João Silva',
                cargo: 'gerente',
                senha: '123456',
            }),
        });
        expect(global.alert).toHaveBeenCalledWith('Erro ao cadastrar usuário!');
    });

});