# 🏥 AgendaiFisio — Sistema de Gestão para Clínica de Fisioterapia

Sistema web para gerenciamento de uma clínica de fisioterapia, incluindo autenticação de usuários, agendamento de consultas, prontuários e notas de evolução.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar](#-como-rodar)
  - [Back-End](#️-back-end)
  - [Front-End](#-front-end)
- [Scripts do Banco de Dados](#-scripts-do-banco-de-dados)
- [Endpoints da API](#-endpoints-da-api)

---

## 🚀 Tecnologias

### Back-End

| Tecnologia | Descrição |
|---|---|
| ASP.NET Core Web API | Framework principal da API |
| .NET 9 | Plataforma de execução |
| Dapper | Micro-ORM para acesso a dados |
| SQLite | Banco de dados relacional embarcado |
| JWT (JSON Web Tokens) | Autenticação e autorização |
| BCrypt | Hash seguro de senhas |
| Swagger (Swashbuckle) | Documentação interativa da API |

### Front-End

| Tecnologia | Descrição |
|---|---|
| HTML / CSS / JavaScript | Interface web (Vanilla) |

---

## 📁 Estrutura do Projeto

```
AgendaiFisio/
├── ClinicaProject/
│   ├── Clinica.sln                     # Solution do .NET
│   ├── docs/
│   │   ├── script_banco.sql            # Script DDL — SQLite
│   │   └── script_sqlserver.sql        # Script DDL — SQL Server
│   └── src/
│       ├── Clinica.API/
│       │   ├── Controllers/            # Endpoints da API
│       │   ├── Models/
│       │   │   ├── DTOs/               # Data Transfer Objects
│       │   │   └── Entities/           # Entidades de domínio
│       │   ├── Repositories/           # Acesso a dados (Dapper)
│       │   ├── Services/               # Regras de negócio
│       │   ├── Program.cs              # Configuração e bootstrap
│       │   ├── appsettings.json        # Configurações da aplicação
│       │   └── clinica.db              # Banco de dados SQLite
│       └── Clinica.Web/                # Front-End (HTML/CSS/JS)
│           ├── Tela de login/
│           ├── Tela de Cadastro/
│           ├── Tela de Agendamento/
│           ├── Tela de esqueceu a senha/
│           ├── Tela Consulta Paciente/
│           ├── Tela Terapeuta GERAL/
│           └── tela Dashboard terapeuta/
└── README.md
```

---

## ✅ Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [VS Code](https://code.visualstudio.com/) com a extensão **Live Server** (para o front-end)

---

## ▶️ Como Rodar

### 🛠️ Back-End

1. Navegue até a pasta da API:

   ```bash
   cd ClinicaProject/src/Clinica.API
   ```

2. Restaure os pacotes NuGet:

   ```bash
   dotnet restore
   ```

3. Inicie a API:

   ```bash
   dotnet run
   ```

4. Acesse a documentação Swagger em:

   ```
   https://localhost:<porta>/swagger
   ```

> [!NOTE]
> O banco de dados SQLite (`clinica.db`) já está incluso no repositório. Caso precise recriá-lo, execute o script `docs/script_banco.sql`.

### 🌐 Front-End

1. Abra a pasta `ClinicaProject/src/Clinica.Web/` no VS Code.
2. Clique com o botão direito no arquivo `index.html` da tela desejada.
3. Selecione **"Open with Live Server"**.

---

## 🗄️ Scripts do Banco de Dados

| Arquivo | Banco | Caminho |
|---|---|---|
| `script_banco.sql` | SQLite | `ClinicaProject/docs/script_banco.sql` |
| `script_sqlserver.sql` | SQL Server | `ClinicaProject/docs/script_sqlserver.sql` |

### Tabelas

| Tabela | Descrição |
|---|---|
| `usuario` | Cadastro de pacientes e terapeutas |
| `agendamento` | Agendamentos de consultas |
| `prontuario` | Prontuários clínicos dos pacientes |
| `nota_evolucao` | Notas de evolução vinculadas aos prontuários |
| `arquivo_exame` | Arquivos de exames anexados aos prontuários |

---

## 📡 Endpoints da API

### Autenticação (`/api/auth`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cadastro de novo usuário |
| `POST` | `/api/auth/login` | Login (retorna JWT) |

---

## 👥 Equipe

Projeto acadêmico — **ADS UNIP**

---

## 📄 Licença

Este projeto é de uso acadêmico.
