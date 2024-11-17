using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Users;
using DDDSample1.Domain;
using DDDSample1.Domain.Users;
using Backend.Domain.Shared;
using DDDSample1.Domain.Specialization;
using Backend.Domain.Staff;
using AutoMapper;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _staffService;
        private readonly UserService _userService;
        private readonly EmailService _emailService;
        private readonly AuditService _auditService;
        private readonly SpecializationService _specializationService;
        private readonly IMapper _mapper;

        public StaffController(StaffService staffService, UserService userService, EmailService emailService, AuditService auditService, SpecializationService specializationService, IMapper mapper)
        {
            _staffService = staffService;
            _userService = userService;
            _emailService = emailService;
            _auditService = auditService;
            _specializationService = specializationService;
            _mapper = mapper;
        }


        // GET: api/Staff
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<StaffCompleteDTO>>> GetAllStaff()
        {
            var staffList = await _staffService.GetAllAsyncCompleteInformation();
            return Ok(staffList);
        }

        [HttpGet("doctor/{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<StaffDTO>> GetStaffById(string id){
            var staff = await _staffService.GetByUserIdAsync(new UserId(id));
            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        [HttpGet("{licenseNumber}")]
        public async Task<ActionResult<StaffDTO>> GetStaffByLicenseNumber(string licenseNumber)
        {
            var staff = await _staffService.GetByLicenseNumberAsync(new LicenseNumber(licenseNumber));

            if (staff == null)
            {
                return NotFound();
            }

            return Ok(staff);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StaffDTO>> CreateStaffAsync(CreatingStaffDTO staffDto)
        {
            try
            {
                var createdStaff = await _staffService.CreateStaffWithUserAsync(staffDto);
                return CreatedAtAction(nameof(GetStaffByLicenseNumber), new { licenseNumber = createdStaff.LicenseNumber }, createdStaff);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("update/{licenseNumber}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatStaffProfile(string licenseNumber, PendingChangesStaffDTO updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var staff = await _staffService.GetByLicenseNumberAsync(new LicenseNumber(licenseNumber));
            if (staff == null)
            {
                return NotFound("Unable to find the staff information.");
            }

            var userStaff = await _staffService.getUserStaff(staff);
            if (userStaff == null)
            {
                return NotFound("Unable to find the user information.");
            }

            bool emailChanged = updateDto.Email != null && updateDto.Email.Value != userStaff.Email.Value;
            bool phoneChanged = updateDto.PhoneNumber != null && updateDto.PhoneNumber.Number != userStaff.phoneNumber.Number;
            bool specializationChanged = false;



            if (updateDto.Specialization != null)
            {
                specializationChanged = (await _staffService.CheckSpecializationExists(updateDto.Specialization)) ?? false;
            }

            if (!specializationChanged)
            {
                return Ok("Invalid specialization, please insert a valid one.");
            }

             if (updateDto.Specialization != null){
            specializationChanged = (await _staffService.CheckSpecialization(updateDto.Specialization, staff)) ?? false;}


            await _staffService.RemovePendingChangesAsync(new UserId(userStaff.Id));

            if (emailChanged || phoneChanged)
            {
                userStaff.ConfirmationToken = Guid.NewGuid().ToString("N");

                await _userService.UpdateAsync(userStaff);

                await _staffService.AddPendingChangesAsync(updateDto, new UserId(userStaff.Id));

                if (userStaff.Email?.Value != null)
                {
                    await _emailService.SendUpdateStaffEmail(userStaff.Email.Value, userStaff.ConfirmationToken, updateDto, staff, userStaff, emailChanged, phoneChanged, specializationChanged);
                }
                else
                {
                    return BadRequest("Unable to send confirmation email due to missing email information.");
                }

                return Ok("Sensitive changes have been submitted and require confirmation from the staff member.");
            }

            if (!specializationChanged)
            {
                return Ok("Staffs profile already up to date.");
            }

            await _staffService.AddPendingChangesAsync(updateDto, new UserId(userStaff.Id));

            await _auditService.LogProfileStaffUpdate(staff, userStaff, updateDto);

            var user = _mapper.Map<UserDTO, User>(userStaff);

            await _staffService.ApplyPendingChangesAsync(user);

            return Ok("Your changes have been submitted.");
        }


        [HttpGet("confirm-update")]
        public async Task<IActionResult> ConfirmEmail(string token)
        {
            try
            {
                await _staffService.ConfirmUpdateAsync(token);
                return Ok("Update confirmed successfully. Your changes have been applied.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Update confirmation failed:",ex.Message);
                return BadRequest($"Update confirmation failed: {ex.Message}");
            }

        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{licenseNumber}")]
        public async Task<ActionResult<StaffDTO>> SoftDeleteStaff(string licenseNumber)
        {
            try
            {
                var deletedStaff = await _staffService.DeleteAsync(new LicenseNumber(licenseNumber));

                if (deletedStaff == null)
                {
                    return NotFound();
                }

                return Ok(deletedStaff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> SearchStaffAsync([FromQuery] string? name = null, [FromQuery] string? email = null, [FromQuery] string? specialization = null)
        {
            var staffList = await _staffService.SearchStaffAsync(name, email, specialization);

            if (staffList == null || staffList.Count == 0) return NotFound("No staffs found."); ;

            return Ok(staffList);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("deactivate2")]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> DeactivateStaff2Async(
            [FromQuery] string? name = null,
            [FromQuery] string? licenseNumber = null,
            [FromQuery] string? phoneNumber = null,
            [FromQuery] string UserId = null,
            [FromQuery] string? specialization = null)

        {
            var adminEmail = User.FindFirstValue(ClaimTypes.Email);
            var deactivatedStaff = await _staffService.DeactivateStaffAsync(adminEmail, name, licenseNumber, phoneNumber, UserId, specialization);

            if (deactivatedStaff == null) return NotFound();

            return Ok("Staff deactivated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("deactivate/{LicenseNumber}")]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> DeactivateStaffAsync(string LicenseNumber)

        {
            var adminEmail = User.FindFirstValue(ClaimTypes.Email);
            var deactivatedStaff = await _staffService.DeactivateAsync(LicenseNumber, adminEmail);

            if (deactivatedStaff == null) return NotFound();

            return Ok("Staff deactivated successfully");
        }

    }
}
