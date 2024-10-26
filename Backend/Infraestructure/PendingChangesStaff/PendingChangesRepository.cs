using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.PendingChangeStaff;

namespace DDDSample1.Infrastructure.PendingChangeStaff
{
    public class PendingChangesStaffRepository : IPendingChangesStaffRepository
    {
        private readonly DDDSample1DbContext _context;

        public PendingChangesStaffRepository(DDDSample1DbContext context)
        {
            _context = context;
        }

        public async Task<PendingChangesStaff?> GetPendingChangesByUserIdAsync(UserId userId)
        {
            return await _context.PendingChangesStaff
                .FirstOrDefaultAsync(pc => pc.UserId == userId);
        }

        public async Task AddPendingChangesStaffAsync(PendingChangesStaff pendingChanges)
        {
            await _context.PendingChangesStaff.AddAsync(pendingChanges);
            await _context.SaveChangesAsync();
        }
        
        public async Task RemovePendingChangesStaffAsync(UserId userId)
        {
            var pendingChangesStaff = await GetPendingChangesByUserIdAsync(userId);
            if (pendingChangesStaff != null)
            {
                _context.PendingChangesStaff.Remove(pendingChangesStaff);
                await _context.SaveChangesAsync();
            }
        }
    }
}
