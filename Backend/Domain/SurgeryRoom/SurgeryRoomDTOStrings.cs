




using System;
using DDDSample1.Domain.SurgeryRooms.ValueObjects;

namespace Backend.Domain.SurgeryRoom
{
  public class SurgeryRoomDTOStrings
  {
    public Guid RoomId { get; set; }
    public string RoomNumber { get; set; }
    public string Type { get; set; }
    public int Capacity { get; set; }
    public List<Equipment> AssignedEquipment { get; set; }
    public string CurrentStatus { get; set; }
    public List<MaintenanceSlot> MaintenanceSlots { get; set; }
  }

}
