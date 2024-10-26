using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class AppointmentHistory : ValueObject
    {
        public DateTime appointmentDate { get; private set; }
        public string doctorName { get; private set; }

        public AppointmentHistory(DateTime appointmentDate, string doctorName)
        {
            if (appointmentDate > DateTime.Now)
            {
                throw new BusinessRuleValidationException("Appointment Date cannot be in the future.");
            }

            if (string.IsNullOrWhiteSpace(doctorName))
            {
                throw new BusinessRuleValidationException("Doctor Name can't be null or empty.");
            }

            this.appointmentDate = appointmentDate;
            this.doctorName = doctorName;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return appointmentDate;
            yield return doctorName;
        }

        public override string ToString() => appointmentDate.ToString("yyyy-MM-dd") + " - " + doctorName;
    }
}