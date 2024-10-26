using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using Xunit;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class DateOfBirthTest
    {
        [Fact]
        public void GivenValidDateOfBirth_WhenConstructed_ThenDateOfBirthShouldBeCreated()
        {
            // Arrange
            var validDate = new DateTime(1990, 1, 1);

            // Act
            var dateOfBirth = new DateOfBirth(validDate);

            // Assert
            Assert.Equal(validDate, dateOfBirth.date);
        }

        [Fact]
        public void GivenFutureDateOfBirth_WhenConstructed_ThenArgumentExceptionShouldBeThrown()
        {
            // Arrange
            var futureDate = DateTime.Now.AddDays(1);

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new DateOfBirth(futureDate));
            Assert.Equal("Date of birth cannot be in the future.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnFormattedDateOfBirth()
        {
            // Arrange
            var date = new DateTime(2000, 5, 20);
            var dateOfBirth = new DateOfBirth(date);

            // Act
            var result = dateOfBirth.ToString();

            // Assert
            Assert.Equal("2000-05-20", result);
        }

        [Theory]
        [InlineData("2000-05-20")]
        [InlineData("1995-12-15")]
        public void GivenTwoIdenticalDatesOfBirth_WhenCompared_ThenTheyShouldBeEqual(string dateString)
        {
            // Arrange
            var date = DateTime.Parse(dateString);
            var dob1 = new DateOfBirth(date);
            var dob2 = new DateOfBirth(date);

            // Act & Assert
            Assert.Equal(dob1, dob2);
        }

        [Theory]
        [InlineData("2000-05-20", "1995-12-15")]
        [InlineData("1990-01-01", "1991-01-01")]
        public void GivenTwoDifferentDatesOfBirth_WhenCompared_ThenTheyShouldNotBeEqual(string dateString1, string dateString2)
        {
            // Arrange
            var date1 = DateTime.Parse(dateString1);
            var date2 = DateTime.Parse(dateString2);
            var dob1 = new DateOfBirth(date1);
            var dob2 = new DateOfBirth(date2);

            // Act & Assert
            Assert.NotEqual(dob1, dob2);
        }
    }
}
