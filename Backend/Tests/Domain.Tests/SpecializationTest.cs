using System;
using Xunit;
using DDDSample1.Domain.Specialization;
using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Shared;

namespace Domain.Tests
{
    public class SpecializationTests
    {
        [Fact]
        public void Constructor_ShouldSetPropertiesCorrectly()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var description = new Description("Cardiology");
            var sequentialNumber = 1;

            var specialization = new Specialization(specializationId, description, sequentialNumber);

            Assert.Equal(specializationId, specialization.Id);
            Assert.Equal(description, specialization.Description);
            Assert.Equal(sequentialNumber, specialization.SequentialNumber);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenSpecializationIdIsNull()
        {
            var description = new Description("Cardiology");

            Assert.Throws<ArgumentNullException>(() => new Specialization(null, description, 1));
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenDescriptionIsNull()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());

            Assert.Throws<ArgumentNullException>(() => new Specialization(specializationId, null, 1));
        }

        [Fact]
        public void UpdateDescription_ShouldChangeDescription()
        {
            var specialization = CreateSpecialization();
            var newDescription = new Description("Neurology");

            specialization.UpdateDescription(newDescription);

            Assert.Equal(newDescription, specialization.Description);
        }

        [Fact]
        public void UpdateDescription_ShouldThrowException_WhenDescriptionIsNull()
        {
            var specialization = CreateSpecialization();

            Assert.Throws<ArgumentNullException>(() => specialization.UpdateDescription(null));
        }

        [Fact]
        public void UpdateSequentialNumber_ShouldChangeSequentialNumber()
        {
            var specialization = CreateSpecialization();
            var newSequentialNumber = 5;

            specialization.UpdateSequentialNumber(newSequentialNumber);

            Assert.Equal(newSequentialNumber, specialization.SequentialNumber);
        }

        [Fact]
        public void Equals_ShouldReturnTrue_ForSpecializationsWithSameDescription()
        {
            var specializationId1 = new SpecializationId(Guid.NewGuid());
            var specializationId2 = new SpecializationId(Guid.NewGuid());
            var description = new Description("Cardiology");

            var specialization1 = new Specialization(specializationId1, description, 1);
            var specialization2 = new Specialization(specializationId2, description, 2);

            Assert.True(specialization1.Equals(specialization2));
        }

        [Fact]
        public void Equals_ShouldReturnFalse_ForSpecializationsWithDifferentDescriptions()
        {
            var specializationId1 = new SpecializationId(Guid.NewGuid());
            var specializationId2 = new SpecializationId(Guid.NewGuid());
            var description1 = new Description("Cardiology");
            var description2 = new Description("Neurology");

            var specialization1 = new Specialization(specializationId1, description1, 1);
            var specialization2 = new Specialization(specializationId2, description2, 2);

            Assert.False(specialization1.Equals(specialization2));
        }

        [Fact]
        public void GetHashCode_ShouldReturnSameHashCode_ForSpecializationsWithSameDescription()
        {
            var description = new Description("Cardiology");
            var specialization1 = new Specialization(new SpecializationId(Guid.NewGuid()), description, 1);
            var specialization2 = new Specialization(new SpecializationId(Guid.NewGuid()), description, 2);

            Assert.Equal(specialization1.GetHashCode(), specialization2.GetHashCode());
        }

        private Specialization CreateSpecialization()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var description = new Description("Cardiology");
            return new Specialization(specializationId, description, 1);
        }
    }
}
