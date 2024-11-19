using AutoMapper;
using DDDSample1.Domain.PendingChange;

public class PendingChangesMappingProfile : Profile
{
    public PendingChangesMappingProfile()
    {
        CreateMap<PendingChangesDTO, PendingChanges>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.EmergencyContact, opt => opt.MapFrom(src => src.EmergencyContact))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.MedicalHistory, opt => opt.MapFrom(src => src.MedicalHistory));
        
        CreateMap<PendingChanges, PendingChangesDTO>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Name.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Name.LastName))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.EmergencyContact, opt => opt.MapFrom(src => src.EmergencyContact))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.MedicalHistory, opt => opt.MapFrom(src => src.MedicalHistory));
    }
}
