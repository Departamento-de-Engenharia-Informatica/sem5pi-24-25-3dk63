import React, { useState } from "react";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import HamburgerMenu from "@/components/HamburgerMenu";
import Popup from "@/components/Popup";
import SidebarMenu from "@/components/SidebarMenu";
import { usePatientSelfRegisterModule } from "./module";

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

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-gray-50 dark:bg-gray-900 border-none">
      {/* Sidebar */}
      <div
        className={`lg:w-64 w-full transition-transform duration-300 ease-in-out transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 dark:bg-gray-800`}
      >
        <SidebarMenu options={menuOptions} title="Registration Panel" />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16 pb-10 px-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto border-none">
        {/* Hamburger Menu */}
        <div className="lg:hidden mb-4">
          <div onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
            <HamburgerMenu options={menuOptions} />
          </div>
        </div>

        <h1 className="text-4xl font-semibold text-center text-blue-800 dark:text-blue-400 mb-8">
          Self-Register
        </h1>

        {alertMessage && (
          <div
            className="flex items-center justify-center fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-700 p-3 rounded-lg shadow-md max-w-md w-full"
            role="info"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5 mr-2 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="font-medium">{alertMessage}</span>
          </div>
        )}



        {/* Form Section */}
        <div className="bg-white dark:bg-gray-700 shadow-2xl rounded-lg p-8 max-w-lg mx-auto border border-gray-200 dark:border-gray-600">
          <form onSubmit={handleSelfRegister} className="space-y-8">
            {/* Personal Email */}
            <div>
            <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Personal Email</label>
            <input
              type="email"
              value={selfRegisteringPatient?.personalEmail || ""}
              onChange={(e) =>
                setSelfRegisteringPatient({
                  ...selfRegisteringPatient,
                  personalEmail: e.target.value,
                })
              }
              placeholder="Enter personal email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                onClick={saveSelfRegisterPatient}
                name="self-register-patient"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Self Register
              </Button>
            </div>
          </form>
        </div>

        {/* Popup */}
        <Popup
          isVisible={!!popupMessage}
          setIsVisible={() => setPopupMessage(null)}
          message={popupMessage}
        />
      </div>
    </div>
  );
};

export default PatientSelfRegister;
