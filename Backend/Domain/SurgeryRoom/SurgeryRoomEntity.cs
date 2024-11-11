using DDDSample1.Domain.SurgeryRooms.ValueObjects;
using DDDSample1.Domain.Shared;
using Backend.Domain.SurgeryRoom;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomEntity : Entity<RoomId>, IAggregateRoot
    {
        public RoomNumber RoomNumber { get; private set; }
        public RoomType Type { get; private set; }
        public Capacity Capacity { get; private set; }
        public List<Equipment> AssignedEquipment { get; private set; }
        public RoomStatus CurrentStatus { get; private set; }
        public List<MaintenanceSlot> MaintenanceSlots { get; private set; }
        protected SurgeryRoomEntity() { }


        public SurgeryRoomEntity(RoomNumber roomNumber, RoomType type, Capacity capacity, List<Equipment> assignedEquipment, RoomStatus status)
        {
            this.Id = new RoomId(Guid.NewGuid());
            this.RoomNumber = roomNumber;
            this.Type = type;
            this.Capacity = capacity;
            this.AssignedEquipment = assignedEquipment ?? new List<Equipment>();
            this.CurrentStatus = status;
            this.MaintenanceSlots = new List<MaintenanceSlot>();
        }

        public void ScheduleMaintenance(MaintenanceSlot slot)
        {
            if (CurrentStatus.Value != RoomStatusEnum.Available)
            {
                throw new BusinessRuleValidationException("Room is not available for maintenance.");
            }
            MaintenanceSlots.Add(slot);
            CurrentStatus = new RoomStatus(RoomStatusEnum.UnderMaintenance);
        }

        //change room number
        public void ChangeRoomNumber(RoomNumber roomNumber)
        {
            this.RoomNumber = roomNumber;
        }

        //change room type
        public void ChangeRoomType(RoomType type)
        {
            this.Type = type;
        }

        //change capacity
        public void ChangeCapacity(Capacity capacity)
        {
            this.Capacity = capacity;
        }

        //change equipment
        public void ChangeAssignedEquipment(List<Equipment> equipment)
        {
            this.AssignedEquipment = equipment;
        }

        //change status
        public void ChangeCurrentStatus(RoomStatus status)
        {
            this.CurrentStatus = status;
        }

        //change maintenance slots
        public void ChangeMaintenanceSlots(List<MaintenanceSlot> slots)
        {
            this.MaintenanceSlots = slots;
        }

    }
}
