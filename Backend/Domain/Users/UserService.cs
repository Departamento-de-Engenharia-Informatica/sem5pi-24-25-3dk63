using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using AutoMapper;
using Backend.Domain.Users;

namespace DDDSample1.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IConfiguration configuration, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _configuration = configuration;
            _mapper = mapper;
        }


        public async Task<List<UserDTO>> GetAllAsync()
        {
            var list = await this._userRepository.GetAllAsync();
            return _mapper.Map<List<UserDTO>>(list);
        }

        public async Task<List<UserCompleteInformationDTO>> GetAllAsyncUserComplete()
        {
            var list = await this._userRepository.GetAllAsync();

            List<UserCompleteInformationDTO> listDto = list.ConvertAll(user => new UserCompleteInformationDTO
            {
                Id = user.Id.AsGuid(),
                Username = user.Username,
                Role = user.Role.Value.ToString(),
                Name = user.Name,
                phoneNumber = user.PhoneNumber,
                Email = user.Email,
            });

            return listDto;
        }

        public async Task<UserDTO> GetByIdAsync(UserId id)
        {
            var user = await this._userRepository.GetByIdAsync(id);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> AddAsync(CreatingUserDto dto)
        {
            var existingUser = await this._userRepository.FindByEmailAsync(new Email(dto.Email.Value));

            if (existingUser != null)
            {
                throw new BusinessRuleValidationException("Email já existe no sistema, por favor tente novamente com outro email.");
            }

            int sequentialNumber = await this._userRepository.GetNextSequentialNumberAsync();

            string domain = _configuration["DNS_DOMAIN"];
if (string.IsNullOrEmpty(domain))
{
    Console.WriteLine("DNS_DOMAIN não encontrado!");
    throw new BusinessRuleValidationException("O domínio DNS não está configurado corretamente.");
}
else
{
    Console.WriteLine($"DNS_DOMAIN encontrado: {domain}");
}


            int recruitmentYear = DateTime.Now.Year;
            var role = new Role(dto.Role.Value);
            var name = new Name(dto.FirstName, dto.LastName);
            var phoneNumber = new PhoneNumber(dto.phoneNumber.Number);

            var user = new User(role, new Email(dto.Email.Value), name, recruitmentYear, domain, sequentialNumber, phoneNumber);

            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return _mapper.Map<UserDTO>(user);
        }


        public async Task<UserCompleteInformationDTO> AddAsyncCompleteInformation(CreatingUserDto dto)
        {
            var existingUser = await this._userRepository.FindByEmailAsync(new Email(dto.Email.Value));

            if (existingUser != null)
            {
                throw new BusinessRuleValidationException("Email já existe no sistema, por favor tente novamente com outro email.");
            }

            int sequentialNumber = await this._userRepository.GetNextSequentialNumberAsync();

            string domain = _configuration["DNS_DOMAIN"];
if (string.IsNullOrEmpty(domain))
{
    Console.WriteLine("DNS_DOMAIN não encontrado!");
    throw new BusinessRuleValidationException("O domínio DNS não está configurado corretamente.");
}
else
{
    Console.WriteLine($"DNS_DOMAIN encontrado: {domain}");
}


            int recruitmentYear = DateTime.Now.Year;
            var role = new Role(dto.Role.Value);
            var name = new Name(dto.FirstName, dto.LastName);
            var phoneNumber = new PhoneNumber(dto.phoneNumber.Number);

            var user = new User(role, new Email(dto.Email.Value), name, recruitmentYear, domain, sequentialNumber, phoneNumber);

            await this._userRepository.AddAsync(user);
            await this._unitOfWork.CommitAsync();

            return new UserCompleteInformationDTO
            {
                Id = user.Id.AsGuid(),
                Username = user.Username,
                Role = user.Role.Value.ToString(),
                Name = user.Name,
                phoneNumber = user.PhoneNumber,
                Email = user.Email,
            };
        }


        public async Task<UserDTO> UpdateAsync(UserDTO dto)
        {
            var user = await this._userRepository.GetByIdAsync(new UserId(dto.Id));
            if (user == null) return null;

            user.ChangeRole(dto.Role);
            user.ChangeUsername(dto.Username);
            user.ChangeEmail(dto.Email);
            user.ChangeName(dto.Name);
            user.ChangeConfirmationToken(dto.ConfirmationToken);

            await this._unitOfWork.CommitAsync();
            Console.WriteLine("User updated");
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> DeleteAsync(UserId id)
        {
            var user = await this._userRepository.GetByIdAsync(id);
            if (user == null) return null;

            if (user.Active)
            {
                throw new BusinessRuleValidationException("Não é possível excluir um usuário ativo.");
            }

            this._userRepository.Remove(user);
            await this._unitOfWork.CommitAsync();

            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> DeleteFailureAsync(UserId id)
        {
            var user = await this._userRepository.GetByIdAsync(id);
            if (user == null) return null;

            this._userRepository.Remove(user);
            await this._unitOfWork.CommitAsync();

            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> FindByEmailAsync(string email)
        {
            var user = await this._userRepository.FindByEmailAsync(new Email(email));
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> FindByConfirmationTokenAsync(string token)
        {
            var user = await this._userRepository.GetUserByConfirmationTokenAsync(token);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO?> GetUserByUsernameAsync(string username)
        {
            var user = await this._userRepository.GetUserByUsernameAsync(new Username(username));
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> checkIfAccountExists(string email)
        {
            var user = await this._userRepository.FindByEmailAsync(new Email(email));
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }

    }
}
