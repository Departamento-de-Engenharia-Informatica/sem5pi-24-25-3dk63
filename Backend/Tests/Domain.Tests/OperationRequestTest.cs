using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;
using DDDSample1.Domain;
using DDDSample1.Domain.Specialization;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Patients;


namespace Backend.Tests.Domain.Tests.ValueObjects
{

/* fazer testes para operationRequest:

    - passar dados corretos                         Check                 
    - passar deadline inválido                      Check       
    - passar priority inválido                      Check
    - passar licenseNumber inválido                 Check
    - passar operationTypeId inválido               Check
    - passar medicalRecordNumber inválido           Check
    - mudar deadline                                Check
    - mudar priority                                Check
    - mudar licenseNumber                           Check
    - mudar operationTypeId                         Check
    - mudar medicalRecordNumber                     Check
    - desativar                                     Check
    - ativar                                        Check
*/

    public class OperationRequestTest
    {
        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        
        public void GivenValidData_ThenOperationRequestIsCreated(PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
           
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );
            Assert.NotNull(operationRequest);
            Assert.True(operationRequest.Active);
            Assert.Equal(priority, operationRequest.priority.Value);
            Assert.Equal(licenseNumber, operationRequest.licenseNumber.Value);
            Assert.Equal(operationTypeId, operationRequest.operationTypeId.Value.ToString());
            Assert.Equal(medicalRecordNumber, operationRequest.medicalRecordNumber.Value);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        
        public void GivenInvalidDealine_ThenOperationRequestIsNotCreated(PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
           
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(-1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            ));

            Assert.Equal("Deadline cannot be null or in the past", exception.Message);
        }

        
        [InlineData(PriorityType.Elective, " ", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void GivenInvalidLicenseNumber_ThenOperationRequestIsNotCreated(PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
           
            var exception = Assert.Throws<ArgumentException>(() => new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            ));

            Assert.Equal("Invalid license number format.", exception.Message);
        }


        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", " ", "202410123456")]

        public void GivenInvalidOperationTypeId_ThenOperationRequestIsNotCreated(PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
           
            var exception = Assert.Throws<FormatException>(() => new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            ));

            Assert.Equal("Unrecognized Guid format.", exception.Message);
        }

        
        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", " ")]
        public void GivenInvalidMedicalRecordNumber_ThenOperationRequestIsNotCreated(PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
           
            var exception = Assert.Throws<ArgumentException>(() => new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            ));

            Assert.Equal("Invalid medical record number format.", exception.Message);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingActiveToFalse_OperationRequestIsInactive( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.Deactivate();

            Assert.False(operationRequest.Active);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingActiveToTrue_OperationRequestIsActive( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.Deactivate();
            operationRequest.Activate();

            Assert.True(operationRequest.Active);
        }

        [Theory]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingPrioriry_OperationRequest( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.ChangePriority(new Priority(PriorityType.Elective));

            Assert.Equal(PriorityType.Elective, operationRequest.priority.Value);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingDeadline_OperationRequest( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            DateTime newDeadline = DateTime.Now.AddDays(2);

            operationRequest.ChangeDeadLine(new Deadline(newDeadline));

                // Assert - Compare only the date
            Assert.Equal(newDeadline.Date, operationRequest.deadline.Value.Date);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingLicenseNumber_OperationRequest( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.ChangeLicenseNumber(new LicenseNumber("654321"));

            Assert.Equal("654321", operationRequest.licenseNumber.Value);
        }
        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingMedicalRecordNumber_OperationRequest( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.ChangeMedicalRecordNumber(new MedicalRecordNumber("202410888888"));

            Assert.Equal("202410888888", operationRequest.medicalRecordNumber.Value);
        }

        [Theory]
        [InlineData(PriorityType.Urgent, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Elective, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        [InlineData(PriorityType.Emergency, "123456", "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", "202410123456")]
        public void WhenChangingOperationTypeId_OperationRequest( PriorityType priority, string licenseNumber, string operationTypeId, string medicalRecordNumber)
        {
            OperationRequest operationRequest = new OperationRequest(
                new OperationTypeId(operationTypeId),
                new Deadline(DateTime.Now.AddDays(1)), 
                new Priority(priority),
                new LicenseNumber (licenseNumber),
                new MedicalRecordNumber(medicalRecordNumber)
            );

            operationRequest.ChangeOperationTypeId(new OperationTypeId("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"));

            Assert.Equal("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a", operationRequest.operationTypeId.Value.ToString());
        }
    }
}
