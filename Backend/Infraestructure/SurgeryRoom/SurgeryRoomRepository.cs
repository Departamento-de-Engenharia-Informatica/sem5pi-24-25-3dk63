using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domain.SurgeryRoom;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.SurgeryRooms.ValueObjects;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infraestructure.SurgeryRoom
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoomEntity, RoomId>, ISurgeryRoomRepository
    {
        private readonly DDDSample1DbContext _context;

        public SurgeryRoomRepository(DDDSample1DbContext context) : base(context.SurgeryRooms)
        {
            _context = context;
        }

        public async Task<SurgeryRoomEntity> GetByRoomNumberAsync(string roomNumber)
        {
            return await _context.SurgeryRooms
                .FirstOrDefaultAsync(sr => sr.RoomNumber.ToString() == roomNumber);
        }



        public async Task<List<SurgeryRoomEntity>> GetAvailableRoomsAsync(DateTime startTime, DateTime endTime)
        {
            return await _context.Set<SurgeryRoomEntity>()
                .Where(r => r.CurrentStatus.Value == RoomStatusEnum.Available &&
                            !r.MaintenanceSlots.Any(m => m.ConflictsWith(startTime, endTime)))
                .ToListAsync();
        }

    }
}
