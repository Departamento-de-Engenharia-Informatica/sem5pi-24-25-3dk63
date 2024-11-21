import { AvailabilitySlot } from "@/model/AvailabilitySlots";

export interface CreatingStaffDTO {
    licenseNumber: string;
    specializationDescription: string;
    email: string;
    role: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    availabilitySlots?: AvailabilitySlot[];
  }