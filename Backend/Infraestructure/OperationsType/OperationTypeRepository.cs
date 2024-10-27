using DDDSample1.Domain;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Specialization;

namespace DDDSample1.Infrastructure.OperationsType
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
        private readonly DDDSample1DbContext _context;

        public OperationTypeRepository(DDDSample1DbContext context) : base(context.OperationsTypes)
        {
            _context = context;
        }

        public async Task<OperationType> GetByNameAsync(string name)
        {
            return await _context.OperationsTypes
                .FirstOrDefaultAsync(o => o.Name.Description == name && o.Active);
        }

        public async Task<OperationType> GetBySpecializationAsync(SpecializationId id)
        {
            return await _context.OperationsTypes
                .FirstOrDefaultAsync(o => o.SpecializationId == id && o.Active);
        }


        public async Task<OperationType> GetActiveOperationTypeByIdAsync(OperationTypeId id)
        {
            return await _context.OperationsTypes
                .FirstOrDefaultAsync(o => o.Id == id && o.Active);
        }
        
        public async Task<bool> DeleteAsync(OperationTypeId id)
        {
            var operationType = await GetActiveOperationTypeByIdAsync(id);

            if (operationType == null)
            {
                return false;
            }

            _context.OperationsTypes.Remove(operationType);

            await _context.SaveChangesAsync();

            return true;
        }

        public IQueryable<OperationType> GetQueryable()
        {
            return _context.OperationsTypes.AsQueryable();
        }
    }
}
