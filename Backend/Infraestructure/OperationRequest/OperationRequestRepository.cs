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

        public async Task<List<OperationRequest>> SearchOperationRequestsAsync(
            string firstName, 
            string lastName, 
            string operationType, 
            string status, 
            Priority? priority,
            DateTime? dateRequested = null,
            DateTime? dueDate = null,
            string doctorId = null)
        {
            var query = _context.OperationRequests.AsQueryable();

            if (!string.IsNullOrWhiteSpace(firstName) || !string.IsNullOrWhiteSpace(lastName))
            {
                query = query.Where(or =>
                    or.medicalRecordNumber != null &&
                    _context.Patients.Any(p =>
                        p.Id == or.medicalRecordNumber &&
                        _context.Users.Any(u =>
                            u.Id == p.UserId &&
                            (string.IsNullOrWhiteSpace(firstName) || u.Name.FirstName.ToLower() == firstName.ToLower()) &&
                            (string.IsNullOrWhiteSpace(lastName) || u.Name.LastName.ToLower() == lastName.ToLower()))));
            }
            else if (!string.IsNullOrEmpty(doctorId))
            {
                query = query.Where(or => or.licenseNumber.ToString() == doctorId);
            }

            if (!string.IsNullOrWhiteSpace(operationType))
            {
                operationType = operationType.Trim();
                var operationTypeId = new OperationTypeId(operationType);

                query = query.Where(or =>
                    or.operationTypeId != null &&
                    _context.OperationsTypes.Any(op =>
                        op.Id == or.operationTypeId && 
                        op.Active && 
                        op.Id == operationTypeId));
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                status = status.Trim();

                if (status.Equals("active", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(or => or.Active == true);
                }
                else if (status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(or => or.Active == false);
                }
            }

            if (priority != null)
            {
                query = query.Where(or => or.priority != null && or.priority.Value == priority.Value);
            }

            if (dateRequested.HasValue)
            {
                query = query.Where(or => or.createdDate.Date == dateRequested.Value.Date);
            }

            if (dueDate.HasValue)
            {
                query = query.Where(or => or.deadline.Value.Date == dueDate.Value.Date);
            }

            return await query.ToListAsync();
        }

    }
}
