using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Domain.Staff.ValueObjects;

namespace Backend.Domain.Staff
{
    public class StaffCompleteDTO
    {
        public required string LicenseNumber { get; set; }

        public string Username { get; set; }

        public string Role { get; set; }

        public string Email { get; set; }
         public string PhoneNumber { get; set; }
        public string Name { get; set; }

        public string SpecializationDescription { get; set; }
        public List<AvailabilitySlot> AvailabilitySlots { get; set; }
        public bool Active { get; set; }
    }
}