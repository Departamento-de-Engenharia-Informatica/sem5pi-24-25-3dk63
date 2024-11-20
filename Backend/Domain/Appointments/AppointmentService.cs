using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Appointments;

namespace DDDSample1.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IConfiguration _configuration;

        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository appointmentRepository, IConfiguration configuration)
        {
            this._unitOfWork = unitOfWork;
            this._appointmentRepository = appointmentRepository;
            this._configuration = configuration;
        }

        // Obtém todas as appointment
        public async Task<List<AppointmentDTO>> GetAllAsync()
        {
            var list = await this._appointmentRepository.GetAllAsync();
            List<AppointmentDTO> listDto = list.ConvertAll(appointment => new AppointmentDTO
            {
                Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            });
            return listDto;
        }

        // Obtém uma appointment pelo ID
        public async Task<AppointmentDTO> GetByIdAsync(AppointmentId id)
        {
            var appointment = await this._appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return null;

            return new AppointmentDTO
            {
                Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            };
        }

        // Adiciona uma nova appointment
        public async Task<AppointmentDTO> AddAsync(CreatingAppointmentDTO dto)
        {
            int sequentialNumber = await this._appointmentRepository.GetNextSequentialNumberAsync();

            string domain = _configuration["DNS_DOMAIN"];
            if (string.IsNullOrEmpty(domain))
            {
                throw new BusinessRuleValidationException("DNS_DOMAIN is not defined in the configuration file");
            }

            var date = new Date(dto.date.Value);
            var time = new Time(dto.time.Value);
            var operationRequestId = new OperationRequestId(dto.operationRequestId.Value);
            var roomNumber = dto.roomNumber;

            var appointment = new Appointment(operationRequestId, date, time, roomNumber);

            await this._appointmentRepository.AddAsync(appointment);
            await _unitOfWork.CommitAsync();

            return new AppointmentDTO
            {
                Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            };
        }

        // Atualiza uma appointment existente
        public async Task<AppointmentDTO> UpdateAsync(AppointmentDTO dto)
        {
            var appointment = await this._appointmentRepository.GetByIdAsync(new AppointmentId(dto.Id));
            if (appointment == null) return null;

            appointment.ChangeDate(dto.date);
            appointment.ChangeTime(dto.time);

            await _unitOfWork.CommitAsync();

            return new AppointmentDTO
            {
               Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            };
        }

        // Deleta uma appointment
        public async Task <AppointmentDTO> DeleteAsync(AppointmentId id) {
            var appointment = await this._appointmentRepository.GetByIdAsync(id);
            if (appointment == null) return null;
            
            if (appointment.Active) throw new BusinessRuleValidationException("Não é possível excluir uma marcação ativo.");

            this._appointmentRepository.Remove(appointment);
            await this._unitOfWork.CommitAsync();

            return new AppointmentDTO
            {
               Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            };
        }

        // Obtém appointments pela data
        public async Task<List<AppointmentDTO>> GetByDateAsync(Date date)
        {
            var list = await this._appointmentRepository.GetByDateAsync(date);
            List<AppointmentDTO> listDto = list.ConvertAll(appointment => new AppointmentDTO
            {
                Id = appointment.Id.AsGuid(),
                date = appointment.date,
                time = appointment.time,
                roomNumber = appointment.roomNumber,
                operationRequestId = appointment.operationRequestId,
            });
            return listDto;
        }
    }

    
}
