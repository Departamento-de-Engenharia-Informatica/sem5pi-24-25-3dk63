// src/model/OperationRequest.ts

export interface OperationRequest {
    id: string;
    deadline: {
      value: string;
    };
    patientName: {
      value: string;
    };
    assignedStaff: {
      id: string;
    };
    status: {
      active: boolean;
    };
    priority: {
      value: string;
    };
    operationType: {
      id: string;
    };
  
  }
  