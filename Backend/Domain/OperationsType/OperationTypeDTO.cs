using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Specialization;

namespace DDDSample1.Domain.OperationsType
{
    public class OperationTypeDTO
    {
        public Guid Id { get; set; }
        public OperationName Name { get; set; }
        public Duration Duration { get; set; }
        public RequiredStaff RequiredStaff { get; set; }
         public List<SpecializationId> Specializations { get; set; } // Alterado para lista
        public bool Active { get; set; }
    }
}
 
