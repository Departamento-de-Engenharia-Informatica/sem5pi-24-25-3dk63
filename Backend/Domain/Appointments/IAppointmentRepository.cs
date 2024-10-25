using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
        Task<int> GetNextSequentialNumberAsync();
        Task<List<Appointment>> GetByDateAsync(Date date);
        Task<Appointment> GetByOperationRequestIdAsync(OperationRequestId operationRequestId);
    }
}
