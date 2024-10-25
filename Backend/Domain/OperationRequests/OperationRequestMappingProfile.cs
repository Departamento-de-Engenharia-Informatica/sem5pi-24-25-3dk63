using AutoMapper;
using DDDSample1.Domain;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;

public class OperationRequestMappingProfile : Profile
{
    public OperationRequestMappingProfile()
    {
        // Map from OperationRequest to OperationRequestDTO
        CreateMap<OperationRequest, OperationRequestDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.AsGuid()))
            .ForMember(dest => dest.Deadline, opt => opt.MapFrom(src => src.deadline))
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.priority))
            .ForMember(dest => dest.LicenseNumber, opt => opt.MapFrom(src => src.licenseNumber))
            .ForMember(dest => dest.MedicalRecordNumber, opt => opt.MapFrom(src => src.medicalRecordNumber))
            .ForMember(dest => dest.OperationTypeId, opt => opt.MapFrom(src => src.operationTypeId));

        // Map from OperationRequestDTO to OperationRequest
        CreateMap<OperationRequestDTO, OperationRequest>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => new AppointmentId(src.Id)))
            .ForMember(dest => dest.deadline, opt => opt.MapFrom(src => src.Deadline))
            .ForMember(dest => dest.priority, opt => opt.MapFrom(src => src.Priority))
            .ForMember(dest => dest.licenseNumber, opt => opt.MapFrom(src => src.LicenseNumber))
            .ForMember(dest => dest.medicalRecordNumber, opt => opt.MapFrom(src => src.MedicalRecordNumber))
            .ForMember(dest => dest.operationTypeId, opt => opt.MapFrom(src => src.OperationTypeId));
    }
}
