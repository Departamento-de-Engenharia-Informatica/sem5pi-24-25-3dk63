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
        public List<int> RequiredStaff { get; set; }
        public List<string> Specialities { get; set; } // Alterado para lista de especializações

        // Construtor atualizado
        public CreatingOperationTypeDTO(string name, int preparation, int surgery, int cleaning, List<int> requiredStaff, List<string> specialities)
        {
            this.Name = name;
            this.Preparation = preparation;
            this.Surgery = surgery;
            this.Cleaning = cleaning;
            this.RequiredStaff = requiredStaff ?? new List<int>();
            this.Specialities = specialities ?? new List<string>(); // Garante que a lista não seja null
        }
    }
}
