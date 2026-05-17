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

    // --- LÓGICA DE LOGIN COM BACK-END ---
    if (btnEntrar) {
        btnEntrar.addEventListener("click", async function(e) { // Adicionado async aqui
            e.preventDefault(); 
            e.stopPropagation();

            const cpfLimpio = inputCPF.value.replace(/\D/g, "");
            const senhaDigitada = inputSenha.value.trim();
            
            // Validação visual de tamanho mínimo
            if (cpfLimpio.length < 11 || senhaDigitada.length < 8 ) {
                alert("Por favor, preencha o CPF e a senha corretamente.");
                return;
            }

            // Desabilita o botão e mostra carregamento
            btnEntrar.innerText = "Acessando...";
            btnEntrar.style.opacity = "0.7";
            btnEntrar.disabled = true;

            try {
                // Ajuste a URL '/api/login' para a rota real do seu back-end
                const resposta = await fetch('http://localhost:5207/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cpf: cpfLimpio,
                        senha: senhaDigitada
                    })
                });

                const dados = await resposta.json();

                if (!resposta.ok) {
                    // Lança o erro retornado pelo back-end (ex: "Senha incorreta")
                    throw new Error(dados.mensagem || "Erro ao realizar login.");
                }

                // Salva os dados reais devolvidos pelo servidor
                localStorage.setItem('token_acesso', dados.token);
                localStorage.setItem('usuario_nome', dados.nome);

                // Redireciona em caso de sucesso
                window.location.href = "../Tela de Agendamento/index.html";

            } catch (erro) {
                // Mostra o erro no Swal através do alert interceptado
                alert(erro.message);
                
                // Reativa o botão em caso de falha para o usuário tentar de novo
                btnEntrar.innerText = "Entrar";
                btnEntrar.style.opacity = "1";
                btnEntrar.disabled = false;
            }
        });
    }

    // Atalho Enter
    [inputCPF, inputSenha].forEach(input => {
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
