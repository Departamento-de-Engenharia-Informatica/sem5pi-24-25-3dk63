using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.PendingChangeStaff
{
    public class PendingChangesStaffDTO
    {
        public Email? Email { get; set; }
        public PhoneNumber? PhoneNumber { get; set; }
        public string? Specialization { get; set; }

    }
}
