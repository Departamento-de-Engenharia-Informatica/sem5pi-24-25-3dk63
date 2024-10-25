using DDDSample1.Domain.Shared;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Specialization;


namespace DDDSample1.Domain
{

    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        public OperationName Name { get; private set; }
        public Duration Duration { get; private set; }
        public RequiredStaff RequiredStaff { get; private set; }
        public SpecializationId SpecializationId { get; private set; }
        public bool Active { get; private set; }

    public OperationType()
    {
        this.Active = true;
    }

    public OperationType(OperationName name, Duration duration, RequiredStaff requiredStaff, SpecializationId specializationId)
        {
            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Active = true;
            this.Name = name;
            this.Duration = duration;
            this.RequiredStaff = requiredStaff;
            this.SpecializationId = specializationId;
        }

    public void ChangeName(OperationName name)
    {
        if (!this.Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
        this.Name = name;
    }

    public void ChangeDuration(Duration duration)
    {
        if (!this.Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
        this.Duration = duration;
    }

        public void ChangeRequiredStaff(RequiredStaff requiredStaff)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
            this.RequiredStaff = requiredStaff;
        }

        public void ChangeSpecializationId(SpecializationId specializationId)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
            this.SpecializationId = specializationId;
        }

        public void Deactivate()
        {
            this.Active = false;
    }
    }
}

    
