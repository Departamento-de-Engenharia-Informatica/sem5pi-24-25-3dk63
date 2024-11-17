import { Specialization } from "@/model/Specialization";

export interface ISpecializationService {
  getSpecializations(): Promise<Specialization[]>;
  getSpecializationById(id: string): Promise<Specialization>;
}
