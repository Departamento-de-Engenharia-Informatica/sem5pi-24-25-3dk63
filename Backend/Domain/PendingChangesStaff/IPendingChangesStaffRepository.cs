using DDDSample1.Domain.Users;

namespace DDDSample1.Domain.PendingChangeStaff
{
    public interface IPendingChangesStaffRepository
    {
        Task<PendingChangesStaff?> GetPendingChangesByUserIdAsync(UserId userId);
        Task AddPendingChangesStaffAsync(PendingChangesStaff pendingChanges);
        Task RemovePendingChangesStaffAsync(UserId userId);
    }
}
