using DDDSample1.Domain.Shared;
using Xunit;
using DDDSample1.Domain.OperationRequests;


namespace Backend.Tests.Domain.Tests.ValueObjects
{
public class DeadlineTest
{
    [Fact]
    public void GivenValidDeadline_WhenConstructed_ThenDeadlineShouldBeCreated()
    {
        // Arrange
        var validDeadline = DateTime.Now.AddDays(1);

        // Act
        var deadline = new Deadline(validDeadline);

        //Assert
        Assert.Equal(validDeadline, deadline.Value);
    }

    [Theory]
    [InlineData("2022-10-25")]
    [InlineData("25/10/2022")]
    public void GivenPastDeadline_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(string value)
    {
         var dateValue = DateTime.Parse(value);
         var exception = Assert.Throws<BusinessRuleValidationException>(() => new Deadline(dateValue));
        Assert.Equal("Deadline cannot be null or in the past", exception.Message);
        }
        

    [Theory]
    [InlineData(null)]
    public void GivenNullDeadline_WhenConstructed_ThenBusinessRuleValidationExceptionShouldBeThrown(DateTime value)
    {
        // Act & Assert
        var exception = Assert.Throws<BusinessRuleValidationException>(() => new Deadline(value));
        Assert.Equal("Deadline cannot be null or in the past", exception.Message);
    }

    [Fact]
    public void ToString_ShouldReturnDeadlineValue()
    {
        // Arrange
        var validDeadline = DateTime.Now.AddDays(1);

        var deadline = new Deadline(validDeadline);

        // Act
        var result = deadline.ToString();

        // Assert
        Assert.Equal(validDeadline.ToString(), result);
    }
}
}