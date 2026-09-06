using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgendaiFisio.Entities
{
    // Guarda os dados usados para acessar o sistema.
    public class Usuario
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; }
        public string SenhaHash { get; set; }

        public string TipoUsuario { get; set; }

        public virtual Paciente Paciente { get; set; }  

        public virtual Profissional Profissional { get; set; } 
    }
}