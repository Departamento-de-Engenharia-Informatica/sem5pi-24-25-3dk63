import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
