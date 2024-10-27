using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Appointments;


namespace DDDSample1.Domain
{

    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        public Date date { get; private set; }
        public Time time { get; private set; }
        public OperationRequestId operationRequestId { get; private set; }
        public int roomNumber { get; private set; }
        public bool Active { get; private set; }

    public Appointment()
    {
        this.Active = true;
    }

    public Appointment(OperationRequestId operationRequestId, Date date, Time time, int roomNumber){
        this.Id = new AppointmentId(Guid.NewGuid());
        this.Active = true;
        this.date =  date;
        this.time = time;
        this.roomNumber = roomNumber;
        this.operationRequestId = operationRequestId;

    }

    public void ChangeDate(Date date)
    {
        if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
        this.date = date;
    }

    public void ChangeTime(Time time)
    {
        if (!this.Active) throw new BusinessRuleValidationException("Operation request cannot be changed in this state");
        this.time = time;
    }

    public void ChangeActiveTrue()
    {
        this.Active = true;
    }

    public void ChangeActiveFalse()
    {
        this.Active = false;
    }
}
}

    

