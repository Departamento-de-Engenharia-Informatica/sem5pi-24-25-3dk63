import React from "react";
import { useConfirmRegistrationModule } from "./module";
import Popup from "@/components/Popup";

const ConfirmRegistrationPage: React.FC = () => {
  const { confirmationStatus, loading, popupMessage, setPopupMessage } = useConfirmRegistrationModule();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen -mt-20"
      style={{ backgroundColor: "#e5fcff" }}
    >
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Confirm Profile Registration</h1>

        {loading ? (
          <p className="text-gray-700">Processing your request...</p>
        ) : (
          <p
            className={`text-gray-700 ${
              confirmationStatus.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {confirmationStatus}
          </p>
        )}
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

export default ConfirmRegistrationPage;