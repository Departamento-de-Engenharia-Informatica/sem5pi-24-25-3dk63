using Backend.Domain.Staff.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Specialization;
using AutoMapper;
using DDDSample1.Users;
using Backend.Domain.Users.ValueObjects;
using Backend.Domain.Specialization.ValueObjects;
using Microsoft.EntityFrameworkCore;
using DDDSample1.Infrastructure;
using Backend.Domain.Shared;
using System.Reflection;
using System.ComponentModel;
using Backend.Domain.Staff;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Infrastructure.PendingChangeStaff;
using DDDSample1.Domain.PendingChange;


namespace DDDSample1.Domain.Staff
{
    public class StaffService
    {
        private readonly UserService _userService;
        private readonly IStaffRepository _staffRepository;
        private readonly EmailService _emailService;
        private readonly IUserRepository _userRepository;
        private readonly IPendingChangesStaffRepository _pendingChangesStaffRepository;
        private readonly ISpecializationRepository _specializationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly List<string> _sensitiveAttributes = new List<string> { "Email", "emergencyContact" };
        private readonly List<string> _sensitiveAttributesStaff = new List<string> { "Email", "PhoneNumber" };


        private readonly AuditService _auditService;
        private readonly DDDSample1DbContext _context;

        public StaffService(UserService userService, EmailService emailService, IStaffRepository staffRepository, IUserRepository userRepository, ISpecializationRepository specializationRepository, IUnitOfWork unitOfWork, IMapper mapper, AuditService auditService, DDDSample1DbContext context, IPendingChangesStaffRepository pendingChangesStaffRepository)
        {
            _emailService = emailService;
            _userService = userService;
            _staffRepository = staffRepository;
            _userRepository = userRepository;
            _specializationRepository = specializationRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _auditService = auditService;
            _context = context;
            _pendingChangesStaffRepository = pendingChangesStaffRepository;
        }

        public async Task<List<StaffDTO>> GetAllAsync()
        {
            var staffList = await _staffRepository.GetAllAsync();
            return _mapper.Map<List<StaffDTO>>(staffList);
        }

        public async Task<List<StaffCompleteDTO>> GetAllAsyncCompleteInformation()
        {
            var staffList = await _staffRepository.GetAllAsync();
            var userList = await _userRepository.GetAllAsync();


            List<StaffCompleteDTO> listDto = staffList.ConvertAll(staff => new StaffCompleteDTO
            {
                LicenseNumber = staff.Id.Value.ToString(),
                Username = _userRepository.GetByIdAsync(staff.UserId).Result.Username.Value.ToString(),
                Role = _userRepository.GetByIdAsync(staff.UserId).Result.Role.Value.ToString(),
                PhoneNumber = _userRepository.GetByIdAsync(staff.UserId).Result.PhoneNumber.Number.ToString(),
                Email = _userRepository.GetByIdAsync(staff.UserId).Result.Email.Value.ToString(),
                Name = _userRepository.GetByIdAsync(staff.UserId).Result.Name.FullName.ToString(),
                SpecializationDescription = _specializationRepository.GetByIdAsync(staff.SpecializationId).Result.Description.Value.ToString(),
                AvailabilitySlots = staff.AvailabilitySlots.Slots,
                Active = staff.Active
            });

            return listDto;
        }

        public async Task<StaffDTO?> GetByUserIdAsync(UserId userId)
        {
            var staff = await _staffRepository.GetByUserIdAsync(userId);
            return staff == null ? null : _mapper.Map<StaffDTO>(staff);
        }

        public async Task<StaffDTO?> GetByLicenseNumberAsync(LicenseNumber licenseNumber)
        {
            var staff = await _staffRepository.GetByLicenseNumberAsync(licenseNumber);
            return staff == null ? null : _mapper.Map<StaffDTO>(staff);
        }

        public async Task<StaffDTO> CreateStaffWithUserAsync(CreatingStaffDTO staffDto)
        {
            var createdUserId = Guid.Empty;

            var role = Enum.Parse<RoleType>(staffDto.Role);
            var creatingUserDto = new CreatingUserDto(
                new Role(role),
                new Email(staffDto.Email),
                staffDto.FirstName,
                staffDto.LastName,
                new PhoneNumber(staffDto.PhoneNumber)
            );

            try
            {
                var createdUser = await _userService.AddAsync(creatingUserDto);
                createdUserId = createdUser.Id;

                var specialization = await _specializationRepository.GetByDescriptionAsync(new Description(staffDto.SpecializationDescription));
                if (specialization == null)
                    throw new ArgumentException($"Specialization '{staffDto.SpecializationDescription}' not found.");

                var staff = new Staff(
                    new UserId(createdUser.Id),
                    new LicenseNumber(staffDto.LicenseNumber),
                    specialization.Id,
                    new AvailabilitySlots(staffDto.AvailabilitySlots ?? new List<AvailabilitySlot>())
                );

                await _staffRepository.AddAsync(staff);
                await _unitOfWork.CommitAsync();

                return _mapper.Map<StaffDTO>(staff);
            }
            catch (Exception ex)
            {
                if (createdUserId != Guid.Empty)
                {
                    await _userService.DeleteFailureAsync(new UserId(createdUserId));
                }

                throw new Exception("An error occurred while creating the user and staff.", ex);
            }
        }

        public async Task<bool?> UpdateAsync(StaffUpdateDTO updateDto, string adminEmail, string licenseNumber)
        {
            var staff = await _staffRepository.GetByLicenseNumberAsync(new LicenseNumber(licenseNumber));
            var userStaff = await _userRepository.GetByIdAsync(staff.UserId);
            if (staff == null) return null;

            // Atualizar informações do staff
            await UpdateStaffInfo(staff, userStaff, updateDto);
            // Logar alterações METER ADMIN
            _auditService.LogEditStaff(staff, adminEmail);

            return true;
        }

        private async Task<Staff> UpdateStaffInfo(Staff staff, User user, StaffUpdateDTO updateDto)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null");

            if (staff == null) throw new ArgumentNullException(nameof(staff), "Staff cannot be null");

            bool userSensitiveDataChanged = false;

            // Obter propriedades do DTO
            PropertyInfo[] properties = typeof(StaffUpdateDTO).GetProperties();

            //criar lista para armaazenar propriedades alteradas e as mudanças tipo: email de "a" para "b"
            List<string> changedProperties = new List<string>();

            foreach (PropertyInfo property in properties)
            {
                //ignorr caso tentem alterar o id
                if (property.PropertyType == typeof(LicenseNumber)) continue;

                var newValue = property.GetValue(updateDto, null);
                var atualValue = new object();

                if (user.GetType().GetProperty(property.Name) != null)
                {
                    atualValue = user.GetType().GetProperty(property.Name)?.GetValue(user, null);
                }
                else atualValue = staff.GetType().GetProperty(property.Name)?.GetValue(staff, null);


                if (property.Name == "SpecializationDescription")
                {
                    var specialization = await _specializationRepository.GetByDescriptionAsync(new Description(newValue.ToString()));
                    if (specialization == null)
                    {
                        throw new BusinessRuleValidationException($"Specialization '{newValue.ToString()}' not found.");
                    }
                    else
                    {
                        typeof(Staff).GetProperty("SpecializationId")?.SetValue(staff, specialization.Id);
                    }
                    continue;
                }

                if (newValue != null && !newValue.Equals(atualValue))
                {
                    if (CheckIfExistsOnUser(property.Name))
                    {
                        // Atualizar valor na entidade User
                        typeof(User).GetProperty(property.Name)?.SetValue(user, newValue);

                        if (_sensitiveAttributesStaff.Contains(property.Name))
                        {
                            changedProperties.Add($"{property.Name}: Valor alterado: {atualValue} -> Valor atual: {newValue}");
                            userSensitiveDataChanged = true;
                        }
                    }
                    else if (CheckIfExistsOnStaff(property.Name))
                    {
                        // Atualizar valor na entidade Staff
                        typeof(Staff).GetProperty(property.Name)?.SetValue(staff, newValue);
                    }

                }
            }

            // Atualizar entidades no repositório
            await _userRepository.UpdateUserAsync(user);
            await _staffRepository.UpdateStaffAsync(staff);
            await _unitOfWork.CommitAsync();

            // Enviar notificação se dados sensíveis forem alterados
            if (userSensitiveDataChanged)
            {
                await _emailService.SendStaffNotificationEmailAsync(changedProperties, updateDto);
            }

            return staff;

        }


        private bool CheckIfExistsOnUser(string propertyName)
        {
            PropertyInfo userProperty = typeof(User).GetProperty(propertyName);
            return userProperty != null && userProperty.CanWrite;
        }

        private bool CheckIfExistsOnStaff(string propertyName)
        {
            foreach (PropertyInfo property in typeof(Staff).GetProperties())
            {
                Console.WriteLine("Property name EM STAFF: " + property.Name);
            }

            PropertyInfo staffProperty = typeof(Staff).GetProperty(propertyName);
            Console.WriteLine("PROCUREI Property name: " + propertyName);

            return staffProperty != null && staffProperty.CanWrite;
        }

        public async Task<StaffDTO?> DeleteAsync(LicenseNumber licenseNumber)
        {
            var staff = await _staffRepository.GetByLicenseNumberAsync(licenseNumber);
            var user = await _userRepository.GetByIdAsync(staff.UserId);
            if (staff == null) return null;

            _staffRepository.Remove(staff);
            _userRepository.Remove(user);

            await _unitOfWork.CommitAsync();

            return _mapper.Map<StaffDTO>(staff);
        }

        public async Task<List<StaffCompleteDTO>> SearchStaffAsync(string? name = null, string? email = null, string? specializationDescription = null)
        {
            var query = from staff in _staffRepository.GetQueryable()
                        join user in _userRepository.GetQueryable() on staff.UserId equals user.Id
                        select new { staff, user };
            if (!string.IsNullOrEmpty(name))
            {
                var nomes = name.Split(" ");
                if (nomes.Length < 2)
                {
                    query = query.Where(s => s.user.Name.FirstName.StartsWith(name) || s.user.Name.LastName.StartsWith(name));
                }
                else
                {
                    string primeiroNome = nomes[0];
                    string ultimoNome = nomes[nomes.Length - 1];
                    query = query.Where(s => s.user.Name.FirstName.StartsWith(primeiroNome) && s.user.Name.LastName.StartsWith(ultimoNome));
                }
            }

            var results = await query.ToListAsync();

            if (!string.IsNullOrEmpty(email))
            {

                results = results.Where(s => s.user.Email.Value == email).ToList();
            }

            if (!string.IsNullOrEmpty(specializationDescription))
            {
                // Verifique se a especialização corresponde ao início da descrição (prefixo)
                var specializations = await _specializationRepository.GetAllAsync();

                // Filtra as especializações que começam com a descrição fornecida
                var filteredSpecializations = specializations
                    .Where(s => s.Description.Value.StartsWith(specializationDescription, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                if (filteredSpecializations.Any())
                {
                    results = results.Where(s => filteredSpecializations
                        .Any(spec => spec.Id == s.staff.SpecializationId))
                        .ToList();
                }
                else
                {
                    // Caso nenhuma especialização correspondente seja encontrada, retorna null
                    return new List<StaffCompleteDTO>();
                }
            }


            var paginatedStaff = results.Select(s => s.staff).ToList();

            List<StaffCompleteDTO> listDto = results.ConvertAll(s => new StaffCompleteDTO
            {
                LicenseNumber = s.staff.Id.Value.ToString(),
                Username = _userRepository.GetByIdAsync(s.staff.UserId).Result.Username.Value.ToString(),
                Role = _userRepository.GetByIdAsync(s.staff.UserId).Result.Role.Value.ToString(),
                Email = _userRepository.GetByIdAsync(s.staff.UserId).Result.Email.Value.ToString(),
                Name = _userRepository.GetByIdAsync(s.staff.UserId).Result.Name.ToString(),
                PhoneNumber = _userRepository.GetByIdAsync(s.staff.UserId).Result.PhoneNumber.Number.ToString(),
                SpecializationDescription = _specializationRepository.GetByIdAsync(s.staff.SpecializationId).Result.Description.Value.ToString(),
                AvailabilitySlots = s.staff.AvailabilitySlots.Slots,
                Active = s.staff.Active

            });
            return listDto;
        }

        public async Task<StaffDTO?> DeactivateStaffAsync(String adminEmail, string? name = null, string? licenseNumber = null, string? phoneNumber = null, string? userId = null, string? specialization = null)
        {
            var query = from staff in _staffRepository.GetQueryable()
                        join user in _userRepository.GetQueryable() on staff.UserId equals user.Id
                        select new { staff, user };

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(s => s.user.Name.FirstName.Contains(name) || s.user.Name.LastName.Contains(name));
            }

            if (!string.IsNullOrEmpty(phoneNumber))
            {
                string phoneNumber2 = "+" + phoneNumber;

                query = query.Where(s => s.user.PhoneNumber.Number == phoneNumber2);
            }

            var results = await query.ToListAsync();


            if (!string.IsNullOrEmpty(licenseNumber))
            {
                var license = await _staffRepository.GetByLicenseNumberAsync(new LicenseNumber(licenseNumber));

                if (license != null)
                {
                    results = results.Where(s => s.staff.Id == license.Id).ToList();
                }
            }

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userRepository.GetByIdAsync(new UserId(Guid.Parse(userId)));

                if (user != null)
                {
                    results = results.Where(s => s.user.Id == user.Id).ToList();
                }
            }

            if (!string.IsNullOrEmpty(specialization))
            {
                var spec = await _specializationRepository.GetByDescriptionAsync(new Description(specialization));

                if (spec != null)
                {
                    results = results.Where(s => s.staff.SpecializationId == spec.Id).ToList();
                }
            }

            // Depois de obter os resultados, podemos aplicar qualquer lógica adicional, se necessário
            var staffResult = results.FirstOrDefault();


            if (staffResult == null) return null;



            // Log e desativação
            _auditService.LogDeactivateStaff(staffResult.staff, adminEmail);
            staffResult.staff.Deactivate();
            await _unitOfWork.CommitAsync();

            return _mapper.Map<StaffDTO>(staffResult.staff);
        }


        public async Task<StaffDTO?> DeactivateAsync(String licenseNumber, string adminEmail)
        {
            var staff = await _staffRepository.GetByLicenseNumberAsync(new LicenseNumber(licenseNumber));
            if (staff == null) return null;

            _auditService.LogDeactivateStaff(staff, adminEmail);

            staff.Deactivate();
            await _unitOfWork.CommitAsync();

            return _mapper.Map<StaffDTO>(staff);
        }



        public async Task<StaffDTO?> EditAsync(StaffDTO dto)
        {
            var licenseNumber = new LicenseNumber(dto.LicenseNumber.ToString());
            var staff = await _staffRepository.GetByLicenseNumberAsync(licenseNumber);
            if (staff == null) return null;

            var updatedAvailabilitySlots = new AvailabilitySlots();
            foreach (var slot in dto.AvailabilitySlots)
            {
                updatedAvailabilitySlots.AddSlot(slot.Start, slot.End);
            }

            staff.UpdateAvailabilitySlots(updatedAvailabilitySlots);
            await _unitOfWork.CommitAsync();

            return _mapper.Map<StaffDTO>(staff);
        }

        public async Task<UserDTO?> getUserStaff(StaffDTO staff)
        {
            var user = await _userRepository.GetByIdAsync(new UserId(staff.UserId));
            if (user == null) return null;
            return _mapper.Map<UserDTO>(user);
        }
        public async Task AddPendingChangesAsync(PendingChangesStaffDTO pendingChangesDto, UserId userId)
        {
            var pendingChanges = new PendingChangesStaff(userId)
            {
                Email = pendingChangesDto.Email,
                PhoneNumber = pendingChangesDto.PhoneNumber,
                Specialization = pendingChangesDto.Specialization,
                AvailabilitySlots = pendingChangesDto.AvailabilitySlots
            };
            await _pendingChangesStaffRepository.AddPendingChangesStaffAsync(pendingChanges);

            await _unitOfWork.CommitAsync();
        }
        public async Task ApplyPendingChangesAsync(User user)
        {
            try{
            var pendingChanges = await _pendingChangesStaffRepository.GetPendingChangesByUserIdAsync(user.Id);
            if (pendingChanges == null)
            {
                Console.WriteLine("No pending changes found for this user.");
                throw new Exception("No pending changes found for this user.");
            }
            var staff = await _staffRepository.GetByUserIdAsync(user.Id);

            if (pendingChanges.Email != null)
            {
                user.ChangeEmail(pendingChanges.Email);
            }
            if (pendingChanges.PhoneNumber != null)
                {
                    var newPhoneNumber = new PhoneNumber(pendingChanges.PhoneNumber.Number);
                    user.ChangephoneNumber(newPhoneNumber);
                }
            if (pendingChanges.Specialization != null)
            {
                var specialization = await _specializationRepository.GetByDescriptionAsync(new Description(pendingChanges.Specialization));
                if (specialization == null)
                    throw new ArgumentException($"Specialization '{pendingChanges.Specialization}' not found.");
                staff.changeSpecialization(specialization.Id);
            }
            if (pendingChanges.AvailabilitySlots != null)
            {
                staff.UpdateAvailabilitySlots(pendingChanges.AvailabilitySlots);
            }
            await _userRepository.UpdateUserAsync(user);
            await _staffRepository.UpdateStaffAsync(staff);
            await _pendingChangesStaffRepository.RemovePendingChangesStaffAsync(user.Id);
            await _unitOfWork.CommitAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Apply pending changes failed: {ex.Message}");
            }
        }


        public async Task<bool?> CheckSpecializationExists(string specializationDescription)
        {
            var specialization = await _specializationRepository.GetByDescriptionAsync(new Description(specializationDescription));
            if (specialization == null)
                return false;
            return true;
        }
        public async Task<bool?> CheckSpecialization(string specializationDescription, StaffDTO staff)
        {
            var specialization2 = await _specializationRepository.FindByIdAsync(new SpecializationId(staff.SpecializationId));

            String specialization = specialization2.Description.Value;

            if (specialization.Equals(specializationDescription))
                return false;

            return true;
        }

        public async Task RemovePendingChangesAsync(UserId userId)
        {
            var pendingChanges = await _pendingChangesStaffRepository.GetPendingChangesByUserIdAsync(userId);
            if (pendingChanges == null)
            {
                return;
            }
            await _pendingChangesStaffRepository.RemovePendingChangesStaffAsync(userId);
            await _unitOfWork.CommitAsync();
        }


        public async Task ConfirmUpdateAsync(string token)
        {
            var user = await _userRepository.GetUserByConfirmationTokenAsync(token);
            if (user == null)
            {
                Console.WriteLine("User not found.");
                throw new Exception("Invalid or expired confirmation token.");
            }

            var staff = await _staffRepository.GetByUserIdAsync(user.Id);
            if (staff == null)
            {
                Console.WriteLine("Staff not found.");
                throw new Exception("Staff not found.");
            }

            try
            {
                var pendingChange = await _pendingChangesStaffRepository.GetPendingChangesByUserIdAsync(user.Id);
                var pendingdto = _mapper.Map<PendingChangesStaffDTO>(pendingChange);
                var staffdto = _mapper.Map<StaffDTO>(staff);
                var userDto = _mapper.Map<UserDTO>(user);
                await _auditService.LogProfileStaffUpdate(staffdto, userDto, pendingdto);
                await ApplyPendingChangesAsync(user);

            }
            catch (Exception ex)
            {
                Console.WriteLine("Update confirmation failed2222:", ex.Message);
                throw new Exception($"Update confirmation failed: {ex.Message}");
            }
        }
    }
}
