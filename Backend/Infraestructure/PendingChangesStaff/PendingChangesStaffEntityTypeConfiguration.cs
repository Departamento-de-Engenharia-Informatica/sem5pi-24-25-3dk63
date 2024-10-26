using Backend.Domain.Staff.ValueObjects;
using DDDSample1.Domain.PendingChange;
using DDDSample1.Domain.PendingChangeStaff;
using DDDSample1.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.PendingChange
{
    public class PendingChangesStaffEntityTypeConfiguration : IEntityTypeConfiguration<PendingChangesStaff>
    {
        public void Configure(EntityTypeBuilder<PendingChangesStaff> builder)
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
                    emailString => new Email(emailString))
                .IsRequired();


            builder.OwnsOne(u => u.PhoneNumber, pn =>
            {
                pn.Property(p => p.Number)
                  .HasColumnName("PhoneNumber")
                  .IsRequired()
                  .IsUnicode();
            });

                
            builder.Property(u => u.Specialization)
                .HasColumnName("Specialization")
                .IsRequired()
                .IsUnicode();

        }
    }
}
