using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;

namespace DDDSample1.OperationsType
{
    public class UpdateOperationTypeDTO
    {
        public string? Name { get; set; }
        public int? Preparation { get; set; }
        public int? Surgery { get; set; }
        public int? Cleaning { get; set; }
        public int? RequiredStaff { get; set; }
        public string? Speciality { get; set; }

    }
}