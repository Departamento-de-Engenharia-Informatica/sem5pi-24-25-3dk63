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
        public List<RequiredStaff> RequiredStaff { get; private set; }
        public List<SpecializationId> Specializations { get; private set; }
        public bool Active { get; private set; }

        public OperationType()
        {
            this.Active = true;
        }

        public OperationType(OperationName name, Duration duration, List<RequiredStaff> requiredStaff, List<SpecializationId> specializations)
        {
            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Active = true;
            this.Name = name;
            this.Duration = duration;
            this.RequiredStaff = requiredStaff?? new List<RequiredStaff>();
            this.Specializations = specializations ?? new List<SpecializationId>();
        }

        public OperationType(OperationTypeId id, OperationName name, Duration duration, List<RequiredStaff> requiredStaff, List<SpecializationId> specializations)
        {
            this.Id = id;
            this.Active = true;
            this.Name = name;
            this.Duration = duration;
            this.RequiredStaff = requiredStaff?? new List<RequiredStaff>();
            this.Specializations = specializations ?? new List<SpecializationId>();
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

        public void ChangeRequiredStaff(List<RequiredStaff> requiredStaff)
        {
            if (!Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
            RequiredStaff = requiredStaff ?? new List<RequiredStaff>();
        }

        public void ChangeSpecializationId(List<SpecializationId> specializations)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation type cannot be changed in this state");
            this.Specializations = specializations ?? new List<SpecializationId>();
        }

        public void Activate()
        {
            this.Active = true;
        }
        
        public void Deactivate()
        {
            this.Active = false;
        }

        public void setId (OperationTypeId id)
        {
            this.Id = id;
        }

        

    }
}

    
