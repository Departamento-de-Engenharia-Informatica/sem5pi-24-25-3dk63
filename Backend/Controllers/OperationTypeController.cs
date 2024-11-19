using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Users;
using DDDSample1.OperationsType;
using Backend.Domain.Shared;
using System.Security.Claims;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypeController : ControllerBase
    {
        private readonly OperationTypeService _service;


        
        public OperationTypeController(OperationTypeService service)
        {
            _service = service;
        }

        // GET: api/OperationType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationTypeDTO>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/OperationType
        [HttpGet ("all")]
        public async Task<ActionResult<IEnumerable<SearchOperationTypeDTO>>> GetOperationTypeAll()
        {
            return await _service.GetAllOperationTypeAsync();
        }


        // GET: api/OperationType/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDTO>> GetById(Guid id)
        {
            var operation = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operation == null)
            {
                return NotFound();
            }

            return operation;
        }

        // POST: api/OperationType
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<OperationTypeDTO>> Create(CreatingOperationTypeDTO dto)
        {
            try
            {
            var adminEmail = User.FindFirstValue(ClaimTypes.Email);
            var operationType = await _service.AddAsync(dto, adminEmail );

            return Ok(operationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/OperationType/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OperationTypeDTO>> Update(Guid id, OperationTypeDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var operationType = await _service.UpdateAsync(dto);

                if (operationType == null)
                {
                    return NotFound();
                }

                return Ok(operationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/OperationType/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]

        public async Task<ActionResult<OperationTypeDTO>> SoftDelete(Guid id)
        {
            try
            {
                var operation = await _service.DeleteAsync(new OperationTypeId(id));

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

        // PATCH: api/OperationType/{id}
        [Authorize(Roles = "Admin")]
        [HttpPatch("deactivate")]
        public async Task<ActionResult<OperationTypeDTO>> DeactivateAsync([FromQuery] string? name = null, [FromQuery] string? specialization = null,[FromQuery] string? id = null)
        {
            try
            {
                var adminEmail = User.FindFirstValue(ClaimTypes.Email);

                var deactivatedOperation = await _service.DeactivateAsync(adminEmail,name, specialization,id);

                if (deactivatedOperation == null)
                {
                    return NotFound();
                }

                return  Ok(deactivatedOperation);
            }
            catch (BusinessRuleValidationException ex)
            {
                return Ok(new { Message = ex.Message });
            }
        }

     /*   [HttpPatch("{id}")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<OperationTypeDTO>> Patch(Guid id, [FromBody] UpdateOperationTypeDTO dto)
        {
            try
            {
                var updatedOperationType = await _service.UpdateCurrentActiveType(dto, id);
                if (updatedOperationType == null)
                {
                    return NotFound();
                }

                return Ok(updatedOperationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }*/

       /*[HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SearchOperationTypeDTO>>> SearchOperationTypeAsync([FromQuery] string? name = null, [FromQuery] string? specialization = null, [FromQuery] string? active = null)
        {
            var operationTypeList = await _service.SearchOperationTypeAsync(name, specialization, active);

            if (operationTypeList == null || operationTypeList.Count == 0)
            {
                return NotFound("No operation types found.");
            }

            return Ok(operationTypeList);
        }*/

        [HttpGet("active")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<IEnumerable<OperationTypeDTO>>> GetActiveOperationTypes()
        {
            var operationTypeList = await _service.GetAllActiveOperationTypeAsync();

            if (operationTypeList == null || operationTypeList.Count == 0)
            {
                return NotFound("No active operation types found.");
            }

            return Ok(operationTypeList);   
        }

    }
}
