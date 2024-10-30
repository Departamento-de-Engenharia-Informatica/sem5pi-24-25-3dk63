using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.Patients
{
  public class PatientCompleteDTO
  {
    public MedicalRecordNumber id { get; set; }
    public UserId userId { get; set; }
    public Email personalEmail { get; set; }
    public Email? iamEmail { get; set; }
    public Name? name { get; set; }
    public DateOfBirth dateOfBirth { get; set; }
    public Gender gender { get; set; }
    public EmergencyContact? emergencyContact { get; set; }
    public PhoneNumber? phoneNumber { get; set; }
    public MedicalHistory? medicalHistory { get; set; }
    public List<AppointmentHistory> appointmentHistoryList { get; set; }
    public bool active { get; set; }
  }
}