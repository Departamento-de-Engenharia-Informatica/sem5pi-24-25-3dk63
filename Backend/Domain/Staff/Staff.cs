using System;
using DDDSample1.Domain.Shared;
using Backend.Domain.Staff.ValueObjects;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specialization;

namespace DDDSample1.Domain.Staff
{
    public class Staff : Entity<LicenseNumber>, IAggregateRoot
    {
        public UserId UserId { get; private set; }
        public SpecializationId SpecializationId { get; private set; }
        public AvailabilitySlots AvailabilitySlots { get; private set; }
        public bool Active { get; private set; }

        protected Staff()
        {
            this.Active = true;
        }

        public Staff(UserId userId, LicenseNumber licenseNumber, SpecializationId specializationId, AvailabilitySlots availabilitySlots)
        {
            this.Id = licenseNumber;
            this.UserId = userId;
            this.SpecializationId = specializationId;
            this.AvailabilitySlots = availabilitySlots;
            this.Active = true;
        }

        public void MarkAsInactive()
        {
            this.Active = false;
        }

        public void UpdateAvailabilitySlots(AvailabilitySlots newAvailabilitySlots)
        {
            AvailabilitySlots = newAvailabilitySlots;
        }

        public void Deactivate()
        {
            this.Active = false;
        }

                public void changeSpecialization(SpecializationId specializationId)
        {
            this.SpecializationId = specializationId;
        }
    }
}
