using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.PendingChange
{
    public class PendingChangesEntityTypeConfiguration : IEntityTypeConfiguration<PendingChanges>
    {
        public void Configure(EntityTypeBuilder<PendingChanges> builder)
        {
            builder.HasKey(pc => pc.UserId);

            builder.Property(pc => pc.UserId)
                .HasColumnName("UserId")
                .HasConversion(
                    userId => userId.AsString(),
                    userIdString => new UserId(userIdString))
                .IsRequired();

            builder.HasIndex(pc => pc.UserId).IsUnique();

            builder.Property(u => u.Email)
                .HasConversion(
                    email => email.ToString(),
                    emailString => new Email(emailString));

            builder.OwnsOne(u => u.Name, name =>
            {
                name.Property(n => n.FirstName)
                    .HasColumnName("FirstName");

                name.Property(n => n.LastName)
                    .HasColumnName("LastName");

                name.Ignore(n => n.FullName);
            });

            builder.OwnsOne(u => u.PhoneNumber, pn =>
            {
                pn.Property(p => p.Number)
                  .HasColumnName("PhoneNumber")
                  .IsUnicode();
            });

            builder.OwnsOne(p => p.EmergencyContact, contact =>
            {
                contact.Property(c => c.emergencyContact)
                       .HasColumnName("EmergencyContactName");
            });

            builder.OwnsOne(p => p.MedicalHistory, contact =>
            {
                contact.Property(c => c.medicalHistory)
                       .HasColumnName("MedicalHistory");
            });
        }
    }
}
