using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Moq;
using AutoMapper;
using Backend.Domain.Specialization;
using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specialization;

namespace DDDSample1.Tests.Domain.Specializations
{
    public class SpecializationServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ISpecializationRepository> _specializationRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly SpecializationService _service;

        public SpecializationServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();
            _mapperMock = new Mock<IMapper>();

            _service = new SpecializationService(
                _unitOfWorkMock.Object, 
                _specializationRepositoryMock.Object, 
                _mapperMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnMappedSpecializations()
        {
            var specializations = new List<Specialization>
            {
                new Specialization(new SpecializationId(Guid.NewGuid()), new Description("Cardiology"), 1),
                new Specialization(new SpecializationId(Guid.NewGuid()), new Description("Neurology"), 2)
            };
            var specializationDTOs = new List<SpecializationDTO>
            {
                new SpecializationDTO { Id = specializations[0].Id, Description = specializations[0].Description.Value, SequentialNumber = 1},
                new SpecializationDTO { Id = specializations[1].Id, Description = specializations[1].Description.Value, SequentialNumber = 2}
            };

            _specializationRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(specializations);
            _mapperMock.Setup(mapper => mapper.Map<List<SpecializationDTO>>(specializations)).Returns(specializationDTOs);

            var result = await _service.GetAllAsync();

            Assert.Equal(specializationDTOs, result);
        }

        [Fact]
        public async Task GetBySpecializationIdAsync_ShouldReturnMappedSpecialization_WhenSpecializationExists()
        {
            var specialization = new Specialization(new SpecializationId(Guid.NewGuid()), new Description("Cardiology"), 1);
            var specializationDTO = new SpecializationDTO { Id = specialization.Id, Description = specialization.Description.Value, SequentialNumber = 1};

            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(specialization.Id)).ReturnsAsync(specialization);
            _mapperMock.Setup(mapper => mapper.Map<SpecializationDTO>(specialization)).Returns(specializationDTO);

            var result = await _service.GetBySpecializationIdAsync(specialization.Id);

            Assert.Equal(specializationDTO, result);
        }

        [Fact]
        public async Task GetBySpecializationIdAsync_ShouldReturnNull_WhenSpecializationDoesNotExist()
        {
            var nonExistentId = new SpecializationId(Guid.NewGuid());
            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(nonExistentId)).ReturnsAsync((Specialization)null);

            var result = await _service.GetBySpecializationIdAsync(nonExistentId);

            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldAddSpecializationAndReturnMappedDTO()
        {
            var dto = new CreatingSpecializationDTO("Cardiology")
            {
                Description = "Cardiology"
            };
            var specializationId = new SpecializationId(Guid.NewGuid());
            var sequentialNumber = 1; 
            var newSpecialization = new Specialization(specializationId, new Description(dto.Description), sequentialNumber);
            var specializationDTO = new SpecializationDTO 
            { 
                Id = specializationId, 
                Description = dto.Description, 
                SequentialNumber = sequentialNumber 
            };

            _specializationRepositoryMock.Setup(repo => repo.GetNextSequentialNumberAsync()).ReturnsAsync(sequentialNumber);
            _specializationRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Specialization>())).ReturnsAsync((Specialization specialization) => specialization);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));
            _mapperMock.Setup(mapper => mapper.Map<SpecializationDTO>(newSpecialization)).Returns(specializationDTO);

            var result = await _service.AddAsync(dto);

            _specializationRepositoryMock.Verify(repo => repo.AddAsync(It.Is<Specialization>(s => s.Description.Value == dto.Description)), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
            Assert.Equal(specializationDTO, result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateDescriptionAndReturnMappedDTO_WhenSpecializationExists()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var existingSpecialization = new Specialization(specializationId, new Description("Old Description"), 1);
            var updatedDTO = new SpecializationDTO { Id = specializationId, Description = "New Description", SequentialNumber = 1 };

            _specializationRepositoryMock
                .Setup(repo => repo.FindByIdAsync(It.IsAny<SpecializationId>()))
                .ReturnsAsync(existingSpecialization);

            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            _mapperMock.Setup(mapper => mapper.Map<SpecializationDTO>(existingSpecialization)).Returns(updatedDTO);

            var result = await _service.UpdateAsync(updatedDTO);

            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
            Assert.Equal("New Description", existingSpecialization.Description.Value);
            Assert.Equal(updatedDTO, result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenSpecializationDoesNotExist()
        {
            var nonExistentDTO = new SpecializationDTO { Id = new SpecializationId(Guid.NewGuid()), Description = "Description", SequentialNumber = 1 };
            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(It.IsAny<SpecializationId>())).ReturnsAsync((Specialization)null);

            var result = await _service.UpdateAsync(nonExistentDTO);

            Assert.Null(result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveSpecializationAndReturnMappedDTO_WhenSpecializationExists()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            var existingSpecialization = new Specialization(specializationId, new Description("Cardiology"), 1);
            var specializationDTO = new SpecializationDTO { Id = specializationId, Description = "Cardiology", SequentialNumber = 1 };

            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(specializationId)).ReturnsAsync(existingSpecialization);
            _specializationRepositoryMock.Setup(repo => repo.Remove(existingSpecialization)).Verifiable();
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));
            _mapperMock.Setup(mapper => mapper.Map<SpecializationDTO>(existingSpecialization)).Returns(specializationDTO);

            var result = await _service.DeleteAsync(specializationId);

            _specializationRepositoryMock.Verify(repo => repo.Remove(existingSpecialization), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
            Assert.Equal(specializationDTO, result);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnNull_WhenSpecializationDoesNotExist()
        {
            var nonExistentId = new SpecializationId(Guid.NewGuid());
            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(nonExistentId)).ReturnsAsync((Specialization)null);

            var result = await _service.DeleteAsync(nonExistentId);

            Assert.Null(result);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowArgumentException_WhenDescriptionIsNull()
        {
            var dto = new CreatingSpecializationDTO(null){
                Description = null
            };

            await Assert.ThrowsAsync<ArgumentException>(() => _service.AddAsync(dto));
        }

        [Fact]
        public async Task GetBySpecializationIdAsync_ShouldThrowException_WhenRepositoryFails()
        {
            var specializationId = new SpecializationId(Guid.NewGuid());
            _specializationRepositoryMock.Setup(repo => repo.FindByIdAsync(specializationId)).ThrowsAsync(new Exception("Database error"));

            await Assert.ThrowsAsync<Exception>(() => _service.GetBySpecializationIdAsync(specializationId));
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowArgumentNullException_WhenDtoIsNull()
        {
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.UpdateAsync(null));
        }

    }
}
