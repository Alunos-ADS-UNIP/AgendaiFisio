window.onload = function() {
    const el = {
        btnCadastrar: document.getElementById("btnCadastrar"),
        inputNomeCadastro: document.getElementById("nomeCadastro"),
        inputCPFCadastro: document.getElementById("cpfCadastro"),
        inputEmailCadastro: document.getElementById("emailCadastro"),
        inputSenhaCadastro: document.getElementById("senhaCadastro"),
        checkLGPD: document.getElementById("checkLGPD"), 
        URL_API: "http://localhost:5207/api/Auth/register",
        sucessoModal: document.getElementById("modalSucessoCadastro"),
        btnRedirecionar: document.getElementById("btnRedirecionar"),
        dialogTerapeuta: document.getElementById("btnCadastrar"),
        erroDialog: document.getElementById("modalErro"), 
        campoObrigatorio: document.getElementById("meuFormularioCadastro"),
        crefitoReq: document.getElementById("crefitoReq"),
        // Novas referências para o popup de termos na mesma página
        abrirTermos: document.getElementById("abrirTermos"),
        modalTermos: document.getElementById("modalTermos"),
        fecharTermosX: document.getElementById("fecharTermosX"),
        fecharTermosBotao: document.getElementById("fecharTermosBotao")
    };

    // --- 1. MÁSCARA DE CPF ---
    const aplicarMascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, "") 
            .replace(/(\d{3})(\d)/, "$1.$2") 
            .replace(/(\d{3})(\d)/, "$1.$2") 
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2") 
            .substring(0, 14); 
    };

    if (el.inputCPFCadastro) {
        el.inputCPFCadastro.addEventListener("input", (e) => {
            e.target.value = aplicarMascaraCPF(e.target.value);
            el.inputCPFCadastro.classList.remove("input-erro");
        });
    }

    // --- MÁSCARA DO CREFITO (123456-SP) ---
    if (el.crefitoReq) {
        el.crefitoReq.addEventListener("input", (e) => {
            let valor = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            
            if (valor.length > 6) {
                let parteNumerica = valor.substring(0, 6).replace(/\D/g, "");
                let parteLetras = valor.substring(6, 8).replace(/[^A-Z]/g, "");
                e.target.value = parteNumerica + "-" + parteLetras;
            } else {
                e.target.value = valor.replace(/\D/g, "");
            }
            el.crefitoReq.classList.remove("input-erro");
        });
    }

    // Limpa erros dinamicamente ao digitar nos campos
    [el.inputNomeCadastro, el.inputEmailCadastro, el.inputSenhaCadastro, el.crefitoReq, el.inputCPFCadastro].forEach(input => {
        if (input) {
            input.addEventListener("input", () => {
                input.classList.remove("input-erro");
                const msgAntiga = input.parentNode.querySelector(".mensagem-erro-texto");
                if (msgAntiga) msgAntiga.remove();
            });
        }
    });

    // Lógica matemática de validação de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); 
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; 
        
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

    // --- 2. LÓGICA LGPD (Escuta alterações manuais na caixinha de seleção) ---
    if (el.checkLGPD && el.btnCadastrar) {
        el.checkLGPD.addEventListener("change", () => {
            el.btnCadastrar.disabled = !el.checkLGPD.checked;
        });
    }

    // --- 3. POPUP DE TERMOS DE USO (CONTRATO NA MESMA PÁGINA) ---
    if (el.abrirTermos && el.modalTermos) {
        // Abre o popup ao clicar no link correspondente
        el.abrirTermos.addEventListener("click", (e) => {
            e.preventDefault();
            el.modalTermos.showModal();
        });

        // Fecha o popup ao clicar no botão "X"
        if (el.fecharTermosX) {
            el.fecharTermosX.addEventListener("click", () => {
                el.modalTermos.close();
            });
        }

        // Ação do botão "Entendi e Concordo" dentro do popup
        if (el.fecharTermosBotao) {
            el.fecharTermosBotao.addEventListener("click", () => {
                el.modalTermos.close();
                // Marca o checkbox e habilita o botão de cadastro automaticamente
                if (el.checkLGPD && el.btnCadastrar) {
                    el.checkLGPD.checked = true;
                    el.btnCadastrar.disabled = false;
                }
            });
        }

        // Fecha se o usuário clicar fora da área interna do modal (no fundo borrado)
        el.modalTermos.addEventListener("click", (e) => {
            const rect = el.modalTermos.getBoundingClientRect();
            const clicouFora = (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            );
            if (clicouFora) {
                el.modalTermos.close();
            }
        });
    }

    // --- 4. ENVIO E VALIDAÇÃO DO FORMULÁRIO ---
    const enviarCadastro = async () => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const regexCrefito = /^\d{6}-[A-Z]{2}$/;
        
        const dados = {
            nomeCadastro: el.inputNomeCadastro ? el.inputNomeCadastro.value.trim() : "",
            cpf: el.inputCPFCadastro ? el.inputCPFCadastro.value.replace(/\D/g, "") : "",
            emailCadastro: el.inputEmailCadastro ? el.inputEmailCadastro.value.trim() : "",
            senhaCadastro: el.inputSenhaCadastro ? el.inputSenhaCadastro.value.trim() : "",
            crefitoReq: el.crefitoReq ? el.crefitoReq.value.trim().toUpperCase() : "",
        };

        // Limpeza completa de erros antigos antes da nova validação
        [el.inputNomeCadastro, el.inputCPFCadastro, el.inputEmailCadastro, el.inputSenhaCadastro, el.crefitoReq].forEach(input => {
            if (input) {
                input.classList.remove("input-erro");
                const msgAntiga = input.parentNode.querySelector(".mensagem-erro-texto");
                if (msgAntiga) msgAntiga.remove();
            }
        });

        let formInvalido = false;
        let primeiroCampoErro = null;

        const marcarErro = (campo, mensagem) => {
            if (campo) {
                campo.classList.add("input-erro");
                const textoErro = document.createElement("span");
                textoErro.className = "mensagem-erro-texto";
                textoErro.innerText = mensagem;
                campo.parentNode.insertBefore(textoErro, campo.nextSibling);

                if (!primeiroCampoErro) primeiroCampoErro = campo;
                formInvalido = true;
            }
        };

        // --- VALIDAÇÕES INDIVIDUAIS ---
        if (!dados.nomeCadastro) {
            marcarErro(el.inputNomeCadastro, "O campo Nome é obrigatório.");
        }
        
        if (!dados.cpf) {
            marcarErro(el.inputCPFCadastro, "O campo CPF é obrigatório.");
        } else if (dados.cpf.length !== 11 || !validarCPF(dados.cpf)) {
            marcarErro(el.inputCPFCadastro, "Por favor, insira um CPF válido.");
        }

        if (!dados.crefitoReq) {
            marcarErro(el.crefitoReq, "O campo CREFITO é obrigatório.");
        } else if (!regexCrefito.test(dados.crefitoReq)) {
            marcarErro(el.crefitoReq, "Insira um CREFITO válido no formato: 123456-SP.");
        }
        
        if (!dados.emailCadastro) {
            marcarErro(el.inputEmailCadastro, "O campo E-mail é obrigatório.");
        } else if (!regexEmail.test(dados.emailCadastro)) {
            marcarErro(el.inputEmailCadastro, "Insira um formato de e-mail válido (ex: nome@email.com).");
        }
        
        if (!dados.senhaCadastro) {
            marcarErro(el.inputSenhaCadastro, "O campo Senha é obrigatório.");
        } else if (dados.senhaCadastro.length < 8) {
            marcarErro(el.inputSenhaCadastro, "A senha deve conter no mínimo 8 caracteres.");
        }

        // Se houver algum erro impeditivo, exibe o modal de erro centralizado
        if (formInvalido) {
            if (el.erroDialog) el.erroDialog.showModal();
            if (primeiroCampoErro) primeiroCampoErro.focus();
            return;
        }

        // Fluxo Executado com Sucesso
        if (el.sucessoModal){
            el.sucessoModal.showModal();
        }

        setTimeout(() => {
            window.location.href = "/ClinicaProject/src/Clinica.Web/tela de login/login.html";
        }, 3000);
    };

    // --- 5. MAPEAMENTO DE EVENTOS ---
    if (el.btnCadastrar) {
        el.btnCadastrar.onclick = async (e) => {
            e.preventDefault();
            enviarCadastro();
        };
    }

    if (el.btnRedirecionar) {
        el.btnRedirecionar.addEventListener("click", () => {
            window.location.href = "/ClinicaProject/src/Clinica.Web/tela de login/login.html";
        });
    }
};

function selecionarPerfil(tipo) {
    const card = tipo === 'paciente' ? 
        document.getElementById('cardPaciente') : 
        document.getElementById('cardProfissional');

    if (card) card.style.transform = "scale(0.95)";

    setTimeout(() => {
        if (tipo === 'paciente') {
            window.location.href = "cadastro-paciente.html";
        } else {
            window.location.href = "cadastro-profissional.html";
        }
    }, 150);
}