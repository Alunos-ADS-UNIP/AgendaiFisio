// INTERCEPTA O ALERT TRADICIONAL E CONVERTE EM POPUP MODERNO
window.alert = function (mensagemErros) {
    Swal.fire({
        text: mensagemErros,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#C8DAA0', 
        background: '#ffffff',
        border: 'none',
        customClass: {
            popup: 'arredondar-popup',
        }
    });
};

window.onload = function() {
    const btnEntrar = document.getElementById("btnEntrar");
    const inputEmail = document.getElementById("emailLogin");
    const inputSenha = document.getElementById("senha");

    // --- LÓGICA DE LOGIN COM VALIDAÇÃO DE BACK-END ---
    if (btnEntrar) {
        btnEntrar.addEventListener("click", async function(e) { // Adicionado async para usar await
            e.preventDefault(); 
            e.stopPropagation();

            const emailDigitado = inputEmail.value.trim();
            const senhaDigitada = inputSenha.value.trim();
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            // 1. VALIDAÇÃO DE CAMPOS VAZIOS
            if (emailDigitado === "" || senhaDigitada === "") {
                alert("Por favor, preencha todos os campos obrigatórios (E-mail e Senha).");
                return;
            }

            // 2. VALIDAÇÃO DA MÁSCARA DO E-MAIL
            if (!regexEmail.test(emailDigitado)) {
                alert("Por favor, insira um formato de e-mail válido (exemplo@email.com).");
                return;
            }

            // 3. VALIDAÇÃO DE TAMANHO DA SENHA
            if (senhaDigitada.length < 8) {
                alert("A senha deve conter pelo menos 8 caracteres.");
                return;
            }

            // Altera o estado do botão para feedback visual
            btnEntrar.innerText = "Acessando...";
            btnEntrar.style.opacity = "0.7";
            btnEntrar.disabled = true;

            try {
                // Tenta realizar a requisição na API
                const resposta = await fetch('http://localhost:5207/api/Auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailDigitado,
                        senha: senhaDigitada
                    })
                });

                // Tenta ler o JSON da resposta do servidor
                const dados = await resposta.json();

                // Se a API respondeu, mas com status de erro (ex: 400 ou 401)
                if (!resposta.ok) {
                    throw new Error(dados.mensagem || "Credenciais inválidas. Verifique seu e-mail e senha.");
                }

                // Salva os dados reais devolvidos pelo servidor em caso de sucesso
                localStorage.setItem('token_acesso', dados.token);
                localStorage.setItem('usuario_nome', dados.nome || emailDigitado.split('@')[0]);

                // Redireciona para a tela de agendamento
                window.location.href = "../Tela de Agendamento/index.html";

            } catch (erro) {
                // Captura erros de rede (API desligada) ou respostas inválidas
                if (erro instanceof TypeError) {
                    alert("Não foi possível conectar ao servidor. Verifique se a API está online.");
                } else {
                    alert(erro.message);
                }
                
                // Reativa o botão para permitir nova tentativa
                btnEntrar.innerText = "Entrar";
                btnEntrar.style.opacity = "1";
                btnEntrar.disabled = false;
            }
        });
    }

    // Atalho Enter
    [inputEmail, inputSenha].forEach(input => {
        if (input) {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    btnEntrar.click();
                }
            });
        }
    });
};
