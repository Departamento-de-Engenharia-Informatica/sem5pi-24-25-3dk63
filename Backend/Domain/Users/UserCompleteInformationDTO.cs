using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;

namespace Backend.Domain.Users.ValueObjects
{
    public class UserCompleteInformationDTO
    {
        public Guid Id { get; set; }
        public Username Username { get; set; }
        public string Role { get; set; }
        public Email Email { get; set; }
        public Name Name { get; set; }
        public PhoneNumber phoneNumber { get; set; }
        public string ConfirmationToken { get; set; }
        public bool Active { get; set; }

    }
}