using DDDSample1.Domain;
using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationsType;
using Backend.Domain.Shared;
using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Specialization;
using AutoMapper;
using System.Threading.Tasks.Dataflow;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

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

        public OperationTypeService(IMapper mapper,IUnitOfWork unitOfWork, IOperationTypeRepository operationTypeRepository, IConfiguration configuration, ISpecializationRepository specializationRepository)
        {
            _unitOfWork = unitOfWork;
            _operationTypeRepository = operationTypeRepository;
            _configuration = configuration;
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
                Specializations = operationType.Specializations // Adaptado para a lista
            });

            return listDto;
        }


        public async Task<List<SearchOperationTypeDTO>> GetAllOperationTypeAsync()
        {
            var list = await _operationTypeRepository.GetAllAsync();

            List<SearchOperationTypeDTO> listDto = new List<SearchOperationTypeDTO>();

            foreach (var operationType in list)
            {
                // Obtém descrições das especializações sequencialmente
                var specializations = new List<string>();
                foreach (var specializationId in operationType.Specializations)
                {
                    var specialization = await _specializationRepository.GetByIdAsync(specializationId);
                    if (specialization != null)
                    {
                        specializations.Add(specialization.Description.Value);
                    }
                }

                // Adiciona o DTO à lista
                listDto.Add(new SearchOperationTypeDTO
                {
                    Id = operationType.Id.AsGuid(),
                    Name = operationType.Name,
                    Specialization = new Description(string.Join(", ", specializations)),
                    Active = operationType.Active,
                    RequiredStaff = operationType.RequiredStaff,
                    Duration = operationType.Duration
                });
            }

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

            // Verificar se já existe uma operação com o mesmo nome
            var operation = await this._operationTypeRepository.GetByNameAsync(dto.Name);
            if (operation != null)
            {
                throw new BusinessRuleValidationException("Operation type já existe no sistema, por favor tente novamente com outro nome.");
            }

            var duration = new Duration(dto.Preparation, dto.Surgery, dto.Cleaning);
            var requiredStaff = new RequiredStaff(dto.RequiredStaff);

            // Processar especializações
            var specializations = new List<SpecializationId>();
            foreach (var specializationDescription in dto.Specialities)
            {
                var specialization = await this._specializationRepository.GetByDescriptionAsync(new Description(specializationDescription));
                if (specialization == null)
                {
                    throw new BusinessRuleValidationException($"A especialização '{specializationDescription}' não existe.");
                }
                specializations.Add(specialization.Id);
            }

            // Criar o OperationType
            var operationType = new OperationType(name, duration, requiredStaff, specializations);

            // Logar auditoria
            _auditService.LogCreateOperationType(operationType, adminEmail);

            // Persistir a nova operação
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

            var OperationTypeDTO = _mapper.Map<OperationTypeDTO>(operationType);

            return OperationTypeDTO;

        }

       /* public async Task<OperationTypeDTO> UpdateCurrentActiveType(UpdateOperationTypeDTO dto, Guid id)
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
        }*/

        public async Task<OperationTypeDTO> DeactivateAsync(string adminEmail, string? name = null, string? specialization = null, string? id = null)
        {
            OperationType operationType = null;

            if (!string.IsNullOrEmpty(name))
            {
                operationType = await _operationTypeRepository.GetByNameAsync(name);
            }
            else if (!string.IsNullOrEmpty(specialization))
            {
                var specializationEntity = await _specializationRepository.GetByDescriptionAsync(new Description(specialization));
                if (specializationEntity == null)
                    throw new BusinessRuleValidationException("A especialização não existe.");

                var operationTypes = await _operationTypeRepository.GetBySpecializationAsync(specializationEntity.Id);
                if (!operationTypes.Any())
                    throw new BusinessRuleValidationException("Nenhum tipo de operação associado a essa especialização foi encontrado.");

                // Selecionar o primeiro ativo, se houver
                operationType = operationTypes.FirstOrDefault(o => o.Active);
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

            // Registrar auditoria
            _auditService.LogDeactivateOperationType(operationType, adminEmail);

            // Remover o registro atual (com active = true)
            await _operationTypeRepository.DeleteAsync(operationType.Id);

            // Modificar o estado do registro para inativo
            operationType.Deactivate();

            // Adicionar o registro modificado de volta ao banco de dados
            await _operationTypeRepository.AddAsync(operationType);
            await _unitOfWork.CommitAsync();

            return _mapper.Map<OperationTypeDTO>(operationType);
        }


/*
        public async Task<List<SearchOperationTypeDTO>> SearchOperationTypeAsync(string? name = null, string? specializationDesc = null, string? active = null)
        {
            var query = from operationType in _operationTypeRepository.GetQueryable()
                        join specialization in _specializationRepository.GetQueryable() on operationType.SpecializationId equals specialization.Id
                        select new { operationType, specialization };

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(op => op.operationType.Name.Description.Contains(name));
            }

            var results = await query.ToListAsync();

            if (!string.IsNullOrEmpty(specializationDesc))
            {
                results = results.Where(op => op.specialization.Description.Value.Contains(specializationDesc)).ToList();
            }

            if (!string.IsNullOrEmpty(active))
            {
                if (active.Equals("yes", StringComparison.OrdinalIgnoreCase))
                {
                    results = results.Where(op => op.operationType.Active == true).ToList();
                }
                else if (active.Equals("no", StringComparison.OrdinalIgnoreCase))
                {
                    results = results.Where(op => op.operationType.Active == false).ToList();
                }
                else
                {
                    Console.WriteLine("Invalid value for 'active'. No filtering applied.");
                    results.Clear();
                }
            }

            return results.Select(op => new SearchOperationTypeDTO
            {
                Id = op.operationType.Id.AsGuid(),
                Name = op.operationType.Name,
                Specialization = op.specialization.Description,
                Active = op.operationType.Active,
                RequiredStaff = op.operationType.RequiredStaff,
                Duration = op.operationType.Duration
            }).ToList();
        }*/

        public async Task<List<SearchOperationTypeDTO>> GetAllActiveOperationTypeAsync()
        {
            var list = await this._operationTypeRepository.GetAllActiveAsync();

            List<SearchOperationTypeDTO> listDto = new List<SearchOperationTypeDTO>();

            foreach (var operationType in list)
            {
                // Recupera as especializações associadas a este OperationType
                var specializations = new List<string>();
                foreach (var specializationId in operationType.Specializations)
                {
                    var specialization = await _specializationRepository.GetByIdAsync(specializationId);
                    if (specialization != null)
                    {
                        specializations.Add(specialization.Description.ToString());
                    }
                }

                // Adiciona o DTO com as informações da operação
                listDto.Add(new SearchOperationTypeDTO
                {
                    Id = operationType.Id.AsGuid(),
                    Name = operationType.Name,
                    Specialization = new Description(string.Join(", ", specializations)),  // Junta as especializações em uma string
                    Active = operationType.Active,
                    RequiredStaff = operationType.RequiredStaff,
                    Duration = operationType.Duration
                });
            }

            return listDto;
        }

    }

}

