using System;
using Xunit;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class TimeTest
    {
        [Fact]
        public void ValidTime_ShouldBeInstantiated()
        {
            // Arrange
            var validTime = new TimeSpan(12, 30, 0);

            // Act
            var time = new Time(validTime);

            // Assert
            Assert.NotNull(time);
            Assert.Equal(validTime, time.Value);
        }

        [Theory]
        [InlineData(-1, 0)]
        [InlineData(24, 0)]
        [InlineData(23, 60)]
        [InlineData(24, 1)]
        public void InvalidTime_ShouldThrowBusinessRuleValidationException(int hours, int minutes)
        {
            // Arrange
            var invalidTime = new TimeSpan(hours, minutes, 0);

            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new Time(invalidTime));
            Assert.Equal("Time must be between 00:00 and 23:59", exception.Message);
        }

        [Theory]
        [InlineData(0, 0)]
        [InlineData(23, 59)]
        public void ValidTime_ShouldInstantiate(int hours, int minutes)
        {
            // Arrange
            var validTime = new TimeSpan(hours, minutes, 0);

            // Act
            var time = new Time(validTime);

            // Assert
            Assert.NotNull(time);
            Assert.Equal(validTime, time.Value);
        }

        [Fact]
        public void Equals_ShouldReturnTrueForSameTime()
        {
            // Arrange
            var time1 = new Time(new TimeSpan(12, 30, 0));
            var time2 = new Time(time1.Value);

            // Act & Assert
            Assert.True(time1.Equals(time2));
        }

        [Fact]
        public void Equals_ShouldReturnFalseForDifferentTimes()
        {
            // Arrange
            var time1 = new Time(new TimeSpan(12, 30, 0));
            var time2 = new Time(new TimeSpan(13, 30, 0));

            // Act & Assert
            Assert.False(time1.Equals(time2));
        }

        [Fact]
        public void GetHashCode_ShouldReturnSameValueForSameTime()
        {
            // Arrange
            var time1 = new Time(new TimeSpan(12, 30, 0));
            var time2 = new Time(time1.Value);

            // Act & Assert
            Assert.Equal(time1.GetHashCode(), time2.GetHashCode());
        }

        [Fact]
        public void GetHashCode_ShouldReturnDifferentValueForDifferentTimes()
        {
            // Arrange
            var time1 = new Time(new TimeSpan(12, 30, 0));
            var time2 = new Time(new TimeSpan(13, 30, 0));

            // Act & Assert
            Assert.NotEqual(time1.GetHashCode(), time2.GetHashCode());
        }

        [Fact]
        public void ToString_ShouldReturnTimeAsString()
        {
            // Arrange
            var timeValue = new TimeSpan(12, 30, 0);
            var time = new Time(timeValue);

            // Act
            var result = time.ToString();

            // Assert
            Assert.Equal(timeValue.ToString(@"hh\:mm"), result);
        }
    }
}
