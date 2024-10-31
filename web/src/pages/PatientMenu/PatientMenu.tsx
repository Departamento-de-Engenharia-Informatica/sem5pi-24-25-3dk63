import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";

const PatientMenu: React.FC = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);

  const handleCreatePatient = () => {
    navigate("/patient/register");
  };

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen"> {/* Adicionado pt-20 */}
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
        </div>
      </div>
    </div>
  );
};

export default PatientMenu;
