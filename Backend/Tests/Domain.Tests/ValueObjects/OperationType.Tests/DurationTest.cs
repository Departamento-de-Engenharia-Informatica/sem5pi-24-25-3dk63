using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;


namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class DurationTests
    {
        [Fact]
        public void GivenValidDuration_WhenConstructed_ThenDurationShouldBeCreated()
        {
            // Arrange
            var validPreparation = 10;
            var validOperation= 20;
            var validCleaning = 30;

            var TotalDuration = validPreparation + validOperation + validCleaning;
            // Act
            var duration = new Duration(validPreparation, validOperation, validCleaning);

            //Assert
            Assert.Equal(validPreparation, duration.PreparationPhase);
            Assert.Equal(validOperation, duration.SurgeryPhase);
            Assert.Equal(validCleaning, duration.CleaningPhase);
            Assert.Equal(TotalDuration, duration.TotalDuration);
        }

        [Theory]
        [InlineData(-1, 20, 30)]
        [InlineData(10, -1, 30)]
        [InlineData(10, 20, -1)]
        public void GivenNegativeDuration_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(int preparation, int operation, int cleaning)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new Duration(preparation, operation, cleaning));
            Assert.Equal("All durations must be provided and bigger than 0.", exception.Message);
        }

        [Theory]
        [InlineData(0, 20, 30)]
        [InlineData(10, 0, 30)]
        [InlineData(10, 20, 0)]
        public void GivenZeroDuration_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(int preparation, int operation, int cleaning)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new Duration(preparation, operation, cleaning));
            Assert.Equal("All durations must be provided and bigger than 0.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnDurationValue()
        {
            // Arrange
            var validPreparation = 10;
            var validOperation = 20;
            var validCleaning = 30;
            var TotalDuration = validPreparation + validOperation + validCleaning;

            var duration = new Duration(validPreparation, validOperation, validCleaning);

            // Act
            var result = duration.ToString();

            // Assert
            Assert.Equal($"Total operation time: {TotalDuration}\n Anesthesia: {validPreparation}, Surgery: {validOperation}, Cleaning: {validCleaning}", result);
        }
    }
}

