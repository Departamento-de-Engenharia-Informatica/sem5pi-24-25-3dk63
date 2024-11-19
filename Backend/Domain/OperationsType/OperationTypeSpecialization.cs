using DDDSample1.Domain.Shared;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Specialization;


namespace DDDSample1.Domain
{
public class OperationTypeSpecialization
{
    public Guid SpecializationId { get; set; }
    public Specialization.Specialization Specialization { get; set; }

    public Guid OperationTypeId { get; set; }
    public OperationType OperationType { get; set; }
}

}