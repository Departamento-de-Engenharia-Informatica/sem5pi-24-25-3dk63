using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;
using DDDSample1.Domain;
using DDDSample1.Domain.Specialization;


namespace Backend.Tests.Domain.Tests.ValueObjects
{

    /* fazer testes para operationtype:

    - passar dados corretos                 check
    - passar name vazio                     check
    - passar duration inválido              check
    - passar required staff inválido        check
    - mudar estado para inativo             check
    - mudar estado para ativo               check
    - mudar name                            check
    - mudar duration                        check
    - mudar required staff                  check
    - mudar specializationUd                check

*/
    public class OperationsTypeTest
    {
        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void GivenValidOperationType_WhenConstructed_ThenOperationTypeShouldBeCreated(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));
            
            int total = preparation + surgery + cleaning;

            // Assert
            Assert.NotNull(operationType);
            Assert.True(operationType.Active);
            Assert.Equal(operationName, operationType.Name.ToString());
            Assert.Equal(preparation, operationType.Duration.PreparationPhase);
            Assert.Equal(surgery, operationType.Duration.SurgeryPhase);
            Assert.Equal(cleaning, operationType.Duration.CleaningPhase);
            Assert.Equal(total, operationType.Duration.TotalDuration);
            Assert.Equal(requiredStaff, operationType.RequiredStaff.RequiredNumber);
            Assert.Equal(specializationId, operationType.SpecializationId.AsString());
        }

        [Theory]
        [InlineData("", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData(" ", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("    ", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void GivenEmptyName_WhenConstructed_ThenOperationTypeShouldBeCreated(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
                    var exception = Assert.Throws<BusinessRuleValidationException>(() => new OperationType( 
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId))));
        
                Assert.Equal("Operation name cannot be empty or empty.", exception.Message);
    
        }

        [Theory]
        [InlineData("Operação 1", 0, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 0, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 0, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 4", 0, 0, 0, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 5", -1, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 6", 15, -1, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 7", 20, 30, -1, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 8", -1, -1, -1, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void GivenInvalidDuration_WhenConstructed_ThenOperationTypeShouldBeCreated(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new OperationType( 
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId))));
        
                Assert.Equal("All durations must be provided and bigger than 0.", exception.Message);
    
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 0, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 10, 20, 30, -1, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void GivenInvalidRequiredStaff_WhenConstructed_ThenOperationTypeShouldBeCreated(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var exception = Assert.Throws<BusinessRuleValidationException>(() => new OperationType( 
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId))));
        
                Assert.Equal("Number of required staff must be bigger than 0.", exception.Message);
    
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingActiveToFalse_OperationTypeIsInactive(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.Deactivate();

            Assert.False(operationType.Active);
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingActiveToTrue_OperationTypeIsActive(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.Deactivate();
            operationType.Activate();

            Assert.True(operationType.Active);
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingName_OperationType(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.ChangeName(new OperationName("Operação 4"));

            Assert.Equal("Operação 4", operationType.Name.ToString());
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingDuration_OperationType(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.ChangeDuration(new Duration(10, 20, 30));

            Assert.Equal(10, operationType.Duration.PreparationPhase);
            Assert.Equal(20, operationType.Duration.SurgeryPhase);
            Assert.Equal(30, operationType.Duration.CleaningPhase);
            Assert.Equal(60, operationType.Duration.TotalDuration);
        }

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingRequiredStaff_OperationType(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.ChangeRequiredStaff(new RequiredStaff(10));

            Assert.Equal(10, operationType.RequiredStaff.RequiredNumber);
        }        

        [Theory]
        [InlineData("Operação 1", 10, 20, 30, 6, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 2", 15, 25, 35, 8, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        [InlineData("Operação 3", 20, 30, 40, 10, "d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")]
        public void WhenChangingSpecializationId_OperationType(String operationName, int preparation, int surgery, int cleaning, int requiredStaff, string specializationId)
        {
            var operationType = new OperationType(
                new OperationName(operationName),
                new Duration(preparation, surgery, cleaning),
                new RequiredStaff(requiredStaff),
                new SpecializationId(Guid.Parse(specializationId)));

            operationType.ChangeSpecializationId(new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6b")));

            Assert.Equal("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6b", operationType.SpecializationId.AsString());
        }
    }
}