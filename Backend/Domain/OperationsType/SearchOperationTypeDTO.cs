using Backend.Domain.Specialization.ValueObjects;

namespace DDDSample1.Domain.OperationsType
{
    public class SearchOperationTypeDTO
    {
        public OperationName Name { get; set; }
        public Description Specialization { get; set; }
        public bool Active { get; set; }
        public RequiredStaff RequiredStaff { get; set; }
        public Duration Duration { get; set; }
    }

}