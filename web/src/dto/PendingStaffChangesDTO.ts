export interface PendingStaffChangesDTO {
  email: string;
  phoneNumber: string;
  specializationDescription: string;
  availabilitySlots: {
    start: string;
    end: string;
  }[];
}