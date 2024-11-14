using Microsoft.AspNetCore.Mvc;
using Backend.Domain.SurgeryRoom;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgeryRoomController : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRoomController(SurgeryRoomService service)
        {
            _service = service;
        }

        // GET: api/SurgeryRoom
        [HttpGet]
        public async Task<IActionResult> GetAllSurgeryRooms()
        {
            try
            {
                var surgeryRooms = await _service.GetAllAsync();

                return Ok(surgeryRooms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }

        // GET: api/SurgeryRoom/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SurgeryRoomDTO>> GetById(Guid id)
        {
            var surgeryRoom = await _service.GetByIdAsync(new RoomId(id));

            if (surgeryRoom == null)
            {
                return NotFound();
            }

            return Ok(surgeryRoom);
        }

        // GET: api/SurgeryRoom/number/{roomNumber}
        [HttpGet("number/{roomNumber}")]
        public async Task<IActionResult> GetByRoomNumber(string roomNumber)
        {
            try
            {
                var surgeryRoom = await _service.GetByRoomNumberAsync(roomNumber);

                if (surgeryRoom == null)
                {
                    return NotFound(new { Message = "Surgery room not found." });
                }

                return Ok(surgeryRoom);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }


        [HttpPost]
        public async Task<ActionResult<SurgeryRoomDTOStrings>> Create(CreatingSurgeryRoomDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "Request body cannot be null." });
                }

                if (string.IsNullOrWhiteSpace(dto.RoomNumber?.Value))
                {
                    return BadRequest(new { Message = "RoomNumber is required." });
                }
                var surgeryRoom = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetById), new { id = surgeryRoom.RoomId }, surgeryRoom);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(new { Message = "Invalid data: " + ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred: " + ex.Message });
            }
        }

        // PUT: api/SurgeryRoom/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SurgeryRoomDTO>> Update(Guid id, SurgeryRoomDTO dto)
        {
            if (id != dto.RoomId)
            {
                return BadRequest();
            }

            try
            {
                await _service.UpdateAsync(dto);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/SurgeryRoom/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(new RoomId(id));
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("createJson")]
         public async Task<ActionResult> CreateJson()
        {
                await _service.CreateJsonAsync();

                return Ok();
        }
    }
}
