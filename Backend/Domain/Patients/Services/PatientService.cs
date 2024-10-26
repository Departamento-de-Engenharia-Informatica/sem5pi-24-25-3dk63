using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using System.ComponentModel.DataAnnotations;
using Backend.Domain.Users.ValueObjects;
using Backend.Domain.Shared;
using DDDSample1.Domain.PendingChange;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Patients
{
    public class PatientService
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPendingChangesRepository _pendingChangesRepository;
        private readonly EmailService _emailService;
        private readonly AuditService _auditService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PatientService> _logger;
        private readonly IMapper _mapper;
        private readonly List<string> _sensitiveAttributes = new List<string> { "Email", "emergencyContact"};

        public PatientService(IPatientRepository patientRepository, IUserRepository userRepository, IPendingChangesRepository pendingChangesRepository, EmailService emailService,
                                IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ILogger<PatientService> logger,
                                IUnitOfWork unitOfWork, IMapper mapper, AuditService auditService)
        {
            _patientRepository = patientRepository;
            _userRepository = userRepository;
            _pendingChangesRepository = pendingChangesRepository;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
            _auditService = auditService;
        }

        public async Task<PatientDTO> GetByIdAsync(MedicalRecordNumber id)
        {
            var patient = await this._patientRepository.GetByIdAsync(id);
            return patient == null ? null : _mapper.Map<PatientDTO>(patient);
        }



        public async Task<PatientDTO> RegisterPatientAsync(RegisterPatientDTO registerDto)
        {
            // Check if the patient medical record number already exists
            if (await _patientRepository.FindByEmailAsync(registerDto.personalEmail) == null)
            {
                //Register the initial user
                var user = await createUser(registerDto);


                // Register the patient
                var patient = new Patient(user.Id, registerDto.dateOfBirth, registerDto.gender, registerDto.emergencyContact, _patientRepository.GetNextSequentialNumberAsync().Result);
                patient = await _patientRepository.AddAsync(patient);
                await _unitOfWork.CommitAsync();

                return _mapper.Map<PatientDTO>(patient);
            }
            else
            {
                throw new BusinessRuleValidationException("Patient already exists.");
            }
        }

        private async Task<User> createUser(RegisterPatientDTO dto)
        {
            int sequentialNumber = await this._userRepository.GetNextSequentialNumberAsync();
            string domain = _configuration["DNS_DOMAIN"];
            if (string.IsNullOrEmpty(domain))
            {
                throw new BusinessRuleValidationException("O domínio DNS não está configurado corretamente.");
            }
            int recruitmentYear = DateTime.Now.Year;
            var role = new Role(RoleType.Patient);
            var phoneNumber = new PhoneNumber(dto.phoneNumber.Number);
            var user = new User(role, dto.personalEmail, dto.name, recruitmentYear, domain, sequentialNumber,phoneNumber);
            user.ChangeActiveFalse();
            user = await _userRepository.AddAsync(user);
            return user;
        }

        public async Task<bool> UpdatePatientProfileAsync(PatientUpdateDTO updateDto)
        {
            var patient = await _patientRepository.FindByMedicalRecordNumberAsync(updateDto.Id);
            var userPatient = await _patientRepository.FindByEmailAsync(updateDto.personalEmail);

            if (patient == null)
            {
                return false;
            }

            // Update patient profile
            patient = await UpdatePatientInfo(patient, userPatient, updateDto);

            // Log changes
            _auditService.LogEditPatientProfile(patient, userPatient, updateDto);

            return true;
        }

        private async Task<Patient> UpdatePatientInfo(Patient patient, User user, PatientUpdateDTO updateDto)
        {
            if (user == null) throw new ArgumentNullException(nameof(user), "User cannot be null");

            if (patient == null) throw new ArgumentNullException(nameof(patient), "Patient cannot be null");

            bool userSensitiveDataChanged = false;
            bool patientSensitiveDataChanged = false;

            PropertyInfo[] properties = typeof(PatientUpdateDTO).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                // Verify if it is the id, if so continue to the other atributes
                if(property.PropertyType == typeof(MedicalRecordNumber)) continue;

                var newValue = property.GetValue(updateDto, null);

                if (newValue != null)
                {
                    if (CheckIfExistsOnUser(property.Name))
                    {
                        var oldValue = typeof(User).GetProperty(property.Name)?.GetValue(user);

                        typeof(User).GetProperty(property.Name)?.SetValue(user, newValue);

                        if (_sensitiveAttributes.Contains(property.Name))
                        {
                            userSensitiveDataChanged = true;
                        }
                    }

                    if (CheckIfExistsOnPatient(property.Name))
                    {
                        var oldValue = typeof(Patient).GetProperty(property.Name)?.GetValue(patient);

                        typeof(Patient).GetProperty(property.Name)?.SetValue(patient, newValue);

                        if (_sensitiveAttributes.Contains(property.Name))
                        {
                            patientSensitiveDataChanged = true;
                        }
                    }
                }
            }

            await _userRepository.UpdateUserAsync(user);
            await _patientRepository.UpdatePatientAsync(patient);
            await _unitOfWork.CommitAsync();

            if (userSensitiveDataChanged || patientSensitiveDataChanged)
            {
                await _emailService.SendPatientNotificationEmailAsync(updateDto);
            }

            return patient;
        }
        public async Task ConfirmUpdateAsync(string token)
        {
            var user = await _userRepository.GetUserByConfirmationTokenAsync(token);
            if (user == null)
            {
                throw new Exception("Invalid or expired confirmation token.");
            }

            var patient = await _patientRepository.FindByUserIdAsync(user.Id);
            if (patient == null)
            {
                throw new Exception("Patient not found.");
            }

            try
            {
                var pendingChange = await _pendingChangesRepository.GetPendingChangesByUserIdAsync(user.Id);
                var pendingChangeDto = _mapper.Map<PendingChangesDTO>(pendingChange);
                var patientDto = _mapper.Map<PatientDTO>(patient);
                var userDto = _mapper.Map<UserDTO>(user);
                _auditService.LogProfileUpdate(patientDto, userDto, pendingChangeDto);
                await ApplyPendingChangesAsync(new UserId(user.Id.Value));

            }
            catch (Exception ex)
            {
                throw new Exception($"Update confirmation failed: {ex.Message}");
            }
        }

            public async Task ApplyPendingChangesAsync(UserId userId)
        {
            var pendingChange = await _pendingChangesRepository.GetPendingChangesByUserIdAsync(userId);

            if (pendingChange == null)
            {
                throw new Exception("No pending changes found for this user.");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            var patient = await _patientRepository.FindByUserIdAsync(userId);

            if (user == null || patient == null)
            {
                throw new Exception("User or patient not found.");
            }

            user.ApplyChanges(pendingChange);
            patient.ApplyChanges(pendingChange);

            await _userRepository.UpdateUserAsync(user);
            await _patientRepository.UpdatePatientAsync(patient);

            await _pendingChangesRepository.RemovePendingChangesAsync(userId);

            await _unitOfWork.CommitAsync();
        }

        private bool CheckIfExistsOnUser(string propertyName)
        {
            PropertyInfo userProperty = typeof(User).GetProperty(propertyName);
            return userProperty != null && userProperty.CanWrite;
        }

        private bool CheckIfExistsOnPatient(string propertyName)
        {
            PropertyInfo patientProperty = typeof(Patient).GetProperty(propertyName);
            return patientProperty != null && patientProperty.CanWrite;
        }



        public async Task<PatientDTO> GetPatientByUsername(Username email)
        {
            var user = await _userRepository.GetUserByUsernameAsync(email);

            var patient = await _patientRepository.FindByUserIdAsync(user.Id);

            if (patient == null)
            {
                return null;
            }

            return _mapper.Map<PatientDTO>(patient);
        }

        public async Task AddPendingChangesAsync(PendingChangesDTO pendingChangesDto, UserId userId)
        {
            var pendingChanges = new PendingChanges(userId)
            {
                Name = pendingChangesDto.Name,
                Email = pendingChangesDto.Email,
                EmergencyContact = pendingChangesDto.EmergencyContact,
                PhoneNumber = pendingChangesDto.PhoneNumber,
                MedicalHistory = pendingChangesDto.MedicalHistory,
            };

            await _pendingChangesRepository.AddPendingChangesAsync(pendingChanges);

            await _unitOfWork.CommitAsync();
        }

        public async Task<PendingChanges> GetPendingChangesByUserIdAsync(UserId userId)
        {
            var pendingChanges = await _pendingChangesRepository.GetPendingChangesByUserIdAsync(userId);
            if (pendingChanges == null)
            {
                throw new InvalidOperationException("Pending changes not found for the given user ID.");
            }
            return pendingChanges;
        }

        public async Task RemovePendingChangesAsync(UserId userId)
        {
            var pendingChanges = await _pendingChangesRepository.GetPendingChangesByUserIdAsync(userId);
            if (pendingChanges == null)
            {
                return;
            }
            await _pendingChangesRepository.RemovePendingChangesAsync(userId);
            await _unitOfWork.CommitAsync();
        }

        public async Task<List<SearchPatientDTO>> SearchPatientAsync(string? name = null, string? email = null, string? dateOfBirth = null, string? medicalRecordNumber = null)
        {
            var query = from patient in _patientRepository.GetQueryable()
                        join user in _userRepository.GetQueryable() on patient.UserId equals user.Id
                        select new { patient, user };

            if (!string.IsNullOrEmpty(name))
            {
                // Check if the name contains an underscore and split it
                var nameParts = name.Split('_', StringSplitOptions.RemoveEmptyEntries);

                // Verify that we have two parts for first and last name
                if (nameParts.Length == 2)
                {
                    // Trim spaces from both parts
                    var firstName = nameParts[0].Trim();
                    var lastName = nameParts[1].Trim();

                    query = query.Where(p =>
                        p.user.Name.FirstName.Contains(firstName) &&
                        p.user.Name.LastName.Contains(lastName));
                }
                else
                {
                    throw new ArgumentException("Name must be in the format <firstName>_<lastName>.");
                }
            }

            var results = await query.ToListAsync();

            if (!string.IsNullOrEmpty(email))
            {
                results = results.Where(p => p.user.Email.Value == email).ToList();
            }

            if (!string.IsNullOrEmpty(dateOfBirth))
            {
                results = results.Where(p => p.patient.dateOfBirth.date.Equals(DateTime.Parse(dateOfBirth))).ToList();

            }

            if (!string.IsNullOrEmpty(medicalRecordNumber))
            {
                results = results.Where(p => p.patient.Id.Value == medicalRecordNumber).ToList();
            }

            return results.Select(p => new SearchPatientDTO
            {
                Name = p.user.Name,
                Email = p.user.Email,
                dateOfBirth = p.patient.dateOfBirth,
                MedicalRecordNumber = p.patient.Id
            }).ToList();
        }

        public async Task RequestAccountDeletionAsync(UserId userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw new Exception("User not found.");
            }

            user.ConfirmationToken = Guid.NewGuid().ToString("N");

            await _userRepository.UpdateUserAsync(user);
            await _unitOfWork.CommitAsync();

            await _emailService.SendDeletionConfirmationEmail(user.Email.ToString(), user.ConfirmationToken);
        }

        public async Task ConfirmDeletionAsync(string token)
        {
            var user = await _userRepository.GetUserByConfirmationTokenAsync(token);
            if (user == null)
            {
                throw new Exception("Invalid or expired confirmation token.");
            }

            user.ChangeActiveFalse();
            user.MarkForDeletion();
            user.ConfirmationToken = null;

            await _userRepository.UpdateUserAsync(user);
            await _unitOfWork.CommitAsync();
        }


        public async Task<PatientDTO> DeletePatientAsync(MedicalRecordNumber id, string adminEmail)
        {
            var patientToRemove = await _patientRepository.FindByMedicalRecordNumberAsync(id);

            if (patientToRemove == null) return null;

            patientToRemove.ChangeActiveFalse();
            patientToRemove.MarkForDeletion();
            this._patientRepository.Remove(patientToRemove);
            await this._unitOfWork.CommitAsync();
            _auditService.LogDeletionPatient(patientToRemove, adminEmail);

            return _mapper.Map<PatientDTO>(patientToRemove);
        }

    }
}