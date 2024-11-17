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
            try
            {
                return await _context.PendingChangesStaff
                    .FirstOrDefaultAsync(pc => pc.UserId == userId);
            }
            catch (Exception ex)
            {
                // Logando a exceção
                Console.WriteLine($"An error occurred while retrieving pending changes for UserId: {userId}. Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                // Re-throwing the exception to be handled by higher layers (optional, depending on your logic)
                throw new Exception("An error occurred while retrieving pending changes.", ex);
            }
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
