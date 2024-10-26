using Backend.Domain.Users.ValueObjects;
using DDDSample1.Domain.OperationsType;


namespace DDDSample1.OperationsType
{
    public class CreatingOperationTypeDTO
    {

    public string Name { get; set; }
    public int Preparation { get; set; }
    public int Surgery { get; set; }
    public int Cleaning { get; set; }
    public int RequiredStaff { get; set; }
    public string speciality { get; set; }

    public CreatingOperationTypeDTO(string Name, int preparation, int surgery, int cleaning, int requiredStaff, string speciality)
{
    this.Name = Name;
    this.Preparation = preparation;
    this.Surgery = surgery;
    this.Cleaning = cleaning;
    this.RequiredStaff = requiredStaff;
    this.speciality = speciality;
}

    }
}
