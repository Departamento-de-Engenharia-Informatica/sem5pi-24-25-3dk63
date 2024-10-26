/*using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;
using DDDSample1.Domain;
using DDDSample1.Domain.Specialization;
using Moq;
using DDDSample1.OperationsType;
using Backend.Domain.Shared;
using AutoMapper;
using Backend.Domain.Specialization.ValueObjects;



namespace Backend.Tests.Services
{
    public class OperationTypeServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationTypeRepository> _operationTypeRepositoryMock;
        private readonly Mock<ISpecializationRepository> _specializationRepository;
        private readonly Mock<IConfiguration> _configuration;
       private readonly Mock<IAuditService> _auditService;
       private readonly Mock<IMapper> _mapper;
        private readonly OperationTypeService _operationTypeService;

        public OperationTypeServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();
            _specializationRepository = new Mock<ISpecializationRepository>();
            _configuration = new Mock<IConfiguration>();
            _auditService = new Mock<IAuditService>();
            _mapper = new Mock<IMapper>();

            _operationTypeService = new OperationTypeService(
                _mapper.Object,
                _unitOfWorkMock.Object,
                _operationTypeRepositoryMock.Object,
                _configuration.Object,
                _auditService.Object,
                _specializationRepository.Object
            );
        }

        /*
        GetAllAsync                 Check
        GetByIdAsync                Check
        AddAsync                    Check
        DeleteAsync                 Check
        UpdateAsync                 
        DeleteAsync
        DeactivateAsync
        *//*

        [Fact]
        public async Task GetAllAsync_ShouldReturnOperationTypeDTOList()
        {
            // Arrange
            var operationTypes = new List<OperationType>
            {
                new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")))
            };

            _operationTypeRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);
            _mapper.Setup(m => m.Map<List<OperationTypeDTO>>(operationTypes)).Returns(new List<OperationTypeDTO>
            {
                new OperationTypeDTO
                {
                    Name = new OperationName("operaçao1"),
                    Duration = new Duration(30, 10, 10),
                    RequiredStaff = new RequiredStaff(2),
                    SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
                }
            });

            // Act
            var result = await _operationTypeService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationTypes.Count, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationType = new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")));

            _operationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);
            _mapper.Setup(m => m.Map<OperationTypeDTO>(operationType)).Returns(new OperationTypeDTO
            {
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            });

            // Act
            var result = await _operationTypeService.GetByIdAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var dto = new CreatingOperationTypeDTO(
                "operaçao1",
                10,
                10,
                10,
                2,
                "teste"
                );

                // Simulate that the specialization exists
    var specializationId = Guid.NewGuid(); 
    var specialization = new Specialization(new SpecializationId(specializationId), new Description("teste"), 123);

    _specializationRepository.Setup(repo => repo.GetByDescriptionAsync(It.IsAny<Description>()))
        .ReturnsAsync(specialization); 

    // Act
    var result = await _operationTypeService.AddAsync(dto, "teste@teste.com");

    // Assert
    _operationTypeRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<OperationType>()), Times.Once);
    Assert.NotNull(result);
    Assert.Equal("operaçao1", result.Name.Description); 
}

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenNameExistes()
        {
            // Arrange
            var dto = new CreatingOperationTypeDTO(
                "operaçao1",
                10,
                10,
                10,
                2,
                "teste"
                );          

            var existingOperationType = new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")));
            
           _operationTypeRepositoryMock
        .Setup(repo => repo.GetByNameAsync("operaçao1"))
        .ReturnsAsync(existingOperationType);
            // Act
            // Assert
            var exception=await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _operationTypeService.AddAsync(dto,"teste@teste.com"));
            Assert.Equal("Operation type já existe no sistema, por favor tente novamente com outro nome.", exception.Message);
    }

    [Fact]
public async Task AddAsync_ShouldThrowException_WhenSpecializationDoesNotExist()
{
    // Arrange
    var dto = new CreatingOperationTypeDTO(
        "operaçao1",
        10,
        10,
        10,
        2,
        "teste"
    );

    _specializationRepository
        .Setup(repo => repo.FindByIdAsync(It.IsAny<SpecializationId>()))
        .ReturnsAsync((Specialization)null); 

    // Act
    // Assert
    var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => 
        _operationTypeService.AddAsync(dto, "teste@teste.com"));

    Assert.Equal("A especialização não existe.", exception.Message);
}

        [Fact]
        public async Task DeleteAsync_ShouldThrowException_WhenOperationTypeIsActive()
        {
            // Arrange
            var operationTypeId = new OperationTypeId(Guid.NewGuid());

            // Mock the repository to return the active operation type
            _operationTypeRepositoryMock
                .Setup(repo => repo.GetByNameAsync("operaçao1"))
                .ReturnsAsync(new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))));

            // Act & Assert
            var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => 
                _operationTypeService.DeleteAsync(operationTypeId));

            Assert.Equal("Não é possível excluir um tipo de operação ativo.", exception.Message);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var operationTypeId = new OperationTypeId(Guid.NewGuid());

            // Mock the repository to return the inactive operation type
            _operationTypeRepositoryMock
                .Setup(repo => repo.GetByNameAsync("operaçao1"))
                .ReturnsAsync(new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))));

            // Act
            var result = await _operationTypeService.DeleteAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var dto = new OperationTypeDTO
            {
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            };

            var operationType = new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")));

            _operationTypeRepositoryMock
                .Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>()))
                .ReturnsAsync(operationType);

            // Act
            var result = await _operationTypeService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            
        }


    }
}
*/