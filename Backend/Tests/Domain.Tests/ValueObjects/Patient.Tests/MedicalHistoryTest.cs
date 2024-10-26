using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class MedicalHistoryTest
    {
        [Fact]
        public void GivenValidMedicalHistory_WhenConstructed_ThenMedicalHistoryShouldBeCreated()
        {
            // Arrange
            var medicalHistory = "Patient has a history of asthma";

            // Act
            var history = new MedicalHistory(medicalHistory);

            // Assert
            Assert.Equal(medicalHistory, history.medicalHistory);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void GivenInvalidMedicalHistory_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string invalidHistory)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new MedicalHistory(invalidHistory));
            Assert.Equal("Medical history cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnMedicalHistory()
        {
            // Arrange
            var medicalHistoryText = "Patient has a history of diabetes";
            var history = new MedicalHistory(medicalHistoryText);

            // Act
            var result = history.ToString();

            // Assert
            Assert.Equal(medicalHistoryText, result);
        }

        [Fact]
        public void GivenTwoIdenticalMedicalHistories_WhenCompared_ThenTheyShouldBeEqual()
        {
            // Arrange
            var medicalHistoryText = "Patient has a history of hypertension";
            var history1 = new MedicalHistory(medicalHistoryText);
            var history2 = new MedicalHistory(medicalHistoryText);

            // Act & Assert
            Assert.Equal(history1, history2);
        }

        [Fact]
        public void GivenTwoDifferentMedicalHistories_WhenCompared_ThenTheyShouldNotBeEqual()
        {
            // Arrange
            var history1 = new MedicalHistory("Patient has a history of hypertension");
            var history2 = new MedicalHistory("Patient has a history of diabetes");

            // Act & Assert
            Assert.NotEqual(history1, history2);
        }
    }
}
