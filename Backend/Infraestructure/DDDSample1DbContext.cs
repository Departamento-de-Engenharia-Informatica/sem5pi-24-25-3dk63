using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain;
using DDDSample1.Infraestructure.Users;
using DDDSample1.Infraestructure.OperationTypes;
using Backend.Infraestructure.SurgeryRoom;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infraestructure.Appointments;
using DDDSample1.Domain.Specialization;
using DDDSample1.Infrastructure.Staffs;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.Domain.Staff;
using DDDSample1.Infraestructure.Patients;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Infrastructure.PendingChangeStaff;
using DDDSample1.Infrastructure.PendingChange;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<OperationType> OperationsTypes { get; set; }
        public DbSet<SurgeryRoomEntity> SurgeryRooms { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<PendingChanges> PendingChanges { get; set; }
        public DbSet<PendingChangesStaff> PendingChangesStaff { get; set; }
        public DDDSample1DbContext(DbContextOptions<DDDSample1DbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PendingChangesEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PendingChangesStaffEntityTypeConfiguration());

        }
    }
}
