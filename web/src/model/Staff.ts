import { AvailabilitySlots } from "./AvailabilitySlots";

export interface Staff {
    id: string;
    userId: string;
    specializationId: string;
    availabilitySlots: AvailabilitySlots;
    active: boolean;
  }
  