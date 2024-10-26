using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Patients;


namespace DDDSample1.Domain
{

    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        public Deadline deadline { get; private set; }
        public Priority priority { get; private set; }
        public LicenseNumber licenseNumber  { get; private set; }
        public OperationTypeId operationTypeId { get; private set; }
        public MedicalRecordNumber medicalRecordNumber { get; private set; }
        public bool Active { get; private set; }

        private OperationRequest()
        {
            this.Active = true;
        }

        public OperationRequest(OperationTypeId operationTypeId,Deadline deadline, Priority priority, LicenseNumber licenseNumber, 
        MedicalRecordNumber medicalRecordNumber){
            this.Id = new OperationRequestId(Guid.NewGuid());
            this.Active = true;

            if(deadline == null) throw new BusinessRuleValidationException("Deadline is required");
            this.deadline=  deadline;

            if(priority == null) throw new BusinessRuleValidationException("Priority is required");
            this.priority = priority;

            if(medicalRecordNumber == null) throw new BusinessRuleValidationException("Medical record number is required");
            this.medicalRecordNumber = medicalRecordNumber;
            
            if(operationTypeId == null) throw new BusinessRuleValidationException("Operation type is required");
            this.operationTypeId = operationTypeId;

            if(licenseNumber == null) throw new BusinessRuleValidationException("License number is required");
            this.licenseNumber = licenseNumber;

        }

        public void ChangeDeadLine(Deadline deadline)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
            this.deadline = deadline;
        }

        public void ChangePriority(Priority priority)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
            this.priority = priority;
        }

        public void ChangeLicenseNumber(LicenseNumber licenseNumber)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
            this.licenseNumber = licenseNumber;
        }

        public void ChangeOperationTypeId(OperationTypeId operationTypeId)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
            this.operationTypeId = operationTypeId;
        }

        public void ChangeMedicalRecordNumber(MedicalRecordNumber medicalRecordNumber)
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
            this.medicalRecordNumber = medicalRecordNumber;
        }

        public void Deactivate()
        {
            if (!this.Active) throw new BusinessRuleValidationException("Operation request is already inactive");
            this.Active = false;
        }

        public void Activate()
        {
            if (this.Active) throw new BusinessRuleValidationException("Operation request is already active");
            this.Active = true;
        }
    }
}

    

