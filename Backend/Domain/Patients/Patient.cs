using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using System.Collections.Generic;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.PendingChange;

namespace DDDSample1.Domain
{
    public class Patient : Entity<MedicalRecordNumber>, IAggregateRoot
    {
        public UserId UserId { get; set; }
        public DateOfBirth dateOfBirth { get; private set; }
        public Gender gender { get; private set; }
        public MedicalHistory medicalHistory { get; private set; }
        public EmergencyContact emergencyContact { get; private set; }
        public List<AppointmentHistory> appointmentHistoryList { get; private set; }
        public int sequentialNumber { get; private set; }
        public bool Active { get; private set; }
        public DateTime? MarkedForDeletionDate { get; private set; }

        private Patient()
        {
            this.Active = false;
            this.appointmentHistoryList = new List<AppointmentHistory>();
        }

        public Patient(DateOfBirth dateOfBirth, Gender gender, EmergencyContact emergencyContact, int sequentialNumber)
        {
            this.Id = new MedicalRecordNumber(MedicalRecordNumber.GenerateNewRecordNumber(dateOfBirth.date, sequentialNumber));
            this.Active = false;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.medicalHistory = new MedicalHistory("");
            this.emergencyContact = emergencyContact;
            this.appointmentHistoryList = new List<AppointmentHistory>();
            this.sequentialNumber = sequentialNumber;
        }

        public Patient(DateOfBirth dateOfBirth, Gender gender, EmergencyContact emergencyContact, MedicalHistory medicalHistory, int sequentialNumber)
        {
            this.Id = new MedicalRecordNumber(MedicalRecordNumber.GenerateNewRecordNumber(dateOfBirth.date, sequentialNumber));
            this.Active = false;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.medicalHistory = medicalHistory;
            this.emergencyContact = emergencyContact;
            this.appointmentHistoryList = new List<AppointmentHistory>();
            this.sequentialNumber = sequentialNumber;
        }

        public Patient(UserId userId, DateOfBirth dateOfBirth, Gender gender, EmergencyContact emergencyContact, int sequentialNumber)
        {
            this.Id = new MedicalRecordNumber(MedicalRecordNumber.GenerateNewRecordNumber(dateOfBirth.date, sequentialNumber));
            this.UserId = userId;
            this.Active = false;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.medicalHistory = new MedicalHistory("");
            this.emergencyContact = emergencyContact;
            this.appointmentHistoryList = new List<AppointmentHistory>();
            this.sequentialNumber = sequentialNumber;
        }

        public Patient(UserId userId, DateOfBirth dateOfBirth, Gender gender, EmergencyContact emergencyContact, MedicalHistory medicalHistory, int sequentialNumber)
        {
            this.Id = new MedicalRecordNumber(MedicalRecordNumber.GenerateNewRecordNumber(dateOfBirth.date, sequentialNumber));
            this.UserId = userId;
            this.Active = false;
            this.dateOfBirth = dateOfBirth;
            this.gender = gender;
            this.medicalHistory = medicalHistory;
            this.emergencyContact = emergencyContact;
            this.appointmentHistoryList = new List<AppointmentHistory>();
            this.sequentialNumber = sequentialNumber;
        }


        public void AddAppointment(AppointmentHistory appointment)
        {
            appointmentHistoryList.Add(appointment);
        }

        public void ChangeActiveTrue()
        {
            this.Active = true;
        }

        public void ChangeActiveFalse()
        {
            this.Active = false;
        }
        public void ChangeMedicalHistory(string medicalHistory)
        {
            this.medicalHistory = new MedicalHistory(medicalHistory);
        }

        public void ApplyChanges(PendingChanges pendingChange)
        {
            if(pendingChange.MedicalHistory != null)
            {
                this.medicalHistory = pendingChange.MedicalHistory;
            }

            if(pendingChange.EmergencyContact != null)
            {
                this.emergencyContact = pendingChange.EmergencyContact;
            }
        }

        public void MarkForDeletion()
        {
            this.MarkedForDeletionDate = DateTime.UtcNow.AddMinutes(2);
        }
    }
}
