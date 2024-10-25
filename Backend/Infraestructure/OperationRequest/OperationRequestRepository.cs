using DDDSample1.Domain;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
        private readonly DDDSample1DbContext _context;

        public OperationRequestRepository(DDDSample1DbContext context) : base(context.OperationRequests)
        {
            _context = context;
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            var lastUser = await _context.Users
                .OrderByDescending(u => u.SequentialNumber)
                .FirstOrDefaultAsync();

            return lastUser != null ? lastUser.SequentialNumber + 1 : 1;
        }

        public async Task<List<OperationRequest>> GetByPriorityAsync(Priority priority) 
        {
            return await _context.OperationRequests
                .Where(x => x.priority == priority)
                .ToListAsync(); 

        }

        public async Task<bool> IsDuplicateRequestAsync(OperationTypeId operationTypeId, MedicalRecordNumber medicalRecordNumber)
        {
            return await _context.OperationRequests.AnyAsync(o => o.operationTypeId == operationTypeId &&
                                                 o.medicalRecordNumber == medicalRecordNumber &&
                                                 o.Active);
        }

        public async Task UpdateOperationRequestAsync(OperationRequest operationRequest)
        {
            _context.Entry(operationRequest).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
