using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, MedicalRecordNumber>
    {
        Task<bool> EmailExistsAsync(string email);
        Task<int> GetNextSequentialNumberAsync();
        Task<User> FindByEmailAsync(Email email);
        Task<bool> ExistsByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber);
        Task<Patient> FindByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber);
        Task UpdatePatientAsync(Patient patient);
        Task<Patient?> GetPatientByPersonalEmailAsync(Email personalEmail);
        void Remove(Patient patient);
        Task<Patient> FindByUserIdAsync(UserId id);
        IQueryable<Patient> GetQueryable();
        Task<List<Patient>> GetAllAsync();
        Task DeletePatientAsync(UserId id);

    }
}
