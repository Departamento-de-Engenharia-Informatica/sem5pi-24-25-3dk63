using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class MedicalHistory : ValueObject
    {
        public string medicalHistory { get; private set; }

        public MedicalHistory(string medicalHistory)
        {
            if (string.IsNullOrWhiteSpace(medicalHistory))
            {
                throw new BusinessRuleValidationException("Medical history cannot be empty or null.");
            }

            this.medicalHistory = medicalHistory;
 
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return medicalHistory;
        }

        public override string ToString() => medicalHistory;
    }
}