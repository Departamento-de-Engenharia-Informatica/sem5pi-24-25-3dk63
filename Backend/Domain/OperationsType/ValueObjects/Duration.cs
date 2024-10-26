using System.Data;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationsType
{
    public class Duration : ValueObject
    {
        public int PreparationPhase { get; private set; }
        public int SurgeryPhase { get; private set; }
        public int CleaningPhase { get; private set; }
        public int TotalDuration { get; private set; }

        public Duration(int preparationPhase, int surgeryPhase, int cleaningPhase)
        {
            TotalDuration =0;
            if (preparationPhase <= 0 || surgeryPhase <= 0 || cleaningPhase <= 0)
            {
                throw new BusinessRuleValidationException("All durations must be provided and bigger than 0.");
            }

            PreparationPhase = preparationPhase;
            SurgeryPhase = surgeryPhase;
            CleaningPhase = cleaningPhase;
            TotalDuration = preparationPhase + surgeryPhase + cleaningPhase;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return PreparationPhase;
            yield return SurgeryPhase;
            yield return CleaningPhase;
            yield return TotalDuration;
        }

        public override string ToString()
        {
            return $"Total operation time: {this.TotalDuration}\n Anesthesia: {this.PreparationPhase}, Surgery: {this.SurgeryPhase}, Cleaning: {this.CleaningPhase}";
        }
    }
}
