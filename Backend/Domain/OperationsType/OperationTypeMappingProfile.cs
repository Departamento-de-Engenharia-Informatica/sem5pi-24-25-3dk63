using AutoMapper;
using DDDSample1.Domain.Users;
using DDDSample1.Domain;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;

public class OperationTypeMappingProfile : Profile
{
    public OperationTypeMappingProfile()
    {
        CreateMap<OperationType, OperationTypeDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.AsGuid()))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.RequiredStaff, opt => opt.MapFrom(src => src.RequiredStaff))
            .ForMember(dest => dest.SpecializationId, opt => opt.MapFrom(src => src.SpecializationId));

        CreateMap<OperationTypeDTO, OperationType>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => new OperationTypeId(src.Id)))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.RequiredStaff, opt => opt.MapFrom(src => src.RequiredStaff))
            .ForMember(dest => dest.SpecializationId, opt => opt.MapFrom(src => src.SpecializationId));
    }
}
