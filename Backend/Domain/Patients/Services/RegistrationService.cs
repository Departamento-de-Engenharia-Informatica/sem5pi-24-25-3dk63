using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using Backend.Domain.Users.ValueObjects;
using Microsoft.AspNetCore.Mvc;

namespace DDDSample1.Patients
{
    public class RegistrationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;

        public RegistrationService(IUnitOfWork unitOfWork, IUserRepository userRepository, IPatientRepository patientRepository, IConfiguration configuration, EmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _patientRepository = patientRepository;
            _emailService = emailService;
        }

        public async Task SelfRegisterPatientAsync(SelfRegisterPatientDTO dto, string iamEmail)
        {
            // Verify if the Patient exists in the system registered by the Admin
            var patient = await _patientRepository.GetPatientByPersonalEmailAsync(new Email(dto.PersonalEmail));
            if (patient == null)
            {
                throw new Exception("Patient not found. Please contact the admin.");
            }
            
            // Verify if the User already exists
            var user = await _userRepository.FindByEmailAsync(new Email(dto.PersonalEmail));
            if (user.Username.ToString().Equals(iamEmail))
            {
            	throw new Exception("User already exists.");    
            }

            user = await updateUser(user,dto,iamEmail);

            await _unitOfWork.CommitAsync();

            // Send the confirmation email with the token
            await _emailService.SendConfirmationEmailAsync(user.Email.ToString(), user.ConfirmationToken);
        }

        private async Task<User> updateUser(User user, SelfRegisterPatientDTO dto, string iamEmail)
        {
            user.ChangeConfirmationToken(Guid.NewGuid().ToString("N"));
            user.ChangeActiveTrue();
            user.ChangeUsername(new Username(iamEmail));
            user.ChangeActiveFalse();
            await _userRepository.UpdateUserAsync(user);
            return user;
        }


        public async Task ConfirmEmailAsync(string token)
        {
            var user = await _userRepository.GetUserByConfirmationTokenAsync(token);
            var patient = await _patientRepository.FindByUserIdAsync(user.Id);
            
            if (user == null)
            {
                throw new Exception("Invalid token or email.");
            }

            if (patient == null)
            {
                throw new Exception("Patient not found by user id.");
            }

            // Activate the user account
            user.ChangeActiveTrue();
            user.ConfirmationToken = null;
            await _userRepository.UpdateUserAsync(user);

            //Activate the patient account
            patient.ChangeActiveTrue();
            await _patientRepository.UpdatePatientAsync(patient);
        }

        public async Task<User> FindByEmailAsync(Email email)
        {
            return await _userRepository.FindByEmailAsync(email);
        }
    }
}
