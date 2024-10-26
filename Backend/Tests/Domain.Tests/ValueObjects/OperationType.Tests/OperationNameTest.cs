using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;


namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class OperationNameTest
    {
        [Fact]
        public void GivenValidOperationName_WhenConstructed_ThenOperationNameShouldBeCreated()
        {
            // Arrange
            var validOperationName = "Operação de teste";

            // Act
            var operationName = new OperationName(validOperationName);

            // Assert
            Assert.Equal(validOperationName, operationName.Description);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        public void GivenEmptyOperationName_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string emptyOperationName)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new OperationName(emptyOperationName));
            Assert.Equal("Operation name cannot be empty or empty.", exception.Message);
        }

        [Fact]
        public void ToString_ShouldReturnOperationNameValue()
        {
            // Arrange
            var validOperationName = "Operação de teste";
            var operationName = new OperationName(validOperationName);

            // Act
            var result = operationName.ToString();

            // Assert
            Assert.Equal(validOperationName, result);
        }
    }
}