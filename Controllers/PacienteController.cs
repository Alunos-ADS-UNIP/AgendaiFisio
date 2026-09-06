using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AgendaiFisio.DTOs.Paciente;
using AgendaiFisio.Services.Paciente;

namespace AgendaiFisio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PacienteController : ControllerBase
    {
        private readonly IPacienteService _pacienteService;

        public PacienteController(IPacienteService pacienteService)
        {
            _pacienteService = pacienteService;
        }

        [HttpPut("completar-perfil")]
        [Authorize(Roles = "Paciente")] 
        public async Task<IActionResult> UpdatePacienteAsync([FromBody] PacienteUpdateDTO dto)
        {
            try
            {
                var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(usuarioIdClaim))
                    return Unauthorized("Usuário não identificado no token.");

                var usuarioId = Guid.Parse(usuarioIdClaim);

                await _pacienteService.UpdatePacienteAsync(usuarioId, dto);

                return Ok(new { mensagem = "Perfil atualizado com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }
    }
}