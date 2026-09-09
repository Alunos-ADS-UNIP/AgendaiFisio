using System.ComponentModel.DataAnnotations;

namespace AgendaiFisio.DTOs.Profissional
{
    // Campos que o próprio fisioterapeuta pode alterar no perfil.
    // Cpf, Crefito e DataNascimento ficam de fora por serem dados de identidade/registro profissional.
    public class ProfissionalUpdateDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string NomeCompleto { get; set; } = string.Empty;

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        public string Telefone { get; set; } = string.Empty;

        [Required(ErrorMessage = "A especialidade é obrigatória.")]
        public string Especialidade { get; set; } = string.Empty;

        public bool Ativo { get; set; }
    }
}