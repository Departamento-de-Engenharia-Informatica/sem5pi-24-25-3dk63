using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class AppointmentHistoryTest
    {
        [Fact]
        public void GivenValidAppointmentHistory_WhenConstructed_ThenAppointmentHistoryShouldBeCreated()
        {
            // Arrange
            var appointmentDate = new DateTime(2023, 6, 15);
            var doctorName = "Dr. Smith";

            // Act
            var appointmentHistory = new AppointmentHistory(appointmentDate, doctorName);

            // Assert
            Assert.Equal(appointmentDate, appointmentHistory.appointmentDate);
            Assert.Equal(doctorName, appointmentHistory.doctorName);
        }

        [Fact]
        public void GivenFutureAppointmentDate_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown()
        {
            // Arrange
            var futureDate = DateTime.Now.AddDays(1);
            var doctorName = "Dr. Smith";

            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new AppointmentHistory(futureDate, doctorName));
            Assert.Equal("Appointment Date cannot be in the future.", exception.Message);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void GivenInvalidDoctorName_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string invalidDoctorName)
        {
            // Arrange
            var appointmentDate = DateTime.Now;

            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new AppointmentHistory(appointmentDate, invalidDoctorName));
            Assert.Equal("Doctor Name can't be null or empty.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnFormattedAppointmentHistory()
        {
            // Arrange
            var appointmentDate = new DateTime(2023, 6, 15);
            var doctorName = "Dr. Johnson";
            var appointmentHistory = new AppointmentHistory(appointmentDate, doctorName);

            // Act
            var result = appointmentHistory.ToString();

            // Assert
            Assert.Equal("2023-06-15 - Dr. Johnson", result);
        }

        [Theory]
        [InlineData("2023-06-15", "Dr. Brown")]
        [InlineData("2021-10-01", "Dr. Lee")]
        public void GivenTwoIdenticalAppointmentHistories_WhenCompared_ThenTheyShouldBeEqual(string appointmentDateStr, string doctorName)
        {
            // Arrange
            var appointmentDate = DateTime.Parse(appointmentDateStr);
            var appointment1 = new AppointmentHistory(appointmentDate, doctorName);
            var appointment2 = new AppointmentHistory(appointmentDate, doctorName);

            // Act & Assert
            Assert.Equal(appointment1, appointment2);
        }

        [Theory]
        [InlineData("2023-06-15", "Dr. Brown", "2021-10-01", "Dr. Lee")]
        [InlineData("2020-12-25", "Dr. White", "2020-12-25", "Dr. Black")]
        public void GivenTwoDifferentAppointmentHistories_WhenCompared_ThenTheyShouldNotBeEqual(
            string date1, string doctorName1, string date2, string doctorName2)
        {
            // Arrange
            var appointmentDate1 = DateTime.Parse(date1);
            var appointmentDate2 = DateTime.Parse(date2);
            var appointment1 = new AppointmentHistory(appointmentDate1, doctorName1);
            var appointment2 = new AppointmentHistory(appointmentDate2, doctorName2);

            // Act & Assert
            Assert.NotEqual(appointment1, appointment2);
        }
    }
}
