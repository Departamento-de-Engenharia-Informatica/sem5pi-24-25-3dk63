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
       private readonly Mock<IMapper> _mapper;
        private readonly OperationTypeService _operationTypeService;
        

        public OperationTypeServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();
            _specializationRepository = new Mock<ISpecializationRepository>();
            _configuration = new Mock<IConfiguration>();
            _mapper = new Mock<IMapper>();

            _operationTypeService = new OperationTypeService(
                _mapper.Object,
                _unitOfWorkMock.Object,
                _operationTypeRepositoryMock.Object,
                _configuration.Object,
                _specializationRepository.Object
            );
        }

        /*
        GetAllAsync                 Check
        GetByIdAsync                Check
        AddAsync                    Check
        DeleteAsync                 Check
        UpdateAsync                 Check
        DeleteAsync                 Check
        

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
        public async Task AddAsync_ShouldReturnOperationTypeDTO_WhenAddingValidOperationType()
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

            var specializationId = Guid.NewGuid(); 
            var specialization = new Specialization(new SpecializationId(specializationId), new Description("teste"), 123);

            _specializationRepository.Setup(repo => repo.GetByDescriptionAsync(It.IsAny<Description>()))
                .ReturnsAsync(specialization); 

            _operationTypeRepositoryMock.Setup(repo => repo.GetByNameAsync(dto.Name))
                .ReturnsAsync((OperationType)null); // Simulate that the operation type does not exist

                _operationTypeRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OperationType>()));
            // Act

                _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.CompletedTask);

            var result = await _operationTypeService.AddAsync(dto, "teste@teste.com");

            // Assert
            _operationTypeRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<OperationType>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once); // Ensure that commit was called
            Assert.NotNull(result);
            Assert.Equal("operaçao1", result.Name.Description); 
            Assert.Equal(2, result.RequiredStaff.RequiredNumber); // Validate required staff value
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

            // Mock the repository to return an active operation type
            var activeOperationType = new OperationType(
                new OperationName("operaçao1"),
                new Duration(30, 10, 10),
                new RequiredStaff(2),
                new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            );
            

            _operationTypeRepositoryMock
             .Setup(repo => repo.GetByIdAsync(operationTypeId))
            .ReturnsAsync(activeOperationType);

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
            var operationType = new OperationType(new OperationName("operaçao1"), 
            new Duration(30, 10, 10),
             new RequiredStaff(2), 
             new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")));


        // Mock do repositório para retornar o tipo de operação inativo baseado no ID
        _operationTypeRepositoryMock
            .Setup(repo => repo.GetByIdAsync(operationTypeId))
            .ReturnsAsync(operationType);

            _mapper.Setup(m => m.Map<OperationTypeDTO>(operationType)).Returns(new OperationTypeDTO
            {
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            });

        // Act
        var deletedOperationType = await _operationTypeService.DeleteAsync(operationType.Id);

        // Assert
        Assert.NotNull(operationType);
    }
    

        [Fact]
        public async Task UpdateAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var dto = new OperationTypeDTO
            {
                Id = Guid.NewGuid(),
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            };

            var operationType = new OperationType(new OperationName("operaçao1"), new Duration(30, 10, 10), new RequiredStaff(2), new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")));

            _operationTypeRepositoryMock
                .Setup(repo => repo.GetByIdAsync(It.IsAny<OperationTypeId>()))
                .ReturnsAsync(operationType);

                _mapper.Setup(m => m.Map<OperationTypeDTO>(operationType)).Returns(new OperationTypeDTO
            {
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            });

            // Act
            var result = await _operationTypeService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            
        }
    }
}*/
