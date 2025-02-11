function verificarPermissoes() {
    let cargo = localStorage.getItem("cargoUsuario"); // Recupera o cargo salvo

    if (!cargo) {
        alert("Erro: Nenhum cargo identificado! Faça login novamente.");
        window.location.href = "../Login/login.html"; // Redireciona para login
        return;
    }

    // Mapeamento de cargos e os cards que eles podem acessar
    const permissoes = {
        "gerente": ["Cadastro de Produto", "Cadastro de Usuário", "Controle de Estoque", "Histórico de Transações", "Registrar Venda", "Controle de Vendas Mensal"],
        "farmaceutico": ["Cadastro de Produto", "Controle de Estoque"],
        "operador": ["Registrar Venda", "Histórico de Transações"]
    };

    if (!permissoes[cargo]) {
        alert("Erro: Cargo inválido! Faça login novamente.");
        window.location.href = "../Login/login.html"; // Redireciona para login
        return;
    }

    // Oculta os cards que o usuário não pode acessar
    document.querySelectorAll(".card").forEach(card => {
        let titulo = card.querySelector("h2").textContent.trim();
        if (!permissoes[cargo].includes(titulo)) {
            card.style.display = "none"; // Esconde o card
        }
    });
}

// Chamada automática ao carregar a página
// document.addEventListener("DOMContentLoaded", verificarPermissoes);


// Exporta a função para ser usada em outros arquivos
module.exports = { verificarPermissoes };
