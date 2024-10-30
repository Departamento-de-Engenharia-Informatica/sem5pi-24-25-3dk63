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
           
            var properties = new AuthenticationProperties
            {
                RedirectUri = "/api/claims" 
            }; 

  
        await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, properties);
        return new EmptyResult(); 
        }

        [HttpPost("api/login")]
        public async Task<IActionResult> Login([FromBody] TokenRequest request)
        {

             
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
            var emailGoogle = payload.Email;
            var userDto = userService.checkIfAccountExists(emailGoogle).Result;                                                                                                               
            var claims = new List<Claim>();
            if (userDto != null)
            { 
                claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Role, userDto.Role.ToString()),
                    new Claim("Active", userDto.Active ? "1" : "0"),
                    new Claim("UserId", userDto.Id.ToString())
                };
            }
            else
            { 
              //  identity.AddClaim(new Claim(ClaimTypes.Role, "Temporary"));
                claims = [new Claim(ClaimTypes.Role, "Temporary")];
            }

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            
            return Ok(new { Message = "Login bem-sucedido" });
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

public class TokenRequest
{
    public string Token { get; set; }
}

}