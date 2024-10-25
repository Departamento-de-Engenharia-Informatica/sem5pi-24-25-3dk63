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


        [Authorize(Roles = "Admin")]
        [HttpPatch("deactivate")]
        public async Task<ActionResult<IEnumerable<StaffDTO>>> DeactivateStaffAsync(
            [FromQuery] string? name = null,
            [FromQuery] string? licenseNumber = null,
            [FromQuery] string? phoneNumber = null,
            [FromQuery] string UserId = null,
            [FromQuery] string? specialization = null)

        {
            var adminEmail = User.FindFirstValue(ClaimTypes.Email);
            var deactivatedStaff = await _staffService.DeactivateStaffAsync(adminEmail, name,licenseNumber, phoneNumber, UserId, specialization);
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

    return Ok("Staff deactivated successfully");
}
        
    }
}
