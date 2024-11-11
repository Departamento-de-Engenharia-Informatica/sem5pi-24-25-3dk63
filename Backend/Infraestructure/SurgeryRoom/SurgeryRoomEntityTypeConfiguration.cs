using System;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.SurgeryRooms.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infraestructure.SurgeryRoom
{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoomEntity>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoomEntity> builder)
        {
            builder.HasKey(sr => sr.Id);

            builder.Property(sr => sr.RoomNumber)
                .HasConversion(
                    roomNumber => roomNumber.ToString(),
                    roomNumberString => new RoomNumber(roomNumberString))
                .IsRequired();

            builder.HasIndex(sr => sr.RoomNumber)
                .IsUnique();

            builder.Property(sr => sr.Type)
                .HasConversion(
                    type => type.Type.ToString(),
                    typeString => new RoomType(Enum.Parse<RoomType.RoomTypeEnum>(typeString)))
                .IsRequired();

            builder.Property(sr => sr.Capacity)
                .HasConversion(
                    capacity => capacity.Value,
                    value => new Capacity(value))
                .IsRequired();

            builder.Property(sr => sr.CurrentStatus)
                .HasConversion(
                    status => status.Value.ToString(),
                    statusString => new RoomStatus(Enum.Parse<RoomStatusEnum>(statusString)))
                .IsRequired();

            builder.OwnsMany(sr => sr.AssignedEquipment, equipment =>
            {
                equipment.Property(e => e.Name)
                    .HasColumnName("EquipmentName")
                    .IsRequired();

                equipment.Property(e => e.Type)
                    .HasColumnName("EquipmentType")
                    .IsRequired();

                equipment.Property(e => e.IsOperational)
                    .IsRequired();
            });

            builder.OwnsMany(sr => sr.MaintenanceSlots, slot =>
            {
                slot.Property(ms => ms.StartTime)
                    .HasColumnName("MaintenanceStartTime")
                    .IsRequired();

                slot.Property(ms => ms.EndTime)
                    .HasColumnName("MaintenanceEndTime")
                    .IsRequired();
            });
        }

    }
}
