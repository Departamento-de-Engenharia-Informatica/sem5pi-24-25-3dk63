using System;
using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Users;

namespace Backend.Domain.Shared
{
    public interface IAuditService
    {
        void LogDeletionPatient(Patient patient, string adminEmail);
        void LogDeactivateOperationType(OperationType operationType, string adminEmail);
        void LogCreateOperationType(OperationType operationType, string adminEmail);
        void LogDeactivateStaff(DDDSample1.Domain.Staff.Staff staff, string adminEmail);
        void LogProfileUpdate(PatientDTO patient, UserDTO user, PendingChangesDTO changes);
        void LogProfileStaffUpdate(StaffDTO staff, UserDTO user, PendingChangesStaffDTO changes);
        void LogEditPatientProfile(Patient patient, User user, PatientUpdateDTO dto);
        void LogEditStaff(DDDSample1.Domain.Staff.Staff staff, string adminEmail);
        void LogDeletionCompleted(User user);
        void LogUpdateOperationRequisition(string requisitionId, string updatedFields, string userEmail);
    }
}
    