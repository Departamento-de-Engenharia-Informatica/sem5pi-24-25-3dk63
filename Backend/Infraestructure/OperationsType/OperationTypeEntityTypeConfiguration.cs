using System.Text.Json;
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
            // Configuração da chave composta
            builder.HasKey(o => new { o.Id, o.Active });

            // Configura a propriedade Name (Value Object)
            builder.OwnsOne(o => o.Name, name =>
            {
                name.Property(n => n.Description)
                    .HasColumnName("Name")
                    .IsRequired();
            });

            // Configura as propriedades Duration (Value Object)
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

            builder.Property(o => o.RequiredStaff)
                    .HasConversion(
                        rs => JsonSerializer.Serialize(rs, new JsonSerializerOptions { WriteIndented = false }),
                        rs => JsonSerializer.Deserialize<List<RequiredStaff>>(rs, new JsonSerializerOptions()) ?? new List<RequiredStaff>()
                    )
                    .HasColumnName("RequiredStaffs")
                    .IsRequired(false);

            
            // Configura a propriedade Active
            builder.Property(o => o.Active)
                .IsRequired();
                 builder.Property(o => o.Specializations)
                .HasColumnName("Specializations")
                .IsRequired(false); // Caso seja opcional, ajuste conforme necessário

            // Define o nome da tabela no banco de dados
            builder.ToTable("OperationTypes");
        }
    }
}
