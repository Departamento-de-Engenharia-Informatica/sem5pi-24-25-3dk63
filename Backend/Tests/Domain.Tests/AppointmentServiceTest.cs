using Xunit;
using Moq;
using DDDSample1.Domain.Shared;
using DDDSample1.Appointments;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain;

namespace Backend.Tests.Services
{
    public class AppointmentServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IAppointmentRepository> _appointmentRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly AppointmentService _appointmentService;

        public AppointmentServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _appointmentRepositoryMock = new Mock<IAppointmentRepository>();
            _configurationMock = new Mock<IConfiguration>();

            _appointmentService = new AppointmentService(
                _unitOfWorkMock.Object,
                _appointmentRepositoryMock.Object,
                _configurationMock.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAppointmentDTOList()
        {
            // Arrange
            var appointments = new List<Appointment>
            {
                new Appointment(
                    new OperationRequestId(Guid.NewGuid()),
                    new Date(DateTime.Now.AddDays(1)),
                    new Time(TimeSpan.FromHours(9)),
                    101
                )
            };

            _appointmentRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(appointments);

            // Act
            var result = await _appointmentService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(appointments.Count, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnAppointmentDTO()
        {
            // Arrange
            var appointment = new Appointment(
                new OperationRequestId(Guid.NewGuid()),
                new Date(DateTime.Now.AddDays(1)),
                new Time(TimeSpan.FromHours(9)),
                101
            );
            var appointmentId = appointment.Id;

            _appointmentRepositoryMock.Setup(repo => repo.GetByIdAsync(appointmentId)).ReturnsAsync(appointment);

            // Act
            var result = await _appointmentService.GetByIdAsync(appointmentId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(appointmentId.AsGuid(), result.Id);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnAppointmentDTO()
        {
            // Arrange
            var dto = new CreatingAppointmentDTO(
                new Date(DateTime.Now.AddDays(1)),
                new Time(TimeSpan.FromHours(9)),
                new OperationRequestId(Guid.NewGuid()),
                101
            );

            _configurationMock.Setup(c => c["DNS_DOMAIN"]).Returns("https://localhost:5001");
            _appointmentRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(1);

            var appointment = new Appointment(
                new OperationRequestId(dto.operationRequestId.Value),
                new Date(dto.date.Value),
                new Time(dto.time.Value),
                dto.roomNumber
            );

            _appointmentRepositoryMock.Setup(repo => repo.AddAsync(appointment)).Returns(Task.FromResult(appointment));

            // Act
            var result = await _appointmentService.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.roomNumber, result.roomNumber);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowException_WhenDnsDomainNotConfigured()
        {
            // Arrange
            var dto = new CreatingAppointmentDTO(new Date(DateTime.Now.AddDays(1)), new Time(TimeSpan.FromHours(9)),new OperationRequestId(Guid.NewGuid()),101);

            _configurationMock.Setup(c => c["DNS_DOMAIN"]).Returns((string)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _appointmentService.AddAsync(dto));
            Assert.Equal("DNS_DOMAIN is not defined in the configuration file", exception.Message);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnUpdatedAppointmentDTO()
        {
            // Arrange
            var dto = new AppointmentDTO
            {
                date = new Date(DateTime.Now.AddDays(1)),
                time = new Time(TimeSpan.FromHours(10)),
                roomNumber = 101,
                operationRequestId = new OperationRequestId(Guid.NewGuid())
            };

            var appointment = new Appointment(
                new OperationRequestId(dto.operationRequestId.Value),
                new Date(DateTime.Now.AddDays(1)),
                new Time(TimeSpan.FromHours(9)),
                101
            );

            var appointmentId = appointment.Id;
            dto.Id = appointmentId.AsGuid();

            _appointmentRepositoryMock.Setup(repo => repo.GetByIdAsync(appointmentId)).ReturnsAsync(appointment);

            // Act
            var result = await _appointmentService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Id, result.Id);
            Assert.Equal(dto.date, result.date);
            Assert.Equal(dto.time, result.time);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedAppointmentDTO()
        {
            // Arrange
            var appointment = new Appointment(
                new OperationRequestId(Guid.NewGuid()),
                new Date(DateTime.Now.AddDays(1)),
                new Time(TimeSpan.FromHours(9)),
                101
            );

            var appointmentId = appointment.Id;
            appointment.ChangeActiveFalse();

            _appointmentRepositoryMock.Setup(repo => repo.GetByIdAsync(appointmentId)).ReturnsAsync(appointment);
            _appointmentRepositoryMock.Setup(repo => repo.Remove(appointment));

            // Act
            var result = await _appointmentService.DeleteAsync(appointmentId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(appointmentId.AsGuid(), result.Id);
        }

        [Fact]
        public async Task GetByDateAsync_ShouldReturnAppointmentDTOList()
        {
            // Arrange
            var date = new Date(DateTime.Now.AddDays(1));
            var appointments = new List<Appointment>
            {
                new Appointment(
                    new OperationRequestId(Guid.NewGuid()),
                    date,
                    new Time(TimeSpan.FromHours(9)),
                    101
                )
            };

            _appointmentRepositoryMock.Setup(repo => repo.GetByDateAsync(date)).ReturnsAsync(appointments);

            // Act
            var result = await _appointmentService.GetByDateAsync(date);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(appointments.Count, result.Count);
        }
    }
}
