using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DDDSample1.Domain;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Appointments;
using Backend.Domain.SurgeryRoom;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly ILogger<PlanningController> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _prologServerUrl = "http://localhost:4000/api";

        public PlanningController(ILogger<PlanningController> logger, IHttpClientFactory clientFactory)
        {
            _logger = logger;
            _clientFactory = clientFactory;
        }

        public class PlanningRequest
        {
            public RoomId RoomId { get; set; }
            public Date Date { get; set; }
            public List<OperationRequestId> OperationRequestIds { get; set; }
        }

        public class PlanningResponse
        {
            public RoomId RoomId { get; set; }
            public Date Date { get; set; }
            public List<AppointmentPlan> Appointments { get; set; }
        }

        public class AppointmentPlan
        {
            public OperationRequestId OperationRequestId { get; set; }
            public Time StartTime { get; set; }
            public Time EndTime { get; set; }
            public List<LicenseNumber> AssignedStaff { get; set; }
        }

        [HttpPost("plan")]
        public async Task<ActionResult<PlanningResponse>> GeneratePlan([FromBody] PlanningRequest request)
        {
            try
            {
                _logger.LogInformation($"Generating plan for room {request.RoomId} on {request.Date}");

                var planningData = await PreparePlanningData(request);
                var response = await SendToPrologServer(planningData);
                var plan = await ProcessPrologResponse(response);

                return Ok(plan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating plan");
                return StatusCode(500, "Error generating surgical plan");
            }
        }

        [HttpPost("validate")]
        public async Task<ActionResult<bool>> ValidatePlan([FromBody] PlanningResponse plan)
        {
            try
            {
                var isValid = await ValidatePlanningRules(plan);
                if (!isValid)
                {
                    return BadRequest("Invalid planning solution");
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating plan");
                return StatusCode(500, "Error validating surgical plan");
            }
        }

        [HttpPost("apply")]
        public async Task<ActionResult> ApplyPlan([FromBody] PlanningResponse plan)
        {
            try
            {
                foreach (var appointment in plan.Appointments)
                {
                    var newAppointment = new Appointment(
                        appointment.OperationRequestId,
                        plan.Date,
                        appointment.StartTime,
                        int.Parse(plan.RoomId.Value)
                    );
                    // Here you would save the appointment using your repository
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying plan");
                return StatusCode(500, "Error creating appointments from plan");
            }
        }

        private async Task<object> PreparePlanningData(PlanningRequest request)
        {
            // Convert domain objects to Prolog-friendly format
            // This would include gathering all necessary data about operations, staff, etc.
            return new
            {
                roomId = request.RoomId.Value,
                date = request.Date.ToString(),
                operations = request.OperationRequestIds.Select(id => id.Value).ToList()
                // Add more necessary data
            };
        }

        private async Task<JsonDocument> SendToPrologServer(object planningData)
        {
            var client = _clientFactory.CreateClient();
            var response = await client.PostAsJsonAsync($"{_prologServerUrl}/planning", planningData);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Prolog server error");
            }

            return await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        }

        private async Task<PlanningResponse> ProcessPrologResponse(JsonDocument response)
        {
            var root = response.RootElement;

            var planningResponse = new PlanningResponse
            {
                RoomId = new RoomId(root.GetProperty("roomId").GetString() ?? throw new ArgumentNullException("roomId")),
                Date = new Date(DateTime.Parse(root.GetProperty("date").GetString() ?? throw new ArgumentNullException("date"))),
                Appointments = new List<AppointmentPlan>()
            };

            var appointments = root.GetProperty("appointments").EnumerateArray();
            foreach (var app in appointments)
            {
                var appointment = new AppointmentPlan
                {
                    OperationRequestId = new OperationRequestId(app.GetProperty("operationRequestId").GetString()),
                    StartTime = new Time(TimeSpan.FromMinutes(app.GetProperty("startTime").GetInt32())),
                    EndTime = new Time(TimeSpan.FromMinutes(app.GetProperty("endTime").GetInt32())),
                    AssignedStaff = new List<LicenseNumber>()
                };

                planningResponse.Appointments.Add(appointment);
            }

            // Process staff schedules if needed
            if (root.TryGetProperty("staffSchedules", out var staffSchedules))
            {
                foreach (var staff in staffSchedules.EnumerateArray())
                {
                    var staffId = staff.GetProperty("staffId").GetString();
                    var schedule = staff.GetProperty("schedule").EnumerateArray();

                    // Map staff to appropriate appointments
                    foreach (var slot in schedule)
                    {
                        var opId = slot.GetProperty("operationRequestId").GetString();
                        var appointment = planningResponse.Appointments
                            .FirstOrDefault(a => a.OperationRequestId.Value == opId);

                        if (appointment != null)
                        {
                            appointment.AssignedStaff.Add(new LicenseNumber(staffId));
                        }
                    }
                }
            }

            return planningResponse;
        }

        private async Task<bool> ValidatePlanningRules(PlanningResponse plan)
        {
            // Implement validation rules here
            // Check for time overlaps, staff availability, etc.
            throw new NotImplementedException();
        }
    }
}