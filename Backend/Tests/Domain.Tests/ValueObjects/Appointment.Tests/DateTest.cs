using System;
using Xunit;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class DateTest
    {
        [Fact]
        public void ValidDate_ShouldBeInstantiated()
        {
            // Arrange
            var validDate = DateTime.Now.AddDays(1);

            // Act
            var date = new Date(validDate);

            // Assert
            Assert.NotNull(date);
            Assert.Equal(validDate, date.Value);
        }

        [Theory]
        [InlineData("2023-01-01")]
        [InlineData("2022-12-31")]
        public void PastDate_ShouldThrowBusinessRuleValidationException(string pastDateStr)
        {
            // Arrange
            var pastDate = DateTime.Parse(pastDateStr);

            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new Date(pastDate));
            Assert.Equal("Date cannot be in the past", exception.Message);
        }

        [Theory]
        [InlineData("2025-12-31")]
        [InlineData("2025-01-01")]
        public void ValidFutureDate_ShouldInstantiate(string futureDateStr)
        {
            // Arrange
            var futureDate = DateTime.Parse(futureDateStr);

            // Act
            var date = new Date(futureDate);

            // Assert
            Assert.NotNull(date);
            Assert.Equal(futureDate, date.Value);
        }

        [Fact]
        public void Equals_ShouldReturnTrueForSameDate()
        {
            // Arrange
            var date1 = new Date(DateTime.Now.AddDays(1));
            var date2 = new Date(date1.Value);

            // Act & Assert
            Assert.True(date1.Equals(date2));
        }

        [Fact]
        public void Equals_ShouldReturnFalseForDifferentDates()
        {
            // Arrange
            var date1 = new Date(DateTime.Now.AddDays(1));
            var date2 = new Date(DateTime.Now.AddDays(2));

            // Act & Assert
            Assert.False(date1.Equals(date2));
        }

        [Fact]
        public void GetHashCode_ShouldReturnSameValueForSameDate()
        {
            // Arrange
            var date1 = new Date(DateTime.Now.AddDays(1));
            var date2 = new Date(date1.Value);

            // Act & Assert
            Assert.Equal(date1.GetHashCode(), date2.GetHashCode());
        }

        [Fact]
        public void GetHashCode_ShouldReturnDifferentValueForDifferentDates()
        {
            // Arrange
            var date1 = new Date(DateTime.Now.AddDays(1));
            var date2 = new Date(DateTime.Now.AddDays(2));

            // Act & Assert
            Assert.NotEqual(date1.GetHashCode(), date2.GetHashCode());
        }

        [Fact]
        public void ToString_ShouldReturnDateAsString()
        {
            // Arrange
            var dateValue = DateTime.Now.AddDays(1);
            var date = new Date(dateValue);

            // Act
            var result = date.ToString();

            // Assert
            Assert.Equal(dateValue.ToString(), result);
        }
    }
}
