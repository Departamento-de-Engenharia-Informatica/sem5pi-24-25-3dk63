import React from "react";
import PatientList from "./PatientList";

const AdminMenu: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Administração</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <PatientList />
      </div>

    </div>
  );
};

export default AdminMenu;
