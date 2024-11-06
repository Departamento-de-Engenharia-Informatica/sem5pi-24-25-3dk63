import { Specialization } from "@/model/Specialization";

export interface ISpecializationService {
  getSpecializations(): Promise<Specialization[]>;
}
