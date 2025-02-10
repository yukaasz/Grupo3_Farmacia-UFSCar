async function fazerLogin(event) {
    event.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    console.log("ok");
    
    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf, senha }) // Enviando apenas CPF e senha
        });
        
        console.log("ok2");
        const data = await response.json();

        if (data.sucesso) {
            // Salvando cargo no LocalStorage
            localStorage.setItem("cargoUsuario", data.cargo);
            window.location.href = "../Dashboard/dashboard.html";
        } else {
            errorMessage.textContent = data.mensagem; // Exibir erro no frontend
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        errorMessage.textContent = "Erro ao conectar com o servidor.";
    }
}


