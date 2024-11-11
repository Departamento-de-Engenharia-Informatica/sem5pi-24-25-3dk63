


using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace Backend.Domain.SurgeryRoom
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoomEntity, RoomId>
    {
        Task<List<SurgeryRoomEntity>> GetAvailableRoomsAsync(DateTime startTime, DateTime endTime);

        Task<SurgeryRoomEntity> GetByRoomNumberAsync(string roomNumber);

    }
}
