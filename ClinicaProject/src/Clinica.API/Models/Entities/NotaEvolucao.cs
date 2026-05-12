using System;

namespace Clinica.API.Models.Entities
{

    public class NotaEvolucao
    {
        // ── Propriedades  ──────────────────────────
        public int Id { get; private set; }
        public int IdProntuario { get; private set; }
        public int IdTerapeuta { get; private set; }
        public int? IdAgendamento { get; private set; }
        public string TextoEvolucao { get; private set; } = string.Empty;
        public DateTime DataRegistro { get; private set; }

        // ── Construtor privado ────────────────
        private NotaEvolucao() { }

        // ── Factory: criação de novo registro ────────────────────────────────

        public static NotaEvolucao Criar(int idProntuario, int idTerapeuta, string textoEvolucao, int? idAgendamento = null)
        {
            // 1. FK id_prontuario — NOT NULL
            if (idProntuario <= 0)
                throw new ArgumentException("Id do prontuário deve ser um valor positivo válido.");

            // 2. FK id_terapeuta — NOT NULL
            if (idTerapeuta <= 0)
                throw new ArgumentException("Id do terapeuta deve ser um valor positivo válido.");

            // 3. FK id_agendamento — NULLABLE, mas se fornecido deve ser válido
            if (idAgendamento.HasValue && idAgendamento.Value <= 0)
                throw new ArgumentException("Id do agendamento, quando informado, deve ser um valor positivo válido.");

            // 4. TextoEvolucao — NOT NULL, max 5000
            if (string.IsNullOrWhiteSpace(textoEvolucao))
                throw new ArgumentException("Texto da evolução é obrigatório.");
            textoEvolucao = textoEvolucao.Trim();
            if (textoEvolucao.Length > 5000)
                throw new ArgumentException("Texto da evolução deve ter no máximo 5000 caracteres.");

            return new NotaEvolucao
            {
                IdProntuario = idProntuario,
                IdTerapeuta = idTerapeuta,
                IdAgendamento = idAgendamento,
                TextoEvolucao = textoEvolucao,
                DataRegistro = DateTime.UtcNow
            };
        }

        // ── Factory: reconstrução a partir de dados do banco (SELECT) ────────
        /// <summary>
        /// Reconstrói a entidade a partir de uma linha do banco de dados.
        /// </summary>
        public static NotaEvolucao FromDatabase(int id, int idProntuario, int idTerapeuta, int? idAgendamento, string textoEvolucao, DateTime dataRegistro)
        {
            if (id <= 0)
                throw new InvalidOperationException("Id inválido ao reconstruir NotaEvolucao do banco.");

            return new NotaEvolucao
            {
                Id = id,
                IdProntuario = idProntuario,
                IdTerapeuta = idTerapeuta,
                IdAgendamento = idAgendamento,
                TextoEvolucao = textoEvolucao ?? string.Empty,
                DataRegistro = dataRegistro
            };
        }
    }
}