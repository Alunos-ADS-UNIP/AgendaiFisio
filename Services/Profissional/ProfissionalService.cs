using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AgendaiFisio.Context;
using AgendaiFisio.DTOs.Profissional;
using AgendaiFisio.Entities;

namespace AgendaiFisio.Services.Profissional
{
    // Busca, cria e atualiza profissionais.
    public class ProfissionalService : IProfissionalService
    {
        private readonly AgendaiFisioDbContext _context;

        // Guarda o banco usado pelo serviço.
        public ProfissionalService(AgendaiFisioDbContext context)
        {
            _context = context;
        }

        // Busca um profissional e os dados da conta ligada a ele.
        public async Task<ProfissionalResponseDTO> GetProfissionalByIdAsync(Guid id)
        {
            var profissional = await _context.Profissionais
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (profissional == null) return null;

            return new ProfissionalResponseDTO
            {
                Id = profissional.Id,
                NomeCompleto = profissional.NomeCompleto,
                Crefito = profissional.Crefito,
                Especialidade = profissional.Especialidade,
                Telefone = profissional.Telefone,
                Email = profissional.Usuario?.Email,
                Ativo = profissional.Ativo
            };
        }

        // Cria a conta e o perfil de um profissional.
        public async Task<ProfissionalResponseDTO> CreateProfissionalAsync(ProfissionalCreateDTO profissional)
        {
            // Impede o cadastro de dados que já pertencem a outra pessoa.
            bool emailExists = await _context.Usuarios.AnyAsync(u => u.Email == profissional.Email);
            if (emailExists) throw new Exception("O e-mail informado já está em uso.");

            bool cpfExists = await _context.Profissionais.AnyAsync(p => p.Cpf == profissional.Cpf);
            if (cpfExists) throw new Exception("O CPF informado já está em uso.");

            bool crefitoExists = await _context.Profissionais.AnyAsync(p => p.Crefito == profissional.Crefito);
            if (crefitoExists) throw new Exception("O CREFITO informado já está em uso.");

            // Cria a conta de acesso do profissional.
            var usuario = new Usuario
            {
                Email = profissional.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(profissional.Senha),
                TipoUsuario = "Profissional"
            };
            
            _context.Usuarios.Add(usuario);

            // Cria o perfil com situação inicial pendente.
            var novoProfissional = new Entities.Profissional
            {
                Usuario = usuario,
                NomeCompleto = profissional.Nome, 
                Cpf = profissional.Cpf,
                Crefito = profissional.Crefito,
                Telefone = profissional.Telefone,
                Especialidade = profissional.Especialidade,
                DataNascimento = profissional.DataNascimento,
                DataCadastro = DateTime.UtcNow,
                
                Ativo = false 
            };
            
            _context.Profissionais.Add(novoProfissional);
            await _context.SaveChangesAsync();

            return new ProfissionalResponseDTO
            {
                Id = novoProfissional.Id,
                NomeCompleto = novoProfissional.NomeCompleto,
                Crefito = novoProfissional.Crefito,
                Especialidade = novoProfissional.Especialidade,
                Telefone = novoProfissional.Telefone,
                Email = usuario.Email,
                Ativo = novoProfissional.Ativo
            };
        }

        // Atualiza os dados de um profissional já cadastrado.
        public async Task<ProfissionalResponseDTO> UpdateProfissionalAsync(Guid id, ProfissionalUpdateDTO profissional)
        {
            // Busca o perfil e a conta que será alterada.
            var existingProfissional = await _context.Profissionais
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProfissional == null) return null;

            if (existingProfissional.Usuario != null && existingProfissional.Usuario.Email != profissional.Email)
            {
                // Confere se o novo e-mail ainda está disponível.
                bool emailInUse = await _context.Usuarios.AnyAsync(u => u.Email == profissional.Email && u.Id != existingProfissional.UsuarioId);
                if (emailInUse) throw new Exception("O novo e-mail informado já está em uso por outra conta.");
                
                existingProfissional.Usuario.Email = profissional.Email;
            }

            existingProfissional.NomeCompleto = profissional.Nome; 
            existingProfissional.Telefone = profissional.Telefone;
            existingProfissional.Especialidade = profissional.Especialidade;
            
            await _context.SaveChangesAsync();

            return new ProfissionalResponseDTO
            {
                Id = existingProfissional.Id,
                NomeCompleto = existingProfissional.NomeCompleto,
                Crefito = existingProfissional.Crefito,
                Especialidade = existingProfissional.Especialidade,
                Telefone = existingProfissional.Telefone,
                Email = existingProfissional.Usuario?.Email,
                Ativo = existingProfissional.Ativo
            };
        }
    }
}