using System;
using Xunit;
using Backend.Domain.Staff;
using Backend.Domain.Staff.ValueObjects;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specialization;
using DDDSample1.Domain.Staff;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffTests
    {
        [Fact]
        public void Constructor_ShouldSetPropertiesCorrectly()
        {
            var userId = new UserId(Guid.NewGuid());
            var licenseNumber = new LicenseNumber("12345");
            var specializationId = new SpecializationId(Guid.NewGuid());
            var availabilitySlots = new AvailabilitySlots();
            var staff = new Staff(userId, licenseNumber, specializationId, availabilitySlots);

            Assert.Equal(userId, staff.UserId);
            Assert.Equal(licenseNumber, staff.Id);
            Assert.Equal(specializationId, staff.SpecializationId);
            Assert.Equal(availabilitySlots, staff.AvailabilitySlots);
            Assert.True(staff.Active);
        }

        [Fact]
        public void MarkAsInactive_ShouldSetActiveToFalse()
        {
            var staff = CreateStaff();
            staff.MarkAsInactive();
            Assert.False(staff.Active);
        }

        [Fact]
        public void UpdateAvailabilitySlots_ShouldSetNewAvailabilitySlots()
        {
            var staff = CreateStaff();
            var newAvailabilitySlots = new AvailabilitySlots();
            newAvailabilitySlots.AddSlot(DateTime.Now, DateTime.Now.AddHours(1));

            staff.UpdateAvailabilitySlots(newAvailabilitySlots);

            Assert.Equal(newAvailabilitySlots, staff.AvailabilitySlots);
        }

        [Fact]
        public void Deactivate_ShouldSetActiveToFalse()
        {
            var staff = CreateStaff();
            staff.Deactivate();
            Assert.False(staff.Active);
        }

        [Fact]
        public void ChangeSpecialization_ShouldUpdateSpecializationId()
        {
            var staff = CreateStaff();
            var newSpecializationId = new SpecializationId(Guid.NewGuid());

            staff.changeSpecialization(newSpecializationId);

            Assert.Equal(newSpecializationId, staff.SpecializationId);
        }

        private Staff CreateStaff()
        {
            var userId = new UserId(Guid.NewGuid());
            var licenseNumber = new LicenseNumber("12345");
            var specializationId = new SpecializationId(Guid.NewGuid());
            var availabilitySlots = new AvailabilitySlots();

            return new Staff(userId, licenseNumber, specializationId, availabilitySlots);
        }

        [Fact]
        public void Deactivate_WhenAlreadyInactive_ShouldRemainInactive()
        {
            var staff = CreateStaff();
            staff.Deactivate();
            staff.Deactivate();
            Assert.False(staff.Active);
        }

        [Fact]
        public void AddMultipleAvailabilitySlots_ShouldContainAllSlots()
        {
            var staff = CreateStaff();
            var newAvailabilitySlots = new AvailabilitySlots();
            newAvailabilitySlots.AddSlot(DateTime.Now, DateTime.Now.AddHours(1));
            newAvailabilitySlots.AddSlot(DateTime.Now.AddHours(2), DateTime.Now.AddHours(3));

            staff.UpdateAvailabilitySlots(newAvailabilitySlots);

            Assert.Equal(2, staff.AvailabilitySlots.Slots.Count);
        }

        [Fact]
        public void Staff_WithSameLicenseNumber_ShouldBeEqual()
        {
            var userId1 = new UserId(Guid.NewGuid());
            var userId2 = new UserId(Guid.NewGuid());
            var licenseNumber = new LicenseNumber("12345");
            var specializationId = new SpecializationId(Guid.NewGuid());
            var availabilitySlots = new AvailabilitySlots();

            var staff1 = new Staff(userId1, licenseNumber, specializationId, availabilitySlots);
            var staff2 = new Staff(userId2, licenseNumber, specializationId, availabilitySlots);

            Assert.Equal(staff1, staff2);
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenUserIdIsNull()
        {
            var licenseNumber = new LicenseNumber("12345");
            var specializationId = new SpecializationId(Guid.NewGuid());
            var availabilitySlots = new AvailabilitySlots();

            Assert.Throws<ArgumentNullException>(() => new Staff(null, licenseNumber, specializationId, availabilitySlots));
        }

        [Fact]
        public void Constructor_ShouldThrowException_WhenLicenseNumberIsNull()
        {
            var userId = new UserId(Guid.NewGuid());
            var specializationId = new SpecializationId(Guid.NewGuid());
            var availabilitySlots = new AvailabilitySlots();

            Assert.Throws<ArgumentNullException>(() => new Staff(userId, null, specializationId, availabilitySlots));
        }

        [Fact]
        public void ChangeSpecialization_WhenSameSpecializationId_ShouldNotChange()
        {
            var staff = CreateStaff();
            var initialSpecializationId = staff.SpecializationId;

            staff.changeSpecialization(initialSpecializationId);

            Assert.Equal(initialSpecializationId, staff.SpecializationId);
        }
    }
}
