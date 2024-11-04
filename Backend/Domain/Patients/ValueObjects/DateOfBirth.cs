using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class DateOfBirth : ValueObject
    {
        public DateTime date { get; private set; }

        public DateOfBirth(DateTime date)
        {
            if (date.Date > DateTime.Now.Date)
            {
                throw new ArgumentException("Date of birth cannot be in the future.");
            }

            this.date = date.Date;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return date;
        }

        public override string ToString()
        {
            return date.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
        }
    }
}
