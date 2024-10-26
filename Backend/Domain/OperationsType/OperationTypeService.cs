using DDDSample1.Domain;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Backend.Domain.Shared;
using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Specialization;
using AutoMapper;
using System.Threading.Tasks.Dataflow;

namespace DDDSample1.OperationsType
{

    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _operationTypeRepository;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IConfiguration _configuration;
       private readonly AuditService _auditService;
       private readonly IMapper _mapper;
        public OperationTypeService(IMapper mapper,IUnitOfWork unitOfWork, IOperationTypeRepository operationTypeRepository, IConfiguration configuration, AuditService auditService, ISpecializationRepository specializationRepository)
        {
            _unitOfWork = unitOfWork;
            _operationTypeRepository = operationTypeRepository;
            _configuration = configuration;
            _auditService = auditService;
            _specializationRepository = specializationRepository;
            _mapper = mapper;
        }

         // Obtém todos os tipos de operações
        public async Task<List<OperationTypeDTO>> GetAllAsync()
        {
            var list = await this._operationTypeRepository.GetAllAsync();
            List<OperationTypeDTO> listDto = list.ConvertAll(operationType => new OperationTypeDTO
            {
                Id = operationType.Id.AsGuid(),
                Name = operationType.Name,
                Duration = operationType.Duration,
                RequiredStaff = operationType.RequiredStaff,
                SpecializationId = operationType.SpecializationId
            });
            return listDto;
        }

        // Obtém uma operation pelo ID

        public async Task<OperationTypeDTO> GetByIdAsync(OperationTypeId id)
        {
            try {
                var operationType = await this._operationTypeRepository.GetByIdAsync(id);
                if (operationType == null) return null;

                return _mapper.Map<OperationTypeDTO>(operationType);
        } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        

        public async Task<OperationTypeDTO> AddAsync(CreatingOperationTypeDTO dto, string adminEmail)
        {

            var name = new OperationName(dto.Name);

            var operation =  await this._operationTypeRepository.GetByNameAsync(dto.Name);

            if (operation != null)
            {
                throw new BusinessRuleValidationException("Operation type já existe no sistema, por favor tente novamente com outro nome.");
            }

            var duration = new Duration(dto.Preparation, dto.Surgery, dto.Cleaning);

            var requiredStaff = new RequiredStaff(dto.RequiredStaff);

            var specialization = await this._specializationRepository.GetByDescriptionAsync(new Description(dto.speciality));

            if (specialization == null) throw new BusinessRuleValidationException("A especialização não existe.");

            var operationType = new OperationType(name, duration, requiredStaff, specialization.Id);

            _auditService.LogCreateOperationType(operationType, adminEmail);
            await this._operationTypeRepository.AddAsync(operationType);
            await _unitOfWork.CommitAsync();

            return _mapper.Map<OperationTypeDTO>(operationType);
        }

        public async Task <OperationTypeDTO> DeleteAsync(OperationTypeId id) {
            var operationType = await this._operationTypeRepository.GetByIdAsync(id);
            if (operationType == null) return null;
            
            if (operationType.Active) throw new BusinessRuleValidationException("Não é possível excluir um tipo de operação ativo.");

            this._operationTypeRepository.Remove(operationType);
            await this._unitOfWork.CommitAsync();

            return _mapper.Map<OperationTypeDTO>(operationType);
        }

        public async Task<OperationTypeDTO> UpdateAsync(OperationTypeDTO dto)
        {
            var operationType = await this._operationTypeRepository.GetByIdAsync(new OperationTypeId(dto.Id));
            if (operationType == null) return null;

            operationType.ChangeName(dto.Name);
            operationType.ChangeDuration(dto.Duration);
            operationType.ChangeRequiredStaff(dto.RequiredStaff);

            await this._unitOfWork.CommitAsync();

            return _mapper.Map<OperationTypeDTO>(operationType);

        }

        public async Task<OperationTypeDTO> UpdateCurrentActiveType(UpdateOperationTypeDTO dto, Guid id)
{
    var currentActiveOperationType = await this._operationTypeRepository.GetActiveOperationTypeByIdAsync(new OperationTypeId(id));

    if (currentActiveOperationType == null)
    {
        return null;
    }

    try
    {
        await this._operationTypeRepository.DeleteAsync(currentActiveOperationType.Id);
        await _unitOfWork.CommitAsync();

        currentActiveOperationType.Deactivate();
        await _operationTypeRepository.AddAsync(currentActiveOperationType);
        await _unitOfWork.CommitAsync();

        var newOperationType = new OperationType(
            id: currentActiveOperationType.Id,
            name: !string.IsNullOrWhiteSpace(dto.Name) ? new OperationName(dto.Name) : currentActiveOperationType.Name,
            duration: new Duration(
                dto.Preparation.HasValue ? dto.Preparation.Value : currentActiveOperationType.Duration.PreparationPhase,
                dto.Surgery.HasValue ? dto.Surgery.Value : currentActiveOperationType.Duration.SurgeryPhase,
                dto.Cleaning.HasValue ? dto.Cleaning.Value : currentActiveOperationType.Duration.CleaningPhase
            ),
            requiredStaff: new RequiredStaff
            (
                dto.RequiredStaff.HasValue ? dto.RequiredStaff.Value : currentActiveOperationType.RequiredStaff.RequiredNumber
            ),
            specializationId: currentActiveOperationType.SpecializationId
        );

        await this._operationTypeRepository.AddAsync(newOperationType);
        await this._unitOfWork.CommitAsync();

        return _mapper.Map<OperationTypeDTO>(newOperationType);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred: {ex.Message}");
        await this._operationTypeRepository.DeleteAsync(currentActiveOperationType.Id);
        await _unitOfWork.CommitAsync();

        currentActiveOperationType.Activate();
        await _operationTypeRepository.AddAsync(currentActiveOperationType);
        await _unitOfWork.CommitAsync();
        throw;
    }
}

        public async Task<String> DeactivateAsync(string adminEmail, string? name = null, string? specialization = null, string? id = null)
        {
            OperationType operationType = new OperationType();

            if (!string.IsNullOrEmpty(name))
            {
                operationType = await _operationTypeRepository.GetByNameAsync(name);
            }
            else if (!string.IsNullOrEmpty(specialization))
            {
                var specializationVAR = await _specializationRepository.GetByDescriptionAsync(new Description(specialization));
                if (specializationVAR == null) 
                    throw new BusinessRuleValidationException("A especialização não existe.");

                operationType = await _operationTypeRepository.GetBySpecializationAsync(specializationVAR.Id);
            }
            else if (!string.IsNullOrEmpty(id))
            {
                operationType = await _operationTypeRepository.GetByIdAsync(new OperationTypeId(id));
            }
            else
            {
                throw new BusinessRuleValidationException("Por favor, insira um nome, uma especialização ou um id válidos.");
            }

            if (operationType == null)
                throw new BusinessRuleValidationException("Tipo de operação não encontrado.");

            if (!operationType.Active)
                throw new BusinessRuleValidationException("O tipo de operação já se encontra inativo.");

            _auditService.LogDeactivateOperationType(operationType, adminEmail);

            operationType.Deactivate();

            await _unitOfWork.CommitAsync();

            return "Tipo de operação desativado com sucesso!!";
        }

    }

}

