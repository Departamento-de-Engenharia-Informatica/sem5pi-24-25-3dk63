import React from "react";
import { usePatientMenuModule } from "./module";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";

const PatientMenu: React.FC = () => {
  const {
    alertMessage,
    loading,
    isDeletionRequested,
    handleAppointments,
    handleMedicalRecords,
    handleAccountDeletionRequest,
  } = usePatientMenuModule();

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Paciente</h1>
      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <Button onClick={handleAppointments} name="appointments">
            Access Appointments
          </Button>
          <Button onClick={handleMedicalRecords} name="medical-records">
            View Medical Records
          </Button>
          <Button
            onClick={handleAccountDeletionRequest}
            name="delete-account"
            disabled={loading || isDeletionRequested}
            className={`bg-red-500 hover:bg-red-600 text-white ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Requesting..." : "Request Account Deletion"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientMenu;
