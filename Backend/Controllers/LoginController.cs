using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Controllers
{
    public class LoginController : Controller
    {
        [HttpGet("api/login")]
        public async Task<IActionResult> Login()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("Index", "Home") };

            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, properties);
            return new EmptyResult();
        }

        [HttpPost("api/login")]
        public async Task<IActionResult> Login([FromBody] TokenRequest request)
        {

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "user_id"),
                new Claim(ClaimTypes.Email, "user_email@example.com"),

            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return Ok(new { Message = "Login bem-sucedido" });
        }
    }
    public class TokenRequest
    {
        public string Token { get; set; }
    }
}
