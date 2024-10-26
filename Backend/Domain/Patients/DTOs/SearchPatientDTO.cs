using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Patients
{
    public class SearchPatientDTO
    {
        public Name Name { get; set; }
        public Email Email { get; set; }
        public DateOfBirth dateOfBirth { get; set; }
        public MedicalRecordNumber MedicalRecordNumber { get; set; }
    }
}