using System;
using System.Collections.Generic;
using Xunit;
using Backend.Domain.Staff.ValueObjects;

namespace Backend.Tests.Domain.Tests.ValueObjects
{
    public class AvailabilitySlotsTests
    {
        [Fact]
        public void Constructor_ShouldInitializeEmptySlotsList_WhenNoParameterIsProvided()
        {
            var availabilitySlots = new AvailabilitySlots();
            Assert.Empty(availabilitySlots.Slots);
        }

        [Fact]
        public void Constructor_ShouldInitializeSlotsList_WhenSlotsParameterIsProvided()
        {
            var slot = new AvailabilitySlot(DateTime.Now, DateTime.Now.AddHours(1));
            var slots = new List<AvailabilitySlot> { slot };
            var availabilitySlots = new AvailabilitySlots(slots);
            Assert.Single(availabilitySlots.Slots);
        }

        [Fact]
        public void AddSlot_ShouldAddNewSlotToSlotsList()
        {
            var availabilitySlots = new AvailabilitySlots();
            var start = DateTime.Now;
            var end = start.AddHours(1);
            availabilitySlots.AddSlot(start, end);
            Assert.Single(availabilitySlots.Slots);
            Assert.Equal(start, availabilitySlots.Slots[0].Start);
            Assert.Equal(end, availabilitySlots.Slots[0].End);
        }

        [Fact]
        public void SerializeSlots_ShouldReturnValidJsonString()
        {
            var slot = new AvailabilitySlot(DateTime.Now, DateTime.Now.AddHours(1));
            var availabilitySlots = new AvailabilitySlots(new List<AvailabilitySlot> { slot });
            var json = availabilitySlots.SerializeSlots();
            Assert.NotNull(json);
            Assert.Contains("\"Start\":", json);
            Assert.Contains("\"End\":", json);
        }

        [Fact]
        public void DeserializeSlots_ShouldReturnCorrectAvailabilitySlotsObject()
        {
            var slot = new AvailabilitySlot(DateTime.Now, DateTime.Now.AddHours(1));
            var availabilitySlots = new AvailabilitySlots(new List<AvailabilitySlot> { slot });
            var json = availabilitySlots.SerializeSlots();
            var deserializedSlots = AvailabilitySlots.DeserializeSlots(json);
            Assert.Single(deserializedSlots.Slots);
            Assert.Equal(slot.Start, deserializedSlots.Slots[0].Start);
            Assert.Equal(slot.End, deserializedSlots.Slots[0].End);
        }

        [Fact]
        public void DeserializeSlots_ShouldReturnEmptyAvailabilitySlots_WhenJsonIsNull()
        {
            var deserializedSlots = AvailabilitySlots.DeserializeSlots("");
            Assert.Empty(deserializedSlots.Slots);
        }
    }
}
