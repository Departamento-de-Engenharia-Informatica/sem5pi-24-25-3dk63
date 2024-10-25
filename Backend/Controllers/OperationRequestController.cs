using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.OperationRequests;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.OperationsType;
using DDDSample1.Domain.Users;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequestController : ControllerBase
    {
        private readonly OperationRequestService _service;
        private readonly OperationTypeService _2service;

        public OperationRequestController(OperationRequestService service, OperationTypeService service2)
        {
            _service = service;
            _2service = service2;
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

        // DELETE: api/OperationRequest/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]

        public async Task<ActionResult<OperationRequestDTO>> SoftDelete(Guid id)
        {
            try
            {
                var operation = await _service.DeleteAsync(new OperationRequestId(id));

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

        
        [HttpDelete("{id}")]
        //[Authorize(Roles = "Doctor")]
        public async Task<ActionResult<OperationRequestDTO>> DeleteOperationRequestAsync(Guid id)
        {
            try
            {
                var operation = await _service.DeleteAsync(new OperationRequestId(id));

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
    }
}
