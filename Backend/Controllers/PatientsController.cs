using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Patients;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain;
using DDDSample1.Users;
using Backend.Domain.Shared;

namespace DDDSample1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {

        private readonly ILogger<PatientsController> _logger;
        private readonly PatientService _service;
        private readonly EmailService _emailService;
        private readonly UserService _userService;
        private readonly AuditService _auditService;

        public PatientsController(ILogger<PatientsController> logger, PatientService service, EmailService emailService, UserService userService, AuditService auditService)
        {
            _logger = logger;
            _service = service;
            _emailService = emailService;
            _userService = userService;
            _auditService = auditService;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SearchPatientDTO>>> SearchPatientAsync([FromQuery] string? name = null, [FromQuery] string? email = null, [FromQuery] string? dateOfBirth = null, [FromQuery] string? medicalRecordNumber = null)
        {
            var patientList = await _service.SearchPatientAsync(name, email, dateOfBirth, medicalRecordNumber);
            
            if (patientList == null || patientList.Count == 0)
            {
                return NotFound("No patients found.");
            }
            
            return Ok(patientList);
        }
        
        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDTO>> GetById(MedicalRecordNumber id)
        {
            var patient = await _service.GetByIdAsync(id);

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        [HttpPost("register-patient")]

        public async Task<ActionResult<PatientDTO>> RegisterPatient(RegisterPatientDTO dto)
        {
            var patient = await _service.RegisterPatientAsync(dto);
            if (patient == null)
            {
                return Problem("Error: patient is null");
            }
            return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
        }

        [HttpPatch("{id}")]
        //[Authorize(Roles="Admin")]
        public async Task<IActionResult> UpdatePatientProfile(PatientUpdateDTO updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _service.UpdatePatientProfileAsync(updateDto);

            if (result)
            {
                return Ok("Patient updated successfully");
            }

            return BadRequest("Patient not updated!");
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatientProfile(string id)
        {
            var adminEmail = User.FindFirstValue(ClaimTypes.Email);
            _logger.LogInformation($"Tentando deletar o paciente com ID: {id}");

            var medicalRecordNumber = new MedicalRecordNumber(id);
            _logger.LogInformation($"Tentando deletar o paciente com medical record number ID: {medicalRecordNumber}");

            var result = await _service.DeletePatientAsync(medicalRecordNumber, adminEmail);

            if (result == null)
            {
                return NotFound("Patient not found.");
            }

            return NoContent();
        }

        [HttpPatch("update")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UpdateOwnPatientProfile(PendingChangesDTO updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Unable to find the patient information.");
            }

            var patient = await _service.GetPatientByUsername(new Username(userEmail));

            if (patient == null)
            {
                return Unauthorized("Patient not found.");
            }

            var userResult = await _userService.GetByIdAsync(patient.UserId);

            bool emailChanged = updateDto.Email != null && updateDto.Email.Value != userResult.Email.Value;
            bool phoneChanged = updateDto.PhoneNumber != null && updateDto.PhoneNumber != userResult.phoneNumber;

            await _service.RemovePendingChangesAsync(patient.UserId);

            if (emailChanged || phoneChanged)
            {
                userResult.ConfirmationToken = Guid.NewGuid().ToString("N");

                await _userService.UpdateAsync(userResult);

                await _service.AddPendingChangesAsync(updateDto, patient.UserId);

                await _emailService.SendUpdateEmail(userEmail, userResult.ConfirmationToken);

                return Ok("Sensitive changes have been submitted and require confirmation (please check your email to confirm the changes).");
            }

            await _service.AddPendingChangesAsync(updateDto, patient.UserId);

            _auditService.LogProfileUpdate(patient, userResult, updateDto);

            await _service.ApplyPendingChangesAsync(patient.UserId);
            
            return Ok("Your changes have been submitted.");
        }

        [HttpGet("confirm-update")]
        public async Task<IActionResult> ConfirmEmail(string token)
        {
            try
            {
                await _service.ConfirmUpdateAsync(token);
                return Ok("Update confirmed successfully. Your changes have been applied.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Update confirmation failed: {ex.Message}");
            }
            
        }

        [HttpPost("request-account-deletion")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> RequestAccountDeletion()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found.");
            }

            await _service.RequestAccountDeletionAsync(new UserId(userId));

            return Ok("Account deletion requested. Please check your email to confirm.");
        }
    

        [HttpPost("confirm-account-deletion")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> ConfirmAccountDeletion(string token)
        {
            try
            {
                await _service.ConfirmDeletionAsync(token);
                return Ok("Account deletion confirmed successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error confirming deletion: {ex.Message}");
            }
            
        }

    }
}