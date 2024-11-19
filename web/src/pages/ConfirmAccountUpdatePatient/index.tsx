import React from "react";
import { useConfirmUpdateModule } from "./module";

const ConfirmUpdatePage: React.FC = () => {
  const { confirmationStatus } = useConfirmUpdateModule();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20" style={{ backgroundColor: "#e5fcff" }}>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-500">Profile Update Confirmation</h1>

        <p
          className={`text-gray-700 ${confirmationStatus.startsWith("Error") ? "text-red-500" : "text-green-500"}`}
        >
          {confirmationStatus}
        </p>
      </div>
    </div>
  );
};

export default ConfirmUpdatePage;
