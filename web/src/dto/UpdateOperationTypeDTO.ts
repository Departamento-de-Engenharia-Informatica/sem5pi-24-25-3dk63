export interface UpdateOperationTypeDTO {
    Id: string;
    Name?: string;
    RequiredStaff?: number;
    Preparation?: number;
    Surgery?: number;
    Cleaning?: number;
    specialities?: string[];
}