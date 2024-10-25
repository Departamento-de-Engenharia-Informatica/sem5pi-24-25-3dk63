using AutoMapper;
using DDDSample1.Domain.PendingChangeStaff;

public class PendingChangesStaffMappingProfile : Profile
{
    public PendingChangesStaffMappingProfile()
    {
        CreateMap<PendingChangesStaffDTO, PendingChangesStaff>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src => src.Specialization));
        
        CreateMap<PendingChangesStaff, PendingChangesStaffDTO>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src => src.Specialization));
    }
}
