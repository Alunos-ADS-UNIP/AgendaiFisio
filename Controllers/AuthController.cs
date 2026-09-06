using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AgendaiFisio.Services.Auth;
using AgendaiFisio.DTOs.Usuario;

namespace AgendaiFisio.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsuarioRegisterDTO registroDto)
        {
            try
            {
                var usuario = await _authService.RegistrarAsync(registroDto);
                return Ok(new { mensagem = "Usuário cadastrado com sucesso!", dados = usuario });
            }
            catch (Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                string token = await _authService.RealizarLoginAsync(loginDTO);

                return Ok(new 
                { 
                    Message = "Login realizado com sucesso.",
                    Token = token 
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Erro = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Erro = "Ocorreu um erro interno no servidor.", Detalhe = ex.Message });
            }
        }

    }
}