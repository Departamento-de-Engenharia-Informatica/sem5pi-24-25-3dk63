using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class Gender : ValueObject
    {
        public string gender { get; private set; }

        public Gender(string gender)
        {
            if(string.IsNullOrWhiteSpace(gender))
            {
                throw new BusinessRuleValidationException("Gender cannot be empty or null.");
            }
            
            this.gender = gender;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return gender;
        }

        public override string ToString() => gender;

    }
}