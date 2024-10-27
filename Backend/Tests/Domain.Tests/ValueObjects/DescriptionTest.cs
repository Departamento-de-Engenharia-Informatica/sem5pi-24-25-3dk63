using System;
using Xunit;
using Backend.Domain.Specialization.ValueObjects;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class DescriptionTest
    {
        [Fact]
        public void Constructor_ShouldThrowArgumentException_WhenValueIsEmpty()
        {
            Assert.Throws<ArgumentException>(() => new Description(string.Empty));
        }

        [Fact]
        public void Constructor_ShouldSetCorrectValue_WhenValueIsNotEmpty()
        {
            var value = "Valid Description";
            var description = new Description(value);
            Assert.Equal(value, description.Value);
        }

        [Fact]
        public void Descriptions_ShouldBeEqual_WhenValuesAreTheSame()
        {
            var desc1 = new Description("Same Description");
            var desc2 = new Description("Same Description");
            Assert.Equal(desc1, desc2);
        }

        [Fact]
        public void Descriptions_ShouldNotBeEqual_WhenValuesAreDifferent()
        {
            var desc1 = new Description("Description One");
            var desc2 = new Description("Description Two");
            Assert.NotEqual(desc1, desc2);
        }
    }
}
