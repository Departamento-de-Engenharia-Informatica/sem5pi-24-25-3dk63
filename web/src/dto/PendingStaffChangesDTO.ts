export interface PendingStaffChangesDTO {
  Email: {
    value: string;
  };
  phoneNumber: {
    Number: string;
  };
  Specialization: string;
  AvailabilitySlots: {
    Slots: {
      Start: string;
      End: string;
    }[];
  };
}