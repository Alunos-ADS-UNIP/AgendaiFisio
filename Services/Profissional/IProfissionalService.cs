using System;
using System.Threading.Tasks;
using AgendaiFisio.DTOs.Profissional;

namespace AgendaiFisio.Services.Profissional
{
    // Lista as ações disponíveis para profissionais.
    public interface IProfissionalService
    {
        // Busca um profissional pelo seu identificador.
        Task<ProfissionalResponseDTO> GetProfissionalByIdAsync(Guid id);
        // Cria um novo profissional.
        Task<ProfissionalResponseDTO> CreateProfissionalAsync(ProfissionalCreateDTO profissional);
        // Atualiza um profissional existente.
        Task<ProfissionalResponseDTO> UpdateProfissionalAsync(Guid id, ProfissionalUpdateDTO profissional);
    }
}