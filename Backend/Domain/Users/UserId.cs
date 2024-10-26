using System;
using Newtonsoft.Json;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserId : EntityId
    {
        [JsonConstructor]
        public UserId(Guid value) : base(value) {}

        public UserId(string value) : base(new Guid(value)) {}

        protected override object createFromString(string text)
        {
            return new Guid(text);
        }

        public override string AsString()
        {
            return ((Guid)ObjValue).ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)ObjValue;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(this, obj)) return true;
            if (ReferenceEquals(obj, null) || GetType() != obj.GetType()) return false;

            var other = (UserId)obj;
            return AsGuid().Equals(other.AsGuid());
        }

        public override int GetHashCode()
        {
            return AsGuid().GetHashCode();
        }
    }
}
