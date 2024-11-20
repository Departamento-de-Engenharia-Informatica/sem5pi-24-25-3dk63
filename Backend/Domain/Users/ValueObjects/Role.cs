using DDDSample1.Domain.Shared;
using System.Collections.Generic;

namespace DDDSample1.Domain.Users
{
    public enum RoleType
    {
        Admin,
        Doctor,
        Nurse,
        Technician,
        Patient,
        Assistant
    }

    public class Role : ValueObject
    {
        public RoleType Value { get; private set; }

        public Role(RoleType value)
        {
            this.Value = value;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }

        public override string ToString() => Value.ToString();
    }

    public static class Roles
    {
        public static Role Admin => new Role(RoleType.Admin);
        public static Role Doctor => new Role(RoleType.Doctor);
        public static Role Nurse => new Role(RoleType.Nurse);
        public static Role Technician => new Role(RoleType.Technician);
        public static Role Patient => new Role(RoleType.Patient);
        public static Role Assistant => new Role(RoleType.Assistant);
    }
}
