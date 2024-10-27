using System;
using DDDSample1.Domain;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Domain.Tests
{
    public class AppointmentTest
    {
        [Theory]
        [InlineData("2025-10-26", "09:00", 101)]
        [InlineData("2025-10-27", "10:30", 102)]
        [InlineData("2025-10-28", "14:00", 103)]
        public void WhenPassingCorrectData_ThenAppointmentIsCreated(string dateStr, string timeStr, int roomNumber)
        {
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var date = new Date(DateTime.Parse(dateStr));
            var time = new Time(TimeSpan.Parse(timeStr));

            var appointment = new Appointment(operationRequestId, date, time, roomNumber);

            Assert.NotNull(appointment);
            Assert.True(appointment.Active);
            Assert.Equal(date, appointment.date);
            Assert.Equal(time, appointment.time);
            Assert.Equal(roomNumber, appointment.roomNumber);
        }

        [Theory]
        [InlineData("2025-10-26", "09:00", "2026-10-27")]
        [InlineData("2025-10-28", "10:30", "2026-10-29")]
        public void WhenChangingDate_ThenDateIsUpdated(string originalDateStr, string originalTimeStr, string newDateStr)
        {
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var originalDate = new Date(DateTime.Parse(originalDateStr));
            var originalTime = new Time(TimeSpan.Parse(originalTimeStr));
            var appointment = new Appointment(operationRequestId, originalDate, originalTime, 101);

            var newDate = new Date(DateTime.Parse(newDateStr));
            appointment.ChangeDate(newDate);

            Assert.Equal(newDate, appointment.date);
        }

        [Theory]
        [InlineData("2025-10-26", "09:00", "10:30")]
        [InlineData("2025-10-28", "14:00", "15:30")]
        public void WhenChangingTime_ThenTimeIsUpdated(string dateStr, string originalTimeStr, string newTimeStr)
        {
            var operationRequestId = new OperationRequestId(Guid.NewGuid());
            var date = new Date(DateTime.Parse(dateStr));
            var originalTime = new Time(TimeSpan.Parse(originalTimeStr));
            var appointment = new Appointment(operationRequestId, date, originalTime, 101);

            var newTime = new Time(TimeSpan.Parse(newTimeStr));
            appointment.ChangeTime(newTime);

            Assert.Equal(newTime, appointment.time);
        }
    }
}
