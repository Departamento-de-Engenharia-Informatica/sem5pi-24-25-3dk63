using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class GenderTest
    {
        [Fact]
        public void GivenValidGender_WhenConstructed_ThenGenderShouldBeCreated()
        {
            // Arrange
            var genderValue = "Male";

            // Act
            var gender = new Gender(genderValue);

            // Assert
            Assert.Equal(genderValue, gender.gender);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void GivenInvalidGender_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string invalidGender)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new Gender(invalidGender));
            Assert.Equal("Gender cannot be empty or null.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnGender()
        {
            // Arrange
            var genderText = "Female";
            var gender = new Gender(genderText);

            // Act
            var result = gender.ToString();

            // Assert
            Assert.Equal(genderText, result);
        }

        [Theory]
        [InlineData("Non-Binary")]
        [InlineData("Female")]
        public void GivenTwoIdenticalGenders_WhenCompared_ThenTheyShouldBeEqual(string genderText)
        {
            // Arrange
            var gender1 = new Gender(genderText);
            var gender2 = new Gender(genderText);

            // Act & Assert
            Assert.Equal(gender1, gender2);
        }

        [Theory]
        [InlineData("Male", "Female")]
        [InlineData("Non-Binary", "Male")]
        public void GivenTwoDifferentGenders_WhenCompared_ThenTheyShouldNotBeEqual(string genderText1, string genderText2)
        {
            // Arrange
            var gender1 = new Gender(genderText1);
            var gender2 = new Gender(genderText2);

            // Act & Assert
            Assert.NotEqual(gender1, gender2);
        }
    }
}
