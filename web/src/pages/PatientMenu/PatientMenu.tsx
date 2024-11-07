import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import { PatientService } from "@/service/patientService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

const PatientMenu: React.FC = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDeletionRequested, setIsDeletionRequested] = React.useState(false);
  const patientService = useInjection<PatientService>(TYPES.patientService);
    // Navigation handlers
  const handleCreatePatient = () => {
    navigate("/patient/register");
  };

  const handleAppointments = () => {
    navigate("/patient/appointments");
  };

  const handleMedicalRecords = () => {
    navigate("/patient/medical-record");
  };

  const handleAccountDeletionRequest = async () => {
    if (loading) return;
  
    setLoading(true);
    try {
      await patientService.requestAccountDeletion();
      setAlertMessage("Account deletion requested. Please check your email to confirm.");
      setIsDeletionRequested(true);
    } catch (error) {
      setAlertMessage("Failed to request account deletion.");
    } finally {
      setLoading(false);
    }
  };
  

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
          <Button onClick={handleCreatePatient} name="registar-paciente">
            Registar paciente
          </Button>
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
