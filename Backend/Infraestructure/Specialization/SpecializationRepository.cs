using Backend.Domain.Specialization.ValueObjects;
using DDDSample1.Domain.Specialization;
using DDDSample1.Domain.Staff;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace DDDSample1.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        private readonly DDDSample1DbContext _context;

        public SpecializationRepository(DDDSample1DbContext context) : base(context.Specializations)
        {
            _context = context;
        }

        public async Task<Specialization> FindByIdAsync(SpecializationId specializationId)
        {
            return await _context.Specializations
                .FirstOrDefaultAsync(s => s.Id.Equals(specializationId));
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            var lastSpecialization = await _context.Specializations
                .OrderByDescending(s => s.SequentialNumber)
                .FirstOrDefaultAsync();

            return lastSpecialization != null ? lastSpecialization.SequentialNumber + 1 : 1;
        }

        public async Task<Specialization?> GetByDescriptionAsync(Description description)
        {
            return await _context.Specializations
        .SingleOrDefaultAsync(s => s.Description.Value == description.Value);

        }

        public IQueryable<Specialization> GetQueryable()
        {
            return _context.Specializations.AsQueryable();
        }

    }
}
