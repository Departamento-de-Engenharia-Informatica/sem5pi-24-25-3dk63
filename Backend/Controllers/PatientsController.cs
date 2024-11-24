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
using DDDSample1.Domain.Appointments;
using Newtonsoft.Json;

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


        //get

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientCompleteDTO>>> GetAllPatients()
        {
            var patients = await _service.GetAllPatientsAsync();
            return Ok(patients);
        }

        [HttpGet("search")]
        [Authorize (Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PatientCompleteDTO>>> SearchPatientAsync([FromQuery] string? name = null, [FromQuery] string? email = null, [FromQuery] string? dateOfBirth = null, [FromQuery] string? medicalRecordNumber = null)
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
        public async Task<ActionResult<PatientDTO>> GetById()
        {
            // Obtém o ID a partir da rota
            var id = RouteData.Values["id"];

            var patient = await _service.GetByIdAsync(new MedicalRecordNumber(id.ToString()));

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        [HttpPost("register-patient")]
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles="Admin")]
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

            var medicalRecordNumber = new MedicalRecordNumber(id);

            var result = await _service.DeletePatientAsync(medicalRecordNumber, adminEmail);


            if (result == null)
            {
                return NotFound("Patient not found.");
            }

            return Ok("Patient deleted successfully");
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

            if (patient == null || patient.Active == false)
            {
                return Unauthorized("Patient not found.");
            }

            var userResult = await _userService.GetByIdAsync(patient.UserId);

            bool emailChanged = updateDto.Email != null && updateDto.Email.Value != userResult.Email.Value;
            bool phoneChanged = updateDto.PhoneNumber != null && updateDto.PhoneNumber != userResult.phoneNumber;
            bool FirstNameChanged = updateDto.FirstName != null && updateDto.FirstName != userResult.Name.FirstName;
            bool LastNameChanged = updateDto.LastName != null && updateDto.LastName != userResult.Name.LastName;
            bool emergencyContactChanged = updateDto.EmergencyContact != null && updateDto.EmergencyContact != patient.emergencyContact;
            bool medicalHistoryChanged = updateDto.MedicalHistory != null && updateDto.MedicalHistory != patient.medicalHistory;
            
            if(FirstNameChanged){
                updateDto.LastName = userResult.Name.LastName;
            }
            else if(LastNameChanged){
                updateDto.FirstName = userResult.Name.FirstName;
            }
            else{
                updateDto.FirstName = userResult.Name.FirstName;
                updateDto.LastName = userResult.Name.LastName;
            }

            await _service.RemovePendingChangesAsync(patient.UserId);

            if (emailChanged || phoneChanged || emergencyContactChanged || medicalHistoryChanged || FirstNameChanged || LastNameChanged)
            {
                userResult.ConfirmationToken = Guid.NewGuid().ToString("N");

                await _userService.UpdateAsync(userResult);

                await _service.AddPendingChangesAsync(updateDto, patient.UserId);

                var changedFields = new List<string>();
                if (emailChanged) changedFields.Add("<li>Email</li>");
                if (phoneChanged) changedFields.Add("<li>Phone Number</li>");
                if (FirstNameChanged) changedFields.Add("<li>First Name</li>");
                if (LastNameChanged) changedFields.Add("<li>Last Name</li>");
                if (emergencyContactChanged) changedFields.Add("<li>Emergency Contact</li>");
                if (medicalHistoryChanged) changedFields.Add("<li>Medical History</li>");

                var changedFieldsHtml = string.Join("", changedFields);

                await _emailService.SendUpdateEmail(userResult.Email.ToString(), userResult.ConfirmationToken, changedFieldsHtml);

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
                return Ok(new { message = "Update confirmed successfully. Your changes have been applied." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Update confirmation failed: {ex.Message}" });
            }
        }

        [HttpPost("request-account-deletion")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> RequestAccountDeletion()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Unable to find the patient information.");
            }

            var user = await _userService.GetUserByUsernameAsync(userEmail);

            if (string.IsNullOrEmpty(user.Id.ToString()))
            {
                return Unauthorized("User not found.");
            }

            if(_service.FindByUserId(new UserId(user.Id)).Result.Active == false)
            {
                return Unauthorized("Patient not active.");
            }

            await _service.RequestAccountDeletionAsync(new UserId(user.Id));

            return Ok("Account deletion requested. Please check your email to confirm.");
        }

        [HttpGet("confirm-account-deletion")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> ConfirmAccountDeletion(string token)
        {
            try
            {
                await _service.ConfirmDeletionAsync(token);
                return Ok(new { message = "Account deletion confirmed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = $"Deletion failed: {ex.Message}" });

            }
        }

        [HttpGet("appointments")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<PatientDTO>>> GetAppointmentHistory()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Patient information not found.");
            }

            var patient = await _service.GetPacientByUserEmail(new Email(userEmail));

             if (patient == null || patient.Active == false)
            {
                return NotFound("Patient not found.");
            }


            return Ok(patient.appointmentHistoryList);
        }

        [HttpGet("medicalhistory")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<PatientDTO>> GetMedicalHistory()
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Patient information not found.");
            }

            var patient = await _service.GetPacientByUserEmail(new Email(userEmail));

            if (patient == null || patient.Active == false)
            {
                return NotFound("Patient not found.");
            }

            return Ok(patient.medicalHistory);

        }
    }
}