using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Patients;
using DDDSample1.Domain;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.DataProtection;

namespace DDDSample1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly RegistrationService _registrationService;

        public RegistrationsController(EmailService emailService, RegistrationService registrationService)
        {
            _emailService = emailService;
            _registrationService = registrationService;
        }

        [HttpPost("self-register")]
        public async Task<IActionResult> SelfRegister(SelfRegisterPatientDTO dto)
        {
            try
            {
                var token = HttpContext.Request.Cookies[".AspNetCore.Cookies"];
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized("IAM token not found. Please log in again.");
                }

                // Decrypt the token to get the IAM email
                var dataProtectionProvider = HttpContext.RequestServices.GetRequiredService<IDataProtectionProvider>();
                var protector = dataProtectionProvider.CreateProtector("CustomCookieProtector");

                var iamEmail = protector.Unprotect(token);

                var user = await _registrationService.FindByEmailAsync(new Email(dto.PersonalEmail));

                if(user == null)
                {
                    return BadRequest("Patient is not registered in the system. Please contact the hospital to register.");
                }

                if(user.Role.Equals(new Role(RoleType.Patient)))
                {
                    await _registrationService.SelfRegisterPatientAsync(dto, iamEmail);
                }

                return Ok("Registration initiated. Please check your email for confirmation.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token)
        {
            try
            {
                await _registrationService.ConfirmEmailAsync(token);
                return Ok("Email confirmed successfully. Your registration is now complete.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Email confirmation failed: {ex.Message}");
            }
        }
    }
}