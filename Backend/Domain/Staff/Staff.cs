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
            this.UserId = userId ?? throw new ArgumentNullException(nameof(userId), "UserId cannot be null.");
            this.Id = licenseNumber ?? throw new ArgumentNullException(nameof(licenseNumber), "LicenseNumber cannot be null.");
            this.SpecializationId = specializationId ?? throw new ArgumentNullException(nameof(specializationId), "SpecializationId cannot be null.");
            this.AvailabilitySlots = availabilitySlots ?? throw new ArgumentNullException(nameof(availabilitySlots), "AvailabilitySlots cannot be null.");
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

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(this, obj)) return true;
            if (obj is null || obj.GetType() != GetType()) return false;

            var other = (Staff)obj;
            return Id.Equals(other.Id);
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }

}
