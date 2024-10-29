// AuthController.cs
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DDDSample1.Controllers
{
  [ApiController]
  [Route("api/auth")]
  public class AuthController : ControllerBase
  {
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
      try
      {
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);

        // Extraia informações do payload, como email e nome
        var userEmail = payload.Email;
        var userName = payload.Name;

        return Ok(new { Email = userEmail, Name = userName });
      }
      catch (InvalidJwtException)
      {
        return Unauthorized("Token inválido.");
      }
    }
  }

  public class GoogleLoginRequest
  {
    public string Token { get; set; }
  }
}
