using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Patients
{
    public class RegisterPatientDTO
    {
        public DateOfBirth dateOfBirth { get; set; }
        public Gender gender { get; set; }
        public EmergencyContact emergencyContact { get; set; }
        public List<AppointmentHistory> appointmentHistoryList { get; set; }
        public Email personalEmail { get; set; }
        public Name name { get; set; }
        public PhoneNumber phoneNumber { get; set; }
        public MedicalHistory medicalHistory { get; set; }
    }
}