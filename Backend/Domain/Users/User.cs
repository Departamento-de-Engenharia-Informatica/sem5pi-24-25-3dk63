using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;

using DDDSample1.Domain.PendingChange;

namespace DDDSample1.Domain
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public Username Username { get; private set; }
        public Role Role { get; private set; }
        public Email Email { get; private set; }
        public Name Name { get; private set; }
        public PhoneNumber PhoneNumber { get; private set; }
        public bool Active { get; private set; }
        public int SequentialNumber { get; private set; }
        public string ConfirmationToken { get; set; }
        public DateTime? MarkedForDeletionDate { get; private set; }

        private User()
        {
            this.Active = true;
        }

        public User(Role role, Email email, Name name, int recruitmentYear, string domain, int sequentialNumber, PhoneNumber phoneNumber)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.Active = true;
            this.Email = email;
            this.Role = role;
            this.Name = name;
            this.PhoneNumber = phoneNumber;
            this.SequentialNumber = sequentialNumber;
            this.Username = GenerateUsername(role.Value, recruitmentYear, domain, sequentialNumber);
            this.ConfirmationToken = "";
        }


        private Username GenerateUsername(RoleType roleType, int recruitmentYear, string domain, int sequentialNumber)
        {
            string prefix;

            switch (roleType)
            {
                case RoleType.Doctor:
                    prefix = "D";
                    break;
                case RoleType.Nurse:
                    prefix = "N";
                    break;
                case RoleType.Technician:
                case RoleType.Admin:
                case RoleType.Patient:
                    prefix = "O";
                    break;
                default:
                    throw new ArgumentException("RoleType inválido.");
            }

            // Formato: (Prefixo)AnoSequencial -> Ex: D202400001
            string username = $"{prefix}{recruitmentYear}{sequentialNumber:D5}@{domain}"; // Adiciona o domínio

            return new Username(username);
        }

        public void ChangeActiveTrue()
        {
            this.Active = true;
        }

        public void ChangephoneNumber(PhoneNumber phoneNumber)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.PhoneNumber = phoneNumber;
        }
        public void ChangeActiveFalse()
        {
            this.Active = false;
        }


        public void ChangeRole(Role role)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Role = role;
        }

        public void ChangeUsername(Username username)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Username = username;
        }

        public void ChangeEmail(Email email)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Email = email;
        }

        public void ChangeName(Name name)
        {
            if (!this.Active) throw new BusinessRuleValidationException("User cannot be changed in this state");
            this.Name = name;
        }

        public void ChangeConfirmationToken(string confirmationToken)
        {
            this.ConfirmationToken = confirmationToken;
        }

        public void generateConfirmationToken()
        {
            this.ConfirmationToken = Guid.NewGuid().ToString("N");
        }

        public void ApplyChanges(PendingChanges pendingChange)
        {
            if (pendingChange == null) throw new ArgumentNullException(nameof(pendingChange));

            if (pendingChange.Email != null && !string.IsNullOrEmpty(pendingChange.Email.Value))
            {
                this.Email = new Email(pendingChange.Email.Value);
            }

            if (pendingChange.Name != null)
            {
                this.Name = new Name(pendingChange.Name.FirstName, pendingChange.Name.LastName);
            }

            if (pendingChange.PhoneNumber != null && !string.IsNullOrEmpty(pendingChange.PhoneNumber.ToString()))
            {
                this.PhoneNumber = new PhoneNumber(pendingChange.PhoneNumber.Number);
            }
        }

        public void MarkForDeletion()
        {
            this.MarkedForDeletionDate = DateTime.UtcNow.AddDays(30);
        }

        public void Anonymize()
        {
            string unique = Guid.NewGuid().ToString("N").Substring(0, 8);

            this.Username = new Username($"anonymous_{unique}");
            this.Email = new Email($"anonymous_{unique}@example.com");
            this.Name = new Name("Anonymous", "User");
            string anonymizedPhoneNumber = $"+0000000{unique.Substring(0, 6)}";
            this.PhoneNumber = new PhoneNumber(anonymizedPhoneNumber);

            this.ConfirmationToken = null;
        
    }
    }
}
