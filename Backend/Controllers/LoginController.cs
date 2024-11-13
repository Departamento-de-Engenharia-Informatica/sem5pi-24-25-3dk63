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
using Microsoft.AspNetCore.DataProtection;

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

                var userDto = await userService.GetUserByUsernameAsync(emailGoogle);

                // Check if the IAM email was found and the account is active
                if (userDto == null || !userDto.Active)
                {
                    Console.WriteLine("IAM email not found or inactive. Checking personal email.");
                    userDto = await userService.checkIfAccountExists(emailGoogle);

                    // Return 302 if the patient is active and trying to login through personal email
                    if (userDto.Role.Value == RoleType.Patient && userDto.Active)
                    {
                        return StatusCode(302, new { Message = "Patient cannot login with personal email." });
                    }

                    // Check if the personal email was found and the account is active
                    if (userDto == null || !userDto.Active)
                    {
                        Console.WriteLine("Personal email not found or inactive.");
                        Console.WriteLine("Login failed: email not found.");

                        var dataProtectionProvider = HttpContext.RequestServices.GetRequiredService<IDataProtectionProvider>();
                        var protector = dataProtectionProvider.CreateProtector("CustomCookieProtector");
                        var encryptedEmail = protector.Protect(emailGoogle);

                        Console.WriteLine("Creating CustomCookie before any SignInAsync calls.");

                        HttpContext.Response.Cookies.Append(".AspNetCore.CustomCookies", encryptedEmail, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            Expires = DateTimeOffset.UtcNow.AddMinutes(60),
                            SameSite = SameSiteMode.None,
                            Path = "/"
                        });

                        Console.WriteLine("CustomCookie has been appended to response.");

                        return StatusCode(302, new { 
                            Message = "This email is not registered in the system."
                        });
                    }
                }

                // Process login for an authenticated user
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, emailGoogle),
                    new Claim(ClaimTypes.Role, userDto.Role.ToString()),
                    new Claim("Active", userDto.Active ? "1" : "0"),
                    new Claim("UserId", userDto.Id.ToString())
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Logging to track SignInAsync call
                Console.WriteLine("Calling SignInAsync for authenticated user.");

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
                
                return Ok(new { 
                    Message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = "Token validation error", Error = ex.Message });
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