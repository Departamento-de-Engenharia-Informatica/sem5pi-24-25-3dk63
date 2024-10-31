import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";

const AdminMenu: React.FC = () => {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = React.useState<string | null>(null);

  const handleManagePatients = () => {
    navigate("/admin/patients");
  };

  const handleManageStaff = () => {
    setAlertMessage("Gerenciar Staff em desenvolvimento!");
  };

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen"> {/* Adicionado pt-20 */}
      <h1 className="text-3xl font-bold text-center mb-6">Administração</h1>
      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <Button onClick={handleManagePatients} name="gerenciar-pacientes">
            Gerenciar Pacientes
          </Button>
          <Button onClick={handleManageStaff} name="gerenciar-staff">
            Gerenciar Staff
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
