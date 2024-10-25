
using Backend.Domain.Users.ValueObjects;

namespace DDDSample1.Domain.Users
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public Username Username { get; set; }
        public Role Role { get; set; }
        public Email Email { get; set; }
        public Name Name { get; set; }
        public PhoneNumber phoneNumber { get; set; }
        public string ConfirmationToken { get; set; }
        public bool Active { get; set; }
    }
}
