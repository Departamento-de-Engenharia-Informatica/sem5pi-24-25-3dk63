using DDDSample1.Domain;
using DDDSample1.Domain.OperationsType;
using DDDSample1.Domain.Specialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infraestructure.OperationTypes
{
    public class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            // chave composta
            builder.HasKey(o => new { o.Id, o.Active });

            // Configura a propriedade Name (associada ao Value Object Name)
            builder.OwnsOne(o => o.Name, name =>
            {
                name.Property(n => n.Description)
                    .HasColumnName("Name")
                    .IsRequired();
            });

            builder.OwnsOne(o => o.Duration, duration =>
            {
                duration.Property(d => d.PreparationPhase)
                    .HasColumnName("PreparationPhaseDuration")
                    .IsRequired();

                duration.Property(d => d.SurgeryPhase)
                    .HasColumnName("SurgeryPhaseDuration")
                    .IsRequired();

                duration.Property(d => d.CleaningPhase)
                    .HasColumnName("CleaningPhaseDuration")
                    .IsRequired();

                duration.Property(d => d.TotalDuration)
                    .HasColumnName("TotalDuration")
                    .IsRequired();
            });  

            builder.OwnsOne(o => o.RequiredStaff, requiredStaff =>
            {
                requiredStaff.Property(rs => rs.RequiredNumber)
                    .HasColumnName("RequiredNumber")
                    .IsRequired();
            });

            builder.Property(s => s.SpecializationId)
                .HasColumnName("SpecializationId")
                .HasConversion(
                    specializationId => specializationId.AsString(),
                    specializationIdString => new SpecializationId(specializationIdString))
                .IsRequired();

            // Configura o campo Active
            builder.Property(o => o.Active)
                .IsRequired();

            // Define o nome da tabela no banco de dados (opcional)
            builder.ToTable("OperationTypes");
        }
    }
}
