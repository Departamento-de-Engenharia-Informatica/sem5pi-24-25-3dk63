using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using Backend.Domain.Staff.ValueObjects;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Users;
using DDDSample1.Domain;
using DDDSample1.Domain.Users;
using Backend.Domain.Shared;
using DDDSample1.Domain.Specialization;
using Backend.Domain.Staff;

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

        public StaffController(StaffService staffService)
        {
            _staffService = staffService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffCompleteDTO>>> GetAllStaff()
        {
            var staffList = await _staffService.GetAllAsyncCompleteInformation();
            return Ok(staffList);
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
        [Authorize(Roles="Admin")]
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

        //https://localhost:5001/api/Staff/update/N200012345
        [HttpPatch("update/{licenseNumber}")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<StaffDTO>> UpdateStaff(string licenseNumber, StaffUpdateDTO dto)
        {
            try
            {
                var adminEmail = User.FindFirstValue(ClaimTypes.Email);
                var updatedStaff = await _staffService.UpdateAsync(dto, adminEmail, licenseNumber);
                if (updatedStaff == null)
                {
                    return NotFound();
                }

                return Ok(updatedStaff);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPatch("update2/{licenseNumber}")]
        [Authorize(Roles = "Admin")]
         public async Task<IActionResult> UpdatStaffProfile(string licenseNumber,PendingChangesStaffDTO updateDto)
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
            var specializationDescription = _specializationService.GetBySpecializationIdAsync(new SpecializationId(staff.SpecializationId));
            bool specializationChanged = updateDto.Specialization != null && !updateDto.Specialization.Equals(specializationDescription);
            if (emailChanged || phoneChanged)
            {
                await _userService.UpdateAsync(userStaff);
                await _staffService.AddPendingChangesAsync(updateDto, new UserId(userStaff.Id));
                await _emailService.SendUpdateEmail(userStaff.Email.Value, userStaff.ConfirmationToken);
                
                return Ok("Sensitive changes have been submitted and require confirmation from the staff member).");
            }
            if (!specializationChanged)
            {
                return BadRequest("No changes were made, staff already have all that informatin.");
            }
            await _staffService.AddPendingChangesAsync(updateDto, new UserId(userStaff.Id));
            _auditService.LogProfileStaffUpdate(staff, userStaff, updateDto);
            await _staffService.ApplyPendingChangesAsync(new UserId(userStaff.Id));
            
            return Ok("Your changes have been submitted.");
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
            return Ok(staffList);
        }


public async Task<ActionResult<IEnumerable<StaffDTO>>> DeactivateStaffAsync(
    [FromQuery] string? name = null, 
    [FromQuery] string? licenseNumber = null, 
    [FromQuery] string? phoneNumber = null,
    [FromQuery] string UserId = null,
    [FromQuery] string? specialization = null)
    
{
    var adminEmail = User.FindFirstValue(ClaimTypes.Email);
    var deactivatedStaff = await _staffService.DeactivateStaffAsync(adminEmail, name,licenseNumber, phoneNumber, UserId, specialization);

    if (deactivatedStaff == null) return NotFound();

    return Ok("Staff deactivated successfully");
}

    }
}
