using DDDSample1.Domain;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository
    {
        private readonly DDDSample1DbContext _context;

        public AppointmentRepository(DDDSample1DbContext context) : base(context.Appointments)
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

        public async Task<List<Appointment>> GetByDateAsync(Date date) 
        {
            return await _context.Appointments
                .Where(x => x.date == date)
                .ToListAsync(); 

        }

        public async Task<Appointment> GetByOperationRequestIdAsync(OperationRequestId operationRequestId)
        {
            return await _context.Appointments
                .FirstOrDefaultAsync(a => a.operationRequestId == operationRequestId);
        }
    }
}
