using DDDSample1.Domain.Shared;
using Xunit;
using DDDSample1.Domain.OperationRequests;


namespace Backend.Tests.Domain.Tests.ValueObjects
{
public class PriorityTest
{
    [Fact]
    public void GivenValidPriority_WhenConstructed_ThenPrioriryShouldBeCreated()
    {
        // Arrange
        var validPrio= PriorityType.Elective;

        // Act
        var priority = new Priority(validPrio);

        //Assert
        Assert.Equal(validPrio, priority.Value);
    }
    
    [Fact]
    public void GivenValidPriority_WhenConstructed_ThenPrioriryShouldBeCreated2()
    {
        // Arrange
        var validPrio= PriorityType.Emergency;

        // Act
        var priority = new Priority(validPrio);

        //Assert
        Assert.Equal(validPrio, priority.Value);
    }
    
    [Fact]
    public void GivenValidPriority_WhenConstructed_ThenPrioriryShouldBeCreated3()
    {
        // Arrange
        var validPrio= PriorityType.Urgent;

        // Act
        var priority = new Priority(validPrio);

        //Assert
        Assert.Equal(validPrio, priority.Value);
    }

    [Fact]
    public void ToString_ShouldReturnPriorityValue()
    {
        // Arrange
        var validPrio= PriorityType.Elective;
        var priority = new Priority(validPrio);

        // Act
        var result = priority.ToString();

        // Assert
        Assert.Equal(validPrio.ToString(), result);
    }

    [Fact]
        public void GivenSamePriorityType_TwoPriorityObjects_ShouldBeEqual()
        {
         // Arrange
         var priority1 = new Priority(PriorityType.Urgent);
         var priority2 = new Priority(PriorityType.Urgent);

            // Act & Assert
            Assert.Equal(priority1, priority2);
            Assert.True(priority1.Equals(priority2));
        }
        [Fact]
        public void GivenDifferentPriorityTypes_TwoPriorityObjects_ShouldNotBeEqual()
        {
            // Arrange
            var priority1 = new Priority(PriorityType.Urgent);
            var priority2 = new Priority(PriorityType.Elective);

            // Act & Assert
            Assert.NotEqual(priority1, priority2);
            Assert.False(priority1.Equals(priority2));
        }

        [Fact]
        public void AdminPriority_ShouldReturnElective()
        {
            // Act
            var priority = Prioritys.Admin;

            // Assert
            Assert.Equal(PriorityType.Elective, priority.Value);
        }

        [Fact]
        public void DoctorPriority_ShouldReturnEmergency()
        {
            // Act
            var priority = Prioritys.Doctor;

            // Assert
            Assert.Equal(PriorityType.Emergency, priority.Value);
        }

        [Fact]
        public void NursePriority_ShouldReturnUrgent()
        {
            // Act
            var priority = Prioritys.Nurse;

            // Assert
            Assert.Equal(PriorityType.Urgent, priority.Value);
        }
    }
}
