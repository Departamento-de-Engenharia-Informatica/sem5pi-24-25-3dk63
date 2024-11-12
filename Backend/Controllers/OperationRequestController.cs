using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.OperationRequests;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.OperationsType;
using DDDSample1.Domain.Users;
using System.Security.Claims;
using System.Globalization;
using DDDSample1.Patients;
using DDDSample1.Users;
using DDDSample1.Domain.Staff;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _service;
        private readonly OperationTypeService _2service;
        private readonly UserService _3service;
        private readonly StaffService _4service;
        private readonly PatientService _5service;

        public OperationRequestController(OperationRequestService service, OperationTypeService service2, UserService service3, StaffService service4, PatientService service5)
        {
            _service = service;
            _2service = service2;
            _3service = service3;
            _4service = service4;
            _5service = service5;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequestDTO>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/OperationRequest/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequestDTO>> GetById(Guid id)
        {
            var user = await _service.GetByIdAsync(new OperationRequestId(id));

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/OperationRequest
        [HttpPost]
        [Authorize(Roles="Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> Create(CreatingOperationRequestDTO dto)
        {
            var operationType = await _2service.GetByIdAsync(dto.OperationTypeId);

            if(operationType == null) throw new BusinessRuleValidationException("Operation type not found");

            if (!operationType.Active)
            {
                return BadRequest(new { Message = "This operation type is currently inactive" });
            }

            var staff = await _4service.GetByLicenseNumberAsync(dto.LicenseNumber);
            if(staff == null) throw new BusinessRuleValidationException("Doctor not found");
            if(!staff.Active) throw new BusinessRuleValidationException("Doctor is inactive");

            var patient = await _5service.GetByIdAsync(dto.MedicalRecordNumber);
            if(patient == null) throw new BusinessRuleValidationException("Patient not found");
            if(!patient.Active) throw new BusinessRuleValidationException("Patient is inactive");

            var operationRequest = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = operationRequest.Id }, operationRequest);
        }

        // PUT: api/OperationRequest/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDTO>> Update(Guid id, OperationRequestDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var user = await _service.UpdateAsync(dto);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> DeleteOperationRequestAsync()
        {

            var id = RouteData.Values["id"];
            try
            {
                var operation = await _service.DeleteAsync(new OperationRequestId(id.ToString()));

                if (operation == null)
                {
                    return NotFound();
                }

                return Ok(operation);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateOperationRequisition(string id, [FromBody] UpdateOperationRequisitionDto updateDto)
        {
            var userEmail = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("Unable to find the user information.");
            }

            try
            {
                var resultMessage = await _service.UpdateRequisitionAsync(id,userEmail, updateDto);
                return Ok(resultMessage);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Search(
            [FromQuery] string firstName = null,
            [FromQuery] string lastName = null,
            [FromQuery] string operationType = null,
            [FromQuery] string status = null,
            [FromQuery] string priority = null,
            [FromQuery] string dateRequested = null,
            [FromQuery] string dueDate = null)
        {
            status = status?.Trim();

            var user = await _3service.FindByEmailAsync(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value);
            var doctorProfile = await _4service.GetByUserIdAsync(new UserId(user.Id));

            if (!string.IsNullOrWhiteSpace(status) && 
                !status.Equals("active", StringComparison.OrdinalIgnoreCase) && 
                !status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Status must be 'active' or 'inactive'.");
            }

            Priority priorityEnum = null;
            if (!string.IsNullOrWhiteSpace(priority))
            {
                if (Enum.TryParse(typeof(PriorityType), priority, true, out var parsedPriority))
                {
                    priorityEnum = new Priority((PriorityType)parsedPriority);
                }
                else
                {
                    return BadRequest("Invalid priority value. Must be elective, urgent, or emergency.");
                }
            }

            DateTime? parsedDateRequested = null;
            if (!string.IsNullOrWhiteSpace(dateRequested))
            {
                dateRequested = dateRequested.Trim();
                Console.WriteLine(dateRequested);
                if (DateTime.TryParseExact(dateRequested, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
                {
                    parsedDateRequested = parsedDate;
                    Console.WriteLine(parsedDateRequested);
                }
                else
                {
                    return BadRequest("Invalid date format for dateRequested. Expected format: dd-MM-yyyy.");
                }
            }

            DateTime? parsedDueDate = null;
            if (!string.IsNullOrWhiteSpace(dueDate))
            {
                dueDate = dueDate.Trim();   
                if (DateTime.TryParseExact(dueDate, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDue))
                {
                    parsedDueDate = parsedDue;
                    Console.WriteLine(parsedDueDate);
                }
                else
                {
                    return BadRequest("Invalid date format for dueDate. Expected format: dd-MM-yyyy.");
                }
            }

            var licenseNumber = doctorProfile.LicenseNumber;
            var doctorId = new LicenseNumber(licenseNumber);

            var requests = await _service.SearchOperationRequests(
                firstName, lastName, operationType, status, priorityEnum, parsedDateRequested, parsedDueDate, doctorId);

            return Ok(requests);
        }

    }
}
