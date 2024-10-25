using System;
using System.Linq;
using System.Threading.Tasks;
using DDDSample1.Domain;
using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

using DDDSample1.Users;
using Backend.Domain.Users.ValueObjects;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DDDSample1DbContext _context;

        public UserRepository(DDDSample1DbContext context) : base(context.Users)
        {
            _context = context;
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            var lastUser = await _context.Users
                .OrderByDescending(u => u.SequentialNumber)
                .FirstOrDefaultAsync();

            return lastUser != null ? lastUser.SequentialNumber + 1 : 1;
        }

        public async Task<User> FindByEmailAsync(Email email)
        {
            return await _context.Users .FirstOrDefaultAsync(u => u.Email.Equals(email));
        }

        public async Task<User> GetUserByConfirmationTokenAsync(string token)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.ConfirmationToken.Equals(token));
        }


        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public IQueryable<User> GetQueryable()
        {
            return _context.Users.AsQueryable();
        }

        public async Task<User> GetUserByUsernameAsync(Username username)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username.Equals(username));

            if (user == null)
            {
                throw new InvalidOperationException($"User with username '{username}' not found.");
            }

            return user;
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<List<User>> GetUsersMarkedForDeletionAsync()
        {
            return await _context.Users
                .Where(u => u.MarkedForDeletionDate.HasValue)
                .ToListAsync();
        }
    }
}
