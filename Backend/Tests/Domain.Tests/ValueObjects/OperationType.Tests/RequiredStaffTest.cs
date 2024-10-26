using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;


namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class RequiredStaffTest
    {
        [Fact]
        public void GivenValidRequiredStaff_WhenConstructed_ThenRequiredStaffShouldBeCreated()
        {
            // Arrange
            var validRequiredStaff = 10;

            // Act
            var requiredStaff = new RequiredStaff(validRequiredStaff);

            // Assert
            Assert.Equal(validRequiredStaff, requiredStaff.RequiredNumber);
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void GivenNegativeRequiredStaff_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(int ivalidRequiredStaff)
        {
            // Act & Assert
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new RequiredStaff(ivalidRequiredStaff));
            Assert.Equal("Number of required staff must be bigger than 0.", exception.Message);
        }


        [Fact]
        public void ToString_ShouldReturnRequiredStaffValue()
        {
            // Arrange
            var validRequiredStaff = 10;
            var requiredStaff = new RequiredStaff(validRequiredStaff);

            // Act
            var result = requiredStaff.ToString();

            // Assert
            Assert.Equal(validRequiredStaff.ToString(), result);
        }
    }
}