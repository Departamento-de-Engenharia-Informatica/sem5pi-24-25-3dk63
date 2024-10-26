using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class MedicalHistory : ValueObject
    {
        public string medicalHistory { get; private set; }

        public MedicalHistory(string medicalHistory)
        {
            this.medicalHistory = medicalHistory;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return medicalHistory;
        }

        public override string ToString() => medicalHistory;
    }
}