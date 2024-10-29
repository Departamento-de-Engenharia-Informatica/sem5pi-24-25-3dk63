using DDDSample1.Domain;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Users;
using System.Collections.Generic;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, MedicalRecordNumber>, IPatientRepository
    {
        private readonly ILogger<PatientRepository> _logger;

        private readonly DDDSample1DbContext _context;

        public PatientRepository(ILogger<PatientRepository> logger,DDDSample1DbContext context) : base(context.Patients)
        {
            _context = context;
            _logger = logger;
        }


        public async Task<bool> EmailExistsAsync(string email)
        {
            // Check for existence in the Users table
            return await _context.Users.AnyAsync(u => u.Email.Equals(email));
        }

        public async Task<int> GetNextSequentialNumberAsync()
        {
            var lastPatient = await _context.Patients
                .OrderByDescending(p => p.sequentialNumber)
                .FirstOrDefaultAsync();

            return lastPatient != null ? lastPatient.sequentialNumber + 1 : 1;
        }

        public async Task<User> FindByEmailAsync(Email email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        }

        public async Task<bool> ExistsByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber)
        {
            return await _context.Patients
                .AnyAsync(p => p.Id == medicalRecordNumber);
        }

        public async Task<Patient> FindByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber)
        {
            var idValue = medicalRecordNumber.Value;

            // Puxa todos os pacientes de forma assíncrona e filtra na memória
            var patients = await _context.Patients.ToListAsync();

            return patients.FirstOrDefault(p => p.Id.Value.Trim() == idValue.Trim());
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
        }

        public async Task<Patient?> GetPatientByPersonalEmailAsync(Email personalEmail)
        {
            var result = await (
                from Patient in _context.Patients
                join User in _context.Users on Patient.UserId equals User.Id
                where User.Email.Equals(personalEmail)
                select Patient
                ).FirstOrDefaultAsync();

            return result ?? null;
        }

        public async Task<Patient> FindByUserIdAsync(UserId id)
        {
            return await _context.Patients.FirstOrDefaultAsync(p => p.UserId == id);
        }

        public async Task DeletePatientAsync (UserId id)
        {
            var patient = await FindByUserIdAsync(id);

            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
            }
        }

        public IQueryable<Patient> GetQueryable()
        {
            return _context.Patients.AsQueryable();
        }

    }
}
