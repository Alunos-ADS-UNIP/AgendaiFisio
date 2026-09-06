using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AgendaiFisio.Services.Auth;
using AgendaiFisio.DTOs.Usuario;

namespace AgendaiFisio.Controllers
{
    // Recebe as solicitações de cadastro e login.
    [ApiController]
    [Route("api/[controller]")] 
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Guarda o serviço que executa as regras de autenticação.
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        
        // Cria uma nova conta de usuário.
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

        // Confere os dados e devolve um token de acesso.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                // Informa quando os dados enviados estão incompletos.
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
                // Informa quando o login não é autorizado.
                return Unauthorized(new { Erro = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Erro = "Ocorreu um erro interno no servidor.", Detalhe = ex.Message });
            }
        }

    }
}