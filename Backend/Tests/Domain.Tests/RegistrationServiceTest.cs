using Xunit;
using Moq;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using Backend.Domain.Users.ValueObjects;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Patients;

namespace Backend.Tests.Services
{
    public class RegistrationServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<EmailService> _emailServiceMock;
        private readonly RegistrationService _registrationService;

        public RegistrationServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _emailServiceMock = new Mock<EmailService>();

            _registrationService = new RegistrationService(
                _unitOfWorkMock.Object,
                _userRepositoryMock.Object,
                _patientRepositoryMock.Object,
                _configurationMock.Object,
                _emailServiceMock.Object
            );
        }

        [Fact]
        public async Task SelfRegisterPatientAsync_ShouldThrowException_WhenPatientNotFound()
        {
            // Arrange
            var dto = new SelfRegisterPatientDTO
            {
                PersonalEmail = "john.doe@example.com"
            };

            _patientRepositoryMock.Setup(repo => repo.GetPatientByPersonalEmailAsync(new Email(dto.PersonalEmail)))
                .ReturnsAsync((Patient)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _registrationService.SelfRegisterPatientAsync(dto, "admin@example.com"));
            Assert.Equal("Patient not found. Please contact the admin.", exception.Message);
        }

        [Fact]
        public async Task SelfRegisterPatientAsync_ShouldThrowException_WhenUserAlreadyExists()
        {
            // Arrange
            var dto = new SelfRegisterPatientDTO
            {
                PersonalEmail = "john.doe@example.com"
            };
            var iamEmail = "johndoe@example.com";

            var existingPatient = new Patient(new UserId(Guid.NewGuid()), new DateOfBirth(DateTime.Now), new Gender("Male"), new EmergencyContact("Jane Doe, +351123456789"), 1);
            var existingUser = new User(new Role(RoleType.Patient), new Email("john.doe@example.com"), new Name("John", "Doe"), DateTime.Now.Year, "MyHospital.com", 1, new PhoneNumber("+351123456789"));
            existingUser.ChangeUsername(new Username(iamEmail));

            _patientRepositoryMock.Setup(repo => repo.GetPatientByPersonalEmailAsync(new Email(dto.PersonalEmail)))
                .ReturnsAsync(existingPatient);
            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(new Email(dto.PersonalEmail)))
                .ReturnsAsync(existingUser);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _registrationService.SelfRegisterPatientAsync(dto, "johndoe@example.com"));
            Assert.Equal("User already exists.", exception.Message);
        }

        [Fact]
        public async Task ConfirmEmailAsync_ShouldThrowException_WhenTokenIsInvalid()
        {
            // Arrange
            var invalidToken = "invalid-token";

            // Setup the user repository to return null for the invalid token
            _userRepositoryMock.Setup(repo => repo.GetUserByConfirmationTokenAsync(invalidToken))
                .ReturnsAsync((User)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _registrationService.ConfirmEmailAsync(invalidToken));
            Assert.Equal("Invalid token or email.", exception.Message);
        }


        [Fact]
        public async Task ConfirmEmailAsync_ShouldActivateUser_WhenTokenIsValid()
        {
            // Arrange
            var validToken = "valid-token";
            var user = new User(new Role(RoleType.Patient), new Email("john.doe@example.com"), new Name("John", "Doe"), DateTime.Now.Year, "MyHospital.com", 1, new PhoneNumber("+351123456789"))
            {
                ConfirmationToken = validToken
            };

            var patient = new Patient(user.Id, new DateOfBirth(DateTime.Now), new Gender("Female"), new EmergencyContact("Jane Doe, +351123456789"), 1);

            _userRepositoryMock.Setup(repo => repo.GetUserByConfirmationTokenAsync(validToken))
                .ReturnsAsync(user);
            _patientRepositoryMock.Setup(repo => repo.FindByUserIdAsync(user.Id))
                .ReturnsAsync(patient);
            _userRepositoryMock.Setup(repo => repo.UpdateUserAsync(user)).Returns(Task.CompletedTask);

            // Act
            await _registrationService.ConfirmEmailAsync(validToken);

            // Assert
            Assert.True(user.Active);
            Assert.Null(user.ConfirmationToken);
            _userRepositoryMock.Verify(repo => repo.UpdateUserAsync(user), Times.Once);
        }

        [Fact]
        public async Task FindByEmailAsync_ShouldReturnUser_WhenEmailExists()
        {
            // Arrange
            var email = new Email("john.doe@example.com");
            var user = new User(new Role(RoleType.Patient), email, new Name("John", "Doe"), DateTime.Now.Year, "MyHospital.com", 1, new PhoneNumber("+351123456789"));

            _userRepositoryMock.Setup(repo => repo.FindByEmailAsync(email)).ReturnsAsync(user);

            // Act
            var result = await _registrationService.FindByEmailAsync(email);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("john.doe@example.com", result.Email.ToString());
        }
    }
}
