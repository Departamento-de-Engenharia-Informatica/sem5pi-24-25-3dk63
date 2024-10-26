using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.OperationRequests;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.OperationsType;
using DDDSample1.Domain.Users;
using System.Security.Claims;
using DDDSample1.Patients;
using DDDSample1.Users;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _service;
        private readonly OperationTypeService _2service;
        private readonly UserService _3service;

        public OperationRequestController(OperationRequestService service, OperationTypeService service2, UserService service3)
        {
            _service = service;
            _2service = service2;
            _3service = service3;
        }

        // GET: api/OperationRequest
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
        //[Authorize(Roles="Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> Create(CreatingOperationRequestDTO dto)
        {
            var operationType = await _2service.GetByIdAsync(dto.OperationTypeId);

            if(operationType == null) throw new BusinessRuleValidationException("Operation type not found");

            if (!operationType.Active)
            {
                return BadRequest(new { Message = "This operation type is currently inactive" });
            }

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

            var user = await _3service.FindByEmailAsync(userEmail); //mudar linha

            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            try
            {
                var resultMessage = await _service.UpdateRequisitionAsync(id, user, updateDto);
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

        [HttpGet]
        public async Task<IActionResult> Search(
            [FromQuery] string name = null,
            [FromQuery] string operationType = null,
            [FromQuery] string status = null,
            [FromQuery] string priority = null)
        {
            Priority priorityEnum = null;
            if (!string.IsNullOrWhiteSpace(priority))
            {
                if (Enum.TryParse(typeof(PriorityType), priority, true, out var parsedPriority))
                {
                    priorityEnum = new Priority((PriorityType)parsedPriority);
                }
                else
                {
                    return BadRequest("Invalid priority value.");
                }
            }

            string firstName = null, lastName = null;
            if (!string.IsNullOrWhiteSpace(name))
            {
                var names = name.Split(' ');
                firstName = names[0];
                if (names.Length > 1) lastName = names[1];
            }

            var requests = await _service.SearchOperationRequests(firstName, lastName, operationType, status, priorityEnum);
            return Ok(requests);
        }
    }
}
