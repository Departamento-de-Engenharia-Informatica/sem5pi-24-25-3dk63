import React from "react";
import { usePatientSelfRegisterModule } from "./module";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import HamburgerMenu from "@/components/HamburgerMenu";
import Popup from "@/components/Popup";

const PatientSelfRegister: React.FC = () => {
  const {
    selfRegisteringPatient,
    setSelfRegisteringPatient,
    handleSelfRegister,
    saveSelfRegisterPatient,
    menuOptions,
    alertMessage,
    popupMessage,
    setPopupMessage,
  } = usePatientSelfRegisterModule();

  return (
    <div className="relative pt-20 p-8 bg-gray-50 min-h-screen">
      <div className="fixed top-1 left-4 z-10">
        <HamburgerMenu options={menuOptions} onClick={() => { /* handle click */ }} />
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Self-Register</h1>

      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <form onSubmit={handleSelfRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold mb-2"> Personal Email </label>
            <input
              type="email"
              value={selfRegisteringPatient?.personalEmail || ""}
              onChange={(e) =>
                setSelfRegisteringPatient({
                  ...selfRegisteringPatient,
                  personalEmail: e.target.value,
                })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              style={{
                backgroundColor: 'transparent',
              }}
            />
          </div>

          <div className="pt-4">
            <Button onClick={saveSelfRegisterPatient} name="self-register-patient">
              Self Register
            </Button>
          </div>
        </form>
      </div>

      {/* Added: Popup for displaying messages */}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />
    </div>
  );
};

export default PatientSelfRegister;
