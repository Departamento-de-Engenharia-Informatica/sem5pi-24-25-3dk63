using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationsType;
using Backend.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Appointments;
using AutoMapper;
using Backend.Domain.OperationRequests;
using DDDSample1.Domain.Patients;

namespace DDDSample1.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _operationRequestRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IOperationTypeRepository _operationTypeRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IUserRepository _userRepository;

        private readonly IStaffRepository _staffRepository;
        private readonly IConfiguration _configuration;
        private readonly AuditService _auditService;
        private readonly IMapper _mapper;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository operationRequestRepository, IAppointmentRepository appointmentRepository, IOperationTypeRepository operationTypeRepository, IPatientRepository patientRepository, IUserRepository userRepository, IStaffRepository staffRepository, IConfiguration configuration, AuditService auditService, IMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._operationRequestRepository = operationRequestRepository;
            this._appointmentRepository = appointmentRepository;
            this._operationTypeRepository = operationTypeRepository;
            this._patientRepository = patientRepository;
            this._userRepository = userRepository;
            this._staffRepository = staffRepository;
            this._configuration = configuration;
            this._auditService = auditService;
            this._mapper = mapper;
        }

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository operationRequestRepository, IAppointmentRepository appointmentRepository, IOperationTypeRepository operationTypeRepository, IPatientRepository patientRepository, IUserRepository userRepository, IStaffRepository staffRepository, IConfiguration configuration, IMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._operationRequestRepository = operationRequestRepository;
            this._appointmentRepository = appointmentRepository;
            this._operationTypeRepository = operationTypeRepository;
            this._patientRepository = patientRepository;
            this._userRepository = userRepository;
            this._staffRepository = staffRepository;
            this._configuration = configuration;
            this._mapper = mapper;
        }

        // Obtém todos os requests
        public async Task<List<OperationRequestDTO>> GetAllAsync()
        {
            var list = await this._operationRequestRepository.GetAllAsync();
            List<OperationRequestDTO> listDto = list.ConvertAll(operationRequest => new OperationRequestDTO
            {
                Id = operationRequest.Id.AsGuid(),
                Deadline = operationRequest.deadline,
                Priority = operationRequest.priority,
                LicenseNumber = operationRequest.licenseNumber,
                MedicalRecordNumber = operationRequest.medicalRecordNumber,
                OperationTypeId = operationRequest.operationTypeId
            });
            return listDto;
        }

        // Obtém um request pelo ID
        public async Task<OperationRequestDTO> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._operationRequestRepository.GetByIdAsync(id);
            if (operationRequest == null) return null;

            return new OperationRequestDTO
            {
                Id = operationRequest.Id.AsGuid(),
                Deadline = operationRequest.deadline,
                Priority = operationRequest.priority,
                LicenseNumber = operationRequest.licenseNumber,
                MedicalRecordNumber = operationRequest.medicalRecordNumber,
                OperationTypeId = operationRequest.operationTypeId
            };
        }

        // Adiciona um novo OperationRequest
        public async Task<OperationRequestDTO> AddAsync(CreatingOperationRequestDTO dto)
        {
            bool isDuplicate = await _operationRequestRepository.IsDuplicateRequestAsync(dto.OperationTypeId, dto.MedicalRecordNumber);

            if (isDuplicate)
            {
                throw new InvalidOperationException("There is already an open operation request for this type and patient.");
            }

            var deadline = dto.Deadline;
            var priority = dto.Priority;
            var licenseNumber = dto.LicenseNumber;
            var medicalRecordNumber = dto.MedicalRecordNumber;
            var operationTypeId = dto.OperationTypeId;

            var operationRequest = new OperationRequest(operationTypeId, deadline, priority, licenseNumber, medicalRecordNumber);

            await this._operationRequestRepository.AddAsync(operationRequest);
            await _unitOfWork.CommitAsync();

            return new OperationRequestDTO
            {
                Id = operationRequest.Id.AsGuid(),
                Deadline = operationRequest.deadline,
                Priority = operationRequest.priority,
                LicenseNumber = operationRequest.licenseNumber,
                MedicalRecordNumber = operationRequest.medicalRecordNumber,
                OperationTypeId = operationRequest.operationTypeId
            };
        }

        // Atualiza um OperationRequest existente
        public async Task<OperationRequestDTO> UpdateAsync(OperationRequestDTO dto)
        {
            var operationRequest = await this._operationRequestRepository.GetByIdAsync(new OperationRequestId(dto.Id));
            if (operationRequest == null) return null;

            operationRequest.ChangeDeadLine(dto.Deadline);
            operationRequest.ChangePriority(dto.Priority);

            await _unitOfWork.CommitAsync();

            return new OperationRequestDTO
            {
                Id = operationRequest.Id.AsGuid(),
                Deadline = operationRequest.deadline,
                Priority = operationRequest.priority,
                LicenseNumber = operationRequest.licenseNumber,
                MedicalRecordNumber = operationRequest.medicalRecordNumber,
                OperationTypeId = operationRequest.operationTypeId
            };
        }

        // Delete an OperationRequest
        public async Task <OperationRequestDTO> DeleteAsync(OperationRequestId id) {
            var operationRequest = await this._operationRequestRepository.GetByIdAsync(id);
            if (operationRequest == null) throw new BusinessRuleValidationException("Operation Request not found.");

            // Verify if there is an appointment associated with the operation request or if it is active
            if(await this._appointmentRepository.GetByOperationRequestIdAsync(id) != null) throw new BusinessRuleValidationException("Não é possível excluir um pedido operação associado a uma consulta.");

            this._operationRequestRepository.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return _mapper.Map<OperationRequestDTO>(operationRequest);
        }

        // Obtém um request pela prioridade
        public async Task<List<OperationRequestDTO>> GetByPriorityAsync(Priority priority)
        {
            var list = await this._operationRequestRepository.GetByPriorityAsync(priority);
            List<OperationRequestDTO> listDto = list.ConvertAll(operationRequest => new OperationRequestDTO
            {
                Id = operationRequest.Id.AsGuid(),
                Deadline = operationRequest.deadline,
                Priority = operationRequest.priority,
                LicenseNumber = operationRequest.licenseNumber,
                MedicalRecordNumber = operationRequest.medicalRecordNumber,
                OperationTypeId = operationRequest.operationTypeId
            });
            return listDto;
        }
        public async Task<string> UpdateRequisitionAsync(string id,string userEmail, UpdateOperationRequisitionDto updateDto )
        {
            var requisition = await _operationRequestRepository.GetByIdAsync(new OperationRequestId(id));

            if (requisition == null)
            {
                throw new Exception("Operation requisition not found.");
            }

            var user = await _userRepository.FindByEmailAsync(new Email(userEmail));
            if (user == null)
            {
                throw new Exception("Invalid user.");
            }

            var doctorProfile = await _staffRepository.GetByUserIdAsync(user.Id);

            if (requisition.licenseNumber != doctorProfile.Id)
            {
                throw new UnauthorizedAccessException("You are not authorized to update this requisition.");
            }

            var logDescription = $"Updated Deadline from {requisition.deadline} to {updateDto.Deadline} " +
                                $"and Priority from {requisition.priority} to {updateDto.Priority}";

            requisition.ChangeDeadLine(new Deadline(updateDto.Deadline.Value));

            if (updateDto.Priority == null)
            {
                throw new ArgumentNullException(nameof(updateDto.Priority), "Priority cannot be null.");
            }

            PriorityType priorityType;
            try
            {
                priorityType = Enum.Parse<PriorityType>(updateDto.Priority);
            }
            catch (ArgumentException)
            {
                throw new ArgumentException($"Invalid priority type '{updateDto.Priority}'. Allowed values are: {string.Join(", ", Enum.GetNames(typeof(PriorityType)))}.");
            }

            requisition.ChangePriority(new Priority(priorityType));

            await _operationRequestRepository.UpdateOperationRequestAsync(requisition);
            await _unitOfWork.CommitAsync();

            _auditService.LogUpdateOperationRequisition(requisition.Id.AsString(), logDescription, user.Email.Value);

            return "Operation requisition updated successfully.";
        }

        public async Task<List<ListOperationRequestDTO>> SearchOperationRequests(
            string firstName, 
            string lastName, 
            string operationType, 
            string status, 
            Priority priority,
            DateTime? dateRequested,
            DateTime? dueDate,
            LicenseNumber doctorId)
        {
            var requests = await _operationRequestRepository.SearchOperationRequestsAsync(
                firstName, lastName, operationType, status, priority, dateRequested, dueDate, doctorId);

            if (!requests.Any())
            {
                throw new InvalidOperationException("No information found based on the search criteria.");
            }

            var result = new List<ListOperationRequestDTO>();

            foreach (var or in requests)
            {
                if (or.medicalRecordNumber == null)
                {
                    throw new InvalidOperationException("OperationRequest is missing a valid medical record number.");
                }

                var patient = await _patientRepository.FindByMedicalRecordNumberAsync(or.medicalRecordNumber)
                    ?? throw new InvalidOperationException("Patient information is required but was not found.");

                var patientUser = await _userRepository.GetByIdAsync(patient.UserId)
                    ?? throw new InvalidOperationException("Patient's user information is required but was not found.");

                var operationTypeEntity = await _operationTypeRepository.GetByIdAsync(or.operationTypeId)
                    ?? throw new InvalidOperationException("Operation type information is required but was not found.");

                if (!operationTypeEntity.Active)
                {
                    throw new InvalidOperationException("Operation type must be active.");
                }

                if (or.priority == null)
                {
                    throw new InvalidOperationException("Priority is required for OperationRequest but was not provided.");
                }
                if (or.deadline == null)
                {
                    throw new InvalidOperationException("Deadline is required for OperationRequest but was not provided.");
                }

                result.Add(new ListOperationRequestDTO
                {
                    PatientName = $"{patientUser.Name.FirstName} {patientUser.Name.LastName}",
                    OperationType = operationTypeEntity.Name.ToString(),
                    Status = or.Active ? "Active" : "Inactive",
                    Priority = or.priority.Value.ToString(),
                    Deadline = or.deadline.Value,
                    AssignedStaff = operationTypeEntity.RequiredStaff?.RequiredNumber.ToString() 
                        ?? throw new InvalidOperationException("Required staff information is missing.")
                });
            }

            return result;
        }


    }
}
