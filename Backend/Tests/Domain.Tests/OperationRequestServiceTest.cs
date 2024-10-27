using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Xunit;
using DDDSample1.Domain;
using DDDSample1.Domain.Specialization;
using Moq;
using DDDSample1.OperationsType;
using Backend.Domain.Shared;
using AutoMapper;
using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Staff;
using DDDSample1.OperationRequests;
using DDDSample1.Domain.OperationRequests;



namespace Backend.Tests.Services
{
    public class OperationRequestServiceTest
    {

        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationTypeRepository> _operationTypeRepositoryMock;
        private readonly Mock<IAppointmentRepository> _appointmentRepositoryMock;
         private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IOperationRequestRepository> _operationRequestRepositoryMock;
        private readonly OperationRequestService _operationRequestService;

        public OperationRequestServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();
            _appointmentRepositoryMock = new Mock<IAppointmentRepository>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _mapperMock = new Mock<IMapper>();
            _operationRequestRepositoryMock = new Mock<IOperationRequestRepository>();

            _operationRequestService = new OperationRequestService(_unitOfWorkMock.Object, 
            _operationRequestRepositoryMock.Object, 
            _appointmentRepositoryMock.Object, 
            _operationTypeRepositoryMock.Object, 
            _patientRepositoryMock.Object, 
            _userRepositoryMock.Object,
             _staffRepositoryMock.Object, 
             _configurationMock.Object,
              _mapperMock.Object);
        }

        /*
        GetAllAsync                 Check
        GetByIdAsync                Check 
        AddAsync                    Check
        DeleteAsync                 Check
        UpdateAsync                 Check
        */

       [Fact]
        public async Task GetAllAsync_ShouldReturRequestDTOList()
        {
            // Arrange
            var operationRequests = new List<OperationRequest>
            {
                new OperationRequest(new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")),
                new Deadline(DateTime.Now.AddDays(1)),
                new Priority(PriorityType.Elective),
                new LicenseNumber("123456"),
                new MedicalRecordNumber("271024123456"))
            };

            _operationRequestRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationRequests);
            _mapperMock.Setup(m => m.Map<List<OperationTypeDTO>>(operationRequests)).Returns(new List<OperationTypeDTO>
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
            var result = await _operationRequestService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequests.Count, result.Count);
        }

                [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationTypeDTO()
        {
            // Arrange
            var operationRequestid = new OperationRequestId(Guid.NewGuid());
            var operationRequest = 
                new OperationRequest(new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")),
                new Deadline(DateTime.Now.AddDays(1)),
                new Priority(PriorityType.Elective),
                new LicenseNumber("123456"),
                new MedicalRecordNumber("271024123456"))
            ;
            _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestid)).ReturnsAsync(operationRequest);
            _mapperMock.Setup(m => m.Map<OperationTypeDTO>(operationRequest)).Returns(new OperationTypeDTO
            {
                Name = new OperationName("operaçao1"),
                Duration = new Duration(30, 10, 10),
                RequiredStaff = new RequiredStaff(2),
                SpecializationId = new SpecializationId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            });

            // Act
            var result = await _operationRequestService.GetByIdAsync(operationRequestid);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenNameExistes()
        {
            // Arrange
            var operationRequest = 
                new CreatingOperationRequestDTO(
                new Deadline(DateTime.Now.AddDays(1)),
                new Priority(PriorityType.Elective),
                new LicenseNumber("123456"),
                new MedicalRecordNumber("271024123456"),
                new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")))
            ;          

            
           _operationRequestRepositoryMock.Setup(repo => repo.IsDuplicateRequestAsync(operationRequest.OperationTypeId,operationRequest.MedicalRecordNumber)).ReturnsAsync(true);
            
            // Act
            // Assert
            var exception=await Assert.ThrowsAsync<InvalidOperationException>(() => _operationRequestService.AddAsync(operationRequest));
            Assert.Equal("There is already an open operation request for this type and patient.", exception.Message);
    }

        [Fact]
        public async Task AddAsync_ShouldReturnOperationRequestDTO_WhenDataIsValid()
        {
            // Arrange
            var operationRequestDto = new CreatingOperationRequestDTO(
                new Deadline(DateTime.Now.AddDays(1)),
                new Priority(PriorityType.Elective),
                new LicenseNumber("123456"),
                new MedicalRecordNumber("271024123456"),
                new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            );

            var expectedOperationRequest = new OperationRequestDTO
            {
                Id = Guid.NewGuid(), 
                Deadline = operationRequestDto.Deadline,
                Priority = operationRequestDto.Priority,
                LicenseNumber = operationRequestDto.LicenseNumber,
                MedicalRecordNumber = operationRequestDto.MedicalRecordNumber,
                OperationTypeId = operationRequestDto.OperationTypeId
            };

            // Configurar o mock do repositório para não encontrar duplicados
            _operationRequestRepositoryMock
                .Setup(repo => repo.IsDuplicateRequestAsync(
                    operationRequestDto.OperationTypeId,
                    operationRequestDto.MedicalRecordNumber))
                .ReturnsAsync(false);

            // Configurar o mock do repositório para adicionar a solicitação
            _operationRequestRepositoryMock
                .Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>()));
            // Act
            var result = await _operationRequestService.AddAsync(operationRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedOperationRequest.Deadline, result.Deadline);
            Assert.Equal(expectedOperationRequest.Priority, result.Priority);
            Assert.Equal(expectedOperationRequest.LicenseNumber, result.LicenseNumber);
            Assert.Equal(expectedOperationRequest.MedicalRecordNumber, result.MedicalRecordNumber);
            Assert.Equal(expectedOperationRequest.OperationTypeId, result.OperationTypeId);
                }

        [Fact]
        public async Task DeleteAsync_ShouldThrowException_WhenOperationRequestNotFound()
        {
            // Arrange
            var operationRequestId = new OperationRequestId(Guid.NewGuid());

            
            _operationRequestRepositoryMock
                .Setup(repo => repo.GetByIdAsync(operationRequestId))
                .ReturnsAsync((OperationRequest)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(
                () => _operationRequestService.DeleteAsync(operationRequestId)
            );
            Assert.Equal("Operation Request not found.", exception.Message);
        }

        [Fact]
public async Task DeleteAsync_ShouldThrowException_WhenOperationRequestHasAssociatedAppointment()
{
    // Arrange
    var operationRequestId = new OperationRequestId(Guid.NewGuid());
    var operationRequest = new OperationRequest(new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a")),
                new Deadline(DateTime.Now.AddDays(1)),
                new Priority(PriorityType.Elective),
                new LicenseNumber("123456"),
                new MedicalRecordNumber("271024123456"))
            ;

    _operationRequestRepositoryMock
        .Setup(repo => repo.GetByIdAsync(operationRequestId))
        .ReturnsAsync(operationRequest);

    _appointmentRepositoryMock
        .Setup(repo => repo.GetByOperationRequestIdAsync(operationRequestId))
        .ReturnsAsync(new Appointment()); 

    // Act & Assert
    var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(
        () => _operationRequestService.DeleteAsync(operationRequestId)
    );
    Assert.Equal("Não é possível excluir um pedido operação associado a uma consulta.", exception.Message);
}

        [Fact]
        public async Task UpdateAsync_ShouldReturnOperationRequestDTO()
        {
            // Arrange
            var dto = new OperationRequestDTO
            {
                Id = Guid.NewGuid(),
                Deadline = new Deadline(DateTime.Now.AddDays(1)),
                Priority = new Priority(PriorityType.Elective),
                LicenseNumber = new LicenseNumber("123456"),
                MedicalRecordNumber = new MedicalRecordNumber("271024123456"),
                OperationTypeId = new OperationTypeId(Guid.Parse("d2718f59-24e8-4d4d-9d53-4b6a3f1c5c6a"))
            };

            // Criação do OperationRequest para simular o objeto existente no repositório
            var operationRequest = new OperationRequest(
                new OperationTypeId(dto.OperationTypeId.Value), 
                dto.Deadline, 
                dto.Priority, 
                dto.LicenseNumber, 
                dto.MedicalRecordNumber
            );

            _operationRequestRepositoryMock
                .Setup(repo => repo.GetByIdAsync(new OperationRequestId(dto.Id)))
                .ReturnsAsync(operationRequest);

            _unitOfWorkMock
                .Setup(uow => uow.CommitAsync())
                .Returns(Task.FromResult(0));

            // Act
            var result = await _operationRequestService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Deadline, result.Deadline);
            Assert.Equal(dto.Priority, result.Priority);
            Assert.Equal(dto.LicenseNumber, result.LicenseNumber);
            Assert.Equal(dto.MedicalRecordNumber, result.MedicalRecordNumber);
            Assert.Equal(dto.OperationTypeId, result.OperationTypeId);

            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

    }
}