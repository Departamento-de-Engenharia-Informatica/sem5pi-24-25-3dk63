using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public class Deadline : ValueObject
{
    public DateTime Value { get; private set; }

    public Deadline(DateTime value)
    {
        if (value < DateTime.Now)
            throw new BusinessRuleValidationException("Deadline cannot be null or in the past");

        this.Value = value;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value.ToString();
}
}