using Backend.Domain.Staff.ValueObjects;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.PendingChangeStaff
{
    public class PendingChangesStaff
    {
        public UserId UserId { get; set; }
        public Email? Email { get; set; }
        public PhoneNumber? PhoneNumber { get; set; }
        public String? Specialization { get; set; }

        public PendingChangesStaff(UserId userId)
        {
            UserId = userId;
        }

        public void UpdateEmail(Email newEmail)
        {
            Email = newEmail;
        }

        public void UpdatePhoneNumber(PhoneNumber newPhoneNumber)
        {
            PhoneNumber = newPhoneNumber;
        }

        public void UpdateSpecialization(String newSpecialization)
        {
            Specialization = newSpecialization;
        }

        public void ResetChanges()
        {
            Email = null;
            PhoneNumber = null;
            Specialization = null;
        }
    }
}
