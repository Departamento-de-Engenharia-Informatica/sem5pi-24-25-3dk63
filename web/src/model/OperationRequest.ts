// src/model/OperationRequest.ts

export interface OperationRequest {
    id: string;
    deadline: {
      value: string;
    };
    priority: {
      value: "Elective" | "Urgent" | "Emergency";
    };
    licenseNumber: {
      value: string;
    };
    operationTypeId: {
      id: string;
    };
    medicalRecordNumber: {
      value: string;
    };
    createdDate: string;
    active: boolean;
  
  }
  