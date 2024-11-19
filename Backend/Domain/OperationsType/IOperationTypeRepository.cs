using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specialization;
using DDDSample1.Domain.Users;


namespace DDDSample1.Domain.OperationsType
{
    public interface IOperationTypeRepository : IRepository<OperationType, OperationTypeId>
    {
        Task<OperationType> GetByNameAsync(String name);
        Task<List<OperationType>> GetBySpecializationAsync(SpecializationId id);
        Task<OperationType> GetActiveOperationTypeByIdAsync(OperationTypeId id);
        Task<bool> DeleteAsync(OperationTypeId id);
        IQueryable<OperationType> GetQueryable();
        //get all active
        Task<List<OperationType>> GetAllActiveAsync();

    }
}
