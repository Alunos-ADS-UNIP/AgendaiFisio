window.onload = function() {
    const btnEntrar = document.getElementById("btnEntrar");
    const inputCPF = document.getElementById("cpfLogin");
    const inputSenha = document.getElementById("senha");

    // --- MÁSCARA DE CPF ---
    if (inputCPF) {
        inputCPF.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }
    function validarCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g, ''); // Remove pontos e traços
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica tamanho e repetidos
            
            // Lógica matemática de validação
            let soma = 0;
            let resto;
            for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            if (resto !== parseInt(cpf.substring(9, 10))) return false;
            
            soma = 0;
            for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            if (resto !== parseInt(cpf.substring(10, 11))) return false;
            
            return true;
        }

        function checkForm() {
            let cpf = document.getElementById('cpf').value;
            if (!validarCPF(cpf)) {
                alert('CPF Inválido!');
                return false;
            }
            alert('CPF Válido!');
            return true;
        }

    // --- LÓGICA DE LOGIN ---
    if (btnEntrar) {
        btnEntrar.addEventListener("click", function(e) {
            e.preventDefault(); 
            e.stopPropagation();

            const cpfLimpio = inputCPF.value.replace(/\D/g, "");
            const senhaDigitada = inputSenha.value.trim();
            
            if (cpfLimpio.length < 11 || senhaDigitada === "") {
                alert("Por favor, preencha o CPF e a senha corretamente.");
                return;
            }

            // SIMULAÇÃO DE SUCESSO
            const tokenSimulado = "jwt_" + Math.random().toString(36).substr(2);
            localStorage.setItem('token_acesso', tokenSimulado);
            localStorage.setItem('usuario_nome', "Davi Gusmão");

            btnEntrar.innerText = "Acessando...";
            btnEntrar.style.opacity = "0.7";
            btnEntrar.disabled = true;

            setTimeout(() => {
                window.location.href = "../Tela de Agendamento/index.html";
            }, 500);
        });
    }

    // Atalho Enter
    [inputCPF, inputSenha].forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                btnEntrar.click();
            }
        });
    });
};
