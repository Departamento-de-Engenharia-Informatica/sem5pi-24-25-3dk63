
namespace Backend.Domain.OperationRequests
{
    public class ListOperationRequestDTO
    {
        public string PatientName { get; set; }
        public string OperationType { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime Deadline { get; set; }
        public string AssignedStaff { get; set; }
    }
}
