using System.ComponentModel;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;


namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        Task<int> GetNextSequentialNumberAsync();
        Task<List<OperationRequest>> GetByPriorityAsync(Priority priority);
        Task<bool> IsDuplicateRequestAsync(OperationTypeId operationTypeId, MedicalRecordNumber medicalRecordNumber);

        Task UpdateOperationRequestAsync(OperationRequest operationRequest);

        Task<List<OperationRequest>> SearchOperationRequestsAsync(string firstName, 
            string lastName, 
            string operationType, 
            string status, 
            Priority? priority,
            DateTime? dateRequested = null,
            DateTime? dueDate = null,
            LicenseNumber doctorId = null);

    }
}
