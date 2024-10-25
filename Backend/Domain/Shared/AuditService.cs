using System;
using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.Staff; // Ensure this is the correct namespace for the Staff class
using DDDSample1.Domain.Users;
using Serilog;

namespace Backend.Domain.Shared
{
    public class AuditService
    {
        private readonly Serilog.ILogger _logger;


        public AuditService(Serilog.ILogger logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void LogDeletionPatient(Patient patient, string adminEmail)
        {
            string logMessage = $"Patient {patient.Id} was deleted by Admin ({adminEmail}) on {DateTime.UtcNow}";

            _logger.Information(logMessage);
        }

        public void LogDeactivateOperationType(OperationType operationType, string adminEmail)
        {
            string logMessage = $"OperationType {operationType.Name.Description} ({operationType.Id.Value}) was deactivated by Admin ({adminEmail}) on {DateTime.UtcNow}";

            _logger.Information(logMessage);
        }

        public void LogCreateOperationType(OperationType operationType, string adminEmail)
        {
            string logMessage = $"OperationType {operationType.Name.Description} ({operationType.Id.Value}) was created by Admin ({adminEmail}) on {DateTime.UtcNow}";

            _logger.Information(logMessage);
        }

        public void LogDeactivateStaff(DDDSample1.Domain.Staff.Staff staff, string adminEmail)
        {
            string logMessage = $"Staff {staff.Id.Value} was deactivated by Admin ({adminEmail}) on {DateTime.UtcNow}";

            _logger.Information(logMessage);
        }

        public void LogProfileUpdate(PatientDTO patient, UserDTO user, PendingChangesDTO changes)
            {
                var updatedFields = new List<string>();

                if (changes.Name != null && !changes.Name.Equals(user.Name))
                    updatedFields.Add($"Name changed to: {changes.Name.FirstName} {changes.Name.LastName}");

                if (changes.Email != null && !changes.Email.Equals(user.Email))
                    updatedFields.Add($"Email changed to: {changes.Email.Value}");

                if (changes.EmergencyContact != null && !changes.EmergencyContact.Equals(patient.emergencyContact))
                    updatedFields.Add($"Emergency Contact changed to: {changes.EmergencyContact.emergencyContact}");

                if (changes.PhoneNumber != null && !changes.PhoneNumber.Equals(user.phoneNumber))
                    updatedFields.Add($"Phone Number changed to: {changes.PhoneNumber.Number}");

                if (changes.MedicalHistory != null && !changes.MedicalHistory.Equals(patient.medicalHistory))
                    updatedFields.Add($"Medical History changed to: {changes.MedicalHistory.medicalHistory}");

                string logMessage = $"Patient {patient.Id}'s profile was updated by {user.Email.Value} on {DateTime.UtcNow}. Changes: {string.Join(", ", updatedFields)}";

            _logger.Information(logMessage);
        }

        public void LogEditPatientProfile(Patient patient, User user, PatientUpdateDTO dto)
        {
            string logMessage = $"Patient {patient.Id} profile was edited on {DateTime.UtcNow}";
            _logger.Information(logMessage);
        }
        

        public void LogEditStaff(DDDSample1.Domain.Staff.Staff staff, string adminEmail)
        {
            string logMessage = $"Staff {staff.Id.Value} was edited by Admin ({adminEmail}) on {DateTime.UtcNow}";

                _logger.Information(logMessage);
            }

        public void LogDeletionCompleted(User user)
        {
            string logMessage = $"Deletion of patient with user id {user.Id.AsString()} was completed on {DateTime.UtcNow}";
            _logger.Information(logMessage);
        }

        public void LogUpdateOperationRequisition(string requisitionId, string updatedFields, string userEmail)
        {
            string logMessage = $"Operation Requisition {requisitionId} was updated by {userEmail} on {DateTime.UtcNow}. Changes: {updatedFields}";

            _logger.Information(logMessage);
        }
    }
}
