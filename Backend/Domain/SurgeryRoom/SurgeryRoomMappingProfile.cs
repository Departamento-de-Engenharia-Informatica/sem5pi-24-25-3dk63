using AutoMapper;
using DDDSample1.Domain.SurgeryRooms;
using Backend.Domain.SurgeryRoom;
using DDDSample1.Domain.SurgeryRooms.ValueObjects;

public class SurgeryRoomMappingProfile : Profile
{
    public SurgeryRoomMappingProfile()
    {
        CreateMap<SurgeryRoomEntity, SurgeryRoomDTO>()
            .ForMember(dest => dest.RoomId, opt => opt.MapFrom(src => src.Id.AsGuid()))
            .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.RoomNumber))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Capacity, opt => opt.MapFrom(src => src.Capacity))
            .ForMember(dest => dest.AssignedEquipment, opt => opt.MapFrom(src => src.AssignedEquipment))
            .ForMember(dest => dest.CurrentStatus, opt => opt.MapFrom(src => src.CurrentStatus))
            .ForMember(dest => dest.MaintenanceSlots, opt => opt.MapFrom(src => src.MaintenanceSlots));

        CreateMap<CreatingSurgeryRoomDto, SurgeryRoomEntity>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => new RoomId(Guid.NewGuid())))
            .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.RoomNumber))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Capacity, opt => opt.MapFrom(src => src.Capacity))
            .ForMember(dest => dest.AssignedEquipment, opt => opt.MapFrom(src => src.AssignedEquipment))
            .ForMember(dest => dest.CurrentStatus, opt => opt.MapFrom(src => src.CurrentStatus))
            .ForMember(dest => dest.MaintenanceSlots, opt => opt.MapFrom(src => src.MaintenanceSlots)); 
    }
}

