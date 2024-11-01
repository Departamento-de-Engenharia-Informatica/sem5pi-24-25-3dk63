using System.Collections.Generic;
using Google.Apis.Auth;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Users;
using DDDSample1.Users;

namespace DDDSample1.Presentation.Controllers
{
    public class LoginController : Controller
    {
        UserService userService;

        public LoginController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpGet("api/login")]
        public async Task<IActionResult> Login()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("Index", "Home") };

            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, properties);
            return new EmptyResult();
        }

        [HttpPost("api/weblogin")]
        public async Task<IActionResult> WebLogin([FromBody] TokenRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
                var emailGoogle = payload.Email;

                var userDto = await userService.checkIfAccountExists(emailGoogle);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, emailGoogle)
                };

                if (userDto != null)
                { 
                    claims.Add(new Claim(ClaimTypes.Role, userDto.Role.ToString()));
                    claims.Add(new Claim("Active", userDto.Active ? "1" : "0"));
                    claims.Add(new Claim("UserId", userDto.Id.ToString()));
                }
                else
                { 
                    claims.Add(new Claim(ClaimTypes.Role, "Temporary"));
                }

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                
                return Ok(new { 
                    Message = "Login bem-sucedido"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Erro na validação do token", Error = ex.Message });
            }
        }

        [HttpGet("api/claims")]
        public IActionResult GetClaims()
        {
            if (User.Identity.IsAuthenticated)
            {
                var claims = User.Claims;

                var claimsData = new List<object>();
                foreach (var claim in claims)
                {
                    claimsData.Add(new
                    {
                        Type = claim.Type,
                        Value = claim.Value
                    });
                }

                return Ok(claimsData);
            }
            else
            {
                return Unauthorized(new { Message = "Usuário não autenticado" });
            }
        }
    }
}

public class TokenRequest
{
    public string Token { get; set; }
}