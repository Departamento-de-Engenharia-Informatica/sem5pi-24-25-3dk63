import React from "react";
import PatientList from "./PatientList"; // Ajuste o caminho conforme necessário

const AdminMenu: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Administração</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <PatientList /> {/* O título "Gerenciar Pacientes" estará no PatientList */}
      </div>
      {/* Você pode adicionar mais seções de gerenciamento aqui */}
    </div>
  );
};

export default AdminMenu;
