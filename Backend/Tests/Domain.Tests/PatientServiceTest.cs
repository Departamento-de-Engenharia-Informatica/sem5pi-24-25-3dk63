using Xunit;
using Moq;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using AutoMapper;
using DDDSample1.Patients;
using Backend.Domain.Users.ValueObjects;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain;
using Backend.Domain.Shared;
using DDDSample1.Domain.PendingChange;

namespace Backend.Tests.Services
{
    public class PatientServiceTest
    {
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IPendingChangesRepository> _pendingChangesRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<EmailService> _emailServiceMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<ILogger<PatientService>> _loggerMock;
        private readonly Mock<Serilog.ILogger> _logger; // Mocked ILogger
        private readonly Mock<AuditService> _auditServiceMock; // Use a real instance of AuditService
        private readonly PatientService _patientService;

        public PatientServiceTest()
        {
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _pendingChangesRepositoryMock = new Mock<IPendingChangesRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _mapperMock = new Mock<IMapper>();
            _emailServiceMock = new Mock<EmailService>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<PatientService>>();
            _logger = new Mock<Serilog.ILogger>(); // Initialize the logger mock

            _auditServiceMock = new Mock<AuditService>(_logger.Object);

            _patientService = new PatientService(
                _patientRepositoryMock.Object,
                _userRepositoryMock.Object,
                _pendingChangesRepositoryMock.Object,
                _emailServiceMock.Object,
                _httpContextAccessorMock.Object,
                _configurationMock.Object,
                _loggerMock.Object,
                _unitOfWorkMock.Object,
                _mapperMock.Object,
                _auditServiceMock.Object
            );
        }

        [Fact]
        public async Task RegisterPatientAsync_ShouldThrowException_WhenPatientAlreadyExists()
        {
            // Arrange
            var registerDto = new RegisterPatientDTO
            {
                personalEmail = new Email("john.doe@example.com")
            };

            var existingUser = new User(new Role(RoleType.Patient), registerDto.personalEmail, new Name("John", "Doe"), DateTime.Now.Year, "MyHospital.com", 1, new PhoneNumber("+351123456789"));

            _patientRepositoryMock.Setup(repo => repo.FindByEmailAsync(registerDto.personalEmail)).ReturnsAsync(existingUser);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _patientService.RegisterPatientAsync(registerDto));
            Assert.Equal("Patient already exists.", exception.Message);
        }

        [Fact]
        public async Task UpdatePatientProfileAsync_ShouldReturnTrue_WhenPatientProfileIsUpdated()
        {
            // Arrange
            var updateDto = new PatientUpdateDTO
            {
                Id = new MedicalRecordNumber("200103000001"),
                personalEmail = new Email("john.doe@example.com")
            };

            var user = new User(new Role(RoleType.Patient), new Email("john.doe@example.com"), new Name("John", "Doe"), DateTime.Now.Year, "MyHospital.com", 1, new PhoneNumber("+351123456789"));
            var patient = new Patient(user.Id, new DateOfBirth(new DateTime(1990, 1, 1)), new Gender("Male"), new EmergencyContact("Jane Doe, +351123456789"), 1);

            _patientRepositoryMock.Setup(repo => repo.FindByMedicalRecordNumberAsync(updateDto.Id)).ReturnsAsync(patient);
            _patientRepositoryMock.Setup(repo => repo.FindByEmailAsync(updateDto.personalEmail)).ReturnsAsync(user);
            _mapperMock.Setup(m => m.Map<Patient>(updateDto)).Returns(patient);

            // Act
            var result = await _patientService.UpdatePatientProfileAsync(updateDto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UpdatePatientProfileAsync_ShouldReturnFalse_WhenPatientNotFound()
        {
            // Arrange
            var updateDto = new PatientUpdateDTO
            {
                Id = new MedicalRecordNumber("200103000001"),
                personalEmail = new Email("john.doe@example.com")
            };

            _patientRepositoryMock.Setup(repo => repo.FindByMedicalRecordNumberAsync(updateDto.Id)).ReturnsAsync((Patient)null);

            // Act
            var result = await _patientService.UpdatePatientProfileAsync(updateDto);

            // Assert
            Assert.False(result);
        }
    }
}
