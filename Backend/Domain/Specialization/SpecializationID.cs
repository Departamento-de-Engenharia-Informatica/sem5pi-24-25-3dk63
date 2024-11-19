using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Specialization
{
    public class SpecializationId : EntityId
    {

        
        [JsonConstructor]
        public SpecializationId(Guid value) : base(value) {}

        public SpecializationId(string value) : base(value) {}

        public SpecializationId(object value) : base(value)
        {
        }

        protected override object createFromString(string text)
        {
            return new Guid(text);
        }

        public override string AsString()
        {
            return base.ObjValue?.ToString();
        }

        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }

        public override bool Equals(object obj)
        {
            return obj is SpecializationId && ((SpecializationId)obj).AsGuid().Equals(this.AsGuid());
        }

        public override int GetHashCode()
        {
            return AsGuid().GetHashCode();
        }
    }
}
