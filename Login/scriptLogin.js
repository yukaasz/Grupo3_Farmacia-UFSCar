
        document.getElementById("loginForm").addEventListener("submit", async function(event) {
            event.preventDefault();
            const cpf = document.getElementById("cpf").value;
            const cargo = document.getElementById("cargo").value;
            const senha = document.getElementById("senha").value;
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "";

            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cpf, cargo, senha })
            });

            const data = await response.json();

            if (response.ok) {
                if (cargo === "gerente") {
                    window.location.href = "gerente.html";
                } else if (cargo === "farmaceutico") {
                    window.location.href = "farmaceutico.html";
                } else if (cargo === "operador") {
                    window.location.href = "operador.html";
                }
            } else {
                errorMessage.textContent = data.error;
            }
        });
    