import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@/components/Alert/index";
import { useProfileUpdateModule } from "./module";

const ConfirmAccountUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { isUpdated, loading, error } = useProfileUpdateModule(token);

  return (
    <div className="relative pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm Data Update</h1>

      {loading && <div className="text-center text-gray-500">Processing...</div>}
      {error && <Alert type="error" message={error} />}
      {isUpdated && !loading && !error && (
        <div className="text-center text-green-500 font-semibold">
          Your data has been successfully updataded.
        </div>
      )}

      {!isUpdated && !loading && !error && (
        <div className="text-center text-yellow-500">
          Your data update is in progress. Please wait...
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ConfirmAccountUpdate;
