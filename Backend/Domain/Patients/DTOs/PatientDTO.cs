using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Patients
{
    public class PatientDTO
    {
        public MedicalRecordNumber Id { get; set; }
        public UserId UserId { get; set; }
        public DateOfBirth dateOfBirth { get; set; }
        public Gender gender { get; set; }
        public MedicalHistory medicalHistory { get; set; }
        public EmergencyContact emergencyContact { get; set; }
        public List<AppointmentHistory> appointmentHistoryList { get; set; }
        public bool Active { get; set; }
    }
}
