using AutoMapper;
using DDDSample1.Domain.Users;
using DDDSample1.Domain;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;

public class OperationTypeMappingProfile : Profile
{
    public OperationTypeMappingProfile()
    {
        // Map OperationType -> OperationTypeDTO
        CreateMap<OperationType, OperationTypeDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.AsGuid()))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.RequiredStaff, opt => opt.MapFrom(src => src.RequiredStaff.Select(rs => rs.RequiredNumber).ToList())) // Converte para lista de inteiros
            .ForMember(dest => dest.Specializations, opt => opt.MapFrom(src => src.Specializations))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Active));

        // Map OperationTypeDTO -> OperationType
        CreateMap<OperationTypeDTO, OperationType>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => new OperationTypeId(src.Id)))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration))
            .ForMember(dest => dest.RequiredStaff, opt => opt.MapFrom(src => src.RequiredStaff.Select(id => new RequiredStaff(id)).ToList())) // Converte lista de inteiros para lista de objetos
            .ForMember(dest => dest.Specializations, opt => opt.MapFrom(src => src.Specializations))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Active));
    }
}
