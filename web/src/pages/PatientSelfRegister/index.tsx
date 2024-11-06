import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import HamburgerMenu from "@/components/HamburgerMenu";

import { usePatientSelfRegisterModule } from "./module";

const PatientSelfRegister: React.FC = () => {
  const {
    handleSelfRegister,
    menuOptions,
    alertMessage,
  } = usePatientSelfRegisterModule();

  return (
    <div className="relative pt-20 p-8 bg-gray-50 min-h-screen">
      <div className="fixed top-1 left-4 z-10">
        <HamburgerMenu options={menuOptions} />
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Self-Register</h1>
      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <Button onClick={handleSelfRegister} name="self-register-patient">
            Self Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientSelfRegister;
