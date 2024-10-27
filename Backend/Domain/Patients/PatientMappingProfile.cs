using AutoMapper;
using DDDSample1.Domain;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;

public class PatientMappingProfile : Profile
{
    public PatientMappingProfile()
    {
        CreateMap<Patient, PatientDTO>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.AsString())) // Use AsString() to get the string representation
            .ForMember(dest => dest.dateOfBirth, opt => opt.MapFrom(src => src.dateOfBirth))
            .ForMember(dest => dest.gender, opt => opt.MapFrom(src => src.gender))
            .ForMember(dest => dest.medicalHistory, opt => opt.MapFrom(src => src.medicalHistory))
            .ForMember(dest => dest.emergencyContact, opt => opt.MapFrom(src => src.emergencyContact))
            .ForMember(dest => dest.appointmentHistoryList, opt => opt.MapFrom(src => src.appointmentHistoryList))
            .ForMember(dest=> dest.Active, opt => opt.MapFrom(src => src.Active));;

        CreateMap<PatientDTO, Patient>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id)) // Assuming Id is already in correct string format
            .ForMember(dest => dest.dateOfBirth, opt => opt.MapFrom(src => src.dateOfBirth))
            .ForMember(dest => dest.gender, opt => opt.MapFrom(src => src.gender))
            .ForMember(dest => dest.medicalHistory, opt => opt.MapFrom(src => src.medicalHistory))
            .ForMember(dest => dest.emergencyContact, opt => opt.MapFrom(src => src.emergencyContact))
            .ForMember(dest => dest.appointmentHistoryList, opt => opt.MapFrom(src => src.appointmentHistoryList))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Active));
    }
}
