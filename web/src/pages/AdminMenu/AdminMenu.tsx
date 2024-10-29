import React from "react";
import PatientList from "./PatientList"; // Certifique-se de que este componente seja importado corretamente

function AdminMenu() {
  const [activeTab, setActiveTab] = React.useState("patients");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">Administração</h2>
      <ul className="space-y-2">
        <li
          className={`cursor-pointer py-2 px-4 rounded-lg transition duration-200 ${
            activeTab === "patients" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => handleTabChange("patients")}
        >
          Gerenciar Pacientes
        </li>
        <li
          className={`cursor-pointer py-2 px-4 rounded-lg transition duration-200 ${
            activeTab === "staff" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => handleTabChange("staff")}
        >
          Gerenciar Funcionários
        </li>
      </ul>

      <div className="mt-4 flex-grow bg-gray-50 rounded-lg p-4">
        {activeTab === "patients" && <PatientList />}
        {/* Aqui você pode adicionar o componente para Gerenciar Funcionários quando implementado */}
      </div>
    </div>
  );
}

export default AdminMenu;
