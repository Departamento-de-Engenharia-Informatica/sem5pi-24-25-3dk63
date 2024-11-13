using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain;
using Backend.Domain.Users.ValueObjects;

namespace DDDSample1.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        Task<int> GetNextSequentialNumberAsync();
        Task<User> FindByEmailAsync(Email email);
        Task<User> FindByUsernameOrEmailAsync(Email email);
        Task<User> GetUserByConfirmationTokenAsync(string token);
        Task UpdateUserAsync(User user);
        Task<User> GetUserByUsernameAsync(Username username);
        IQueryable<User> GetQueryable();

        Task <List<User>> GetUsersMarkedForDeletionAsync();
        Task DeleteUserAsync(User user);
    }
}
