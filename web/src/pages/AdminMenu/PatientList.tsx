import React, { useEffect, useState } from "react";
import {
  getAllPatients,
  deletePatientProfile,
  updatePatientProfile,
} from "@/service/patientService"; // Ajuste o caminho conforme necessário

interface IPatient {
  id: {
    value: string;
  };
  dateOfBirth: {
    date: string;
  };
  emergencyContact: {
    emergencyContact: string;
  };
  gender: {
    gender: string;
  };
  medicalHistory: {
    medicalHistory: string;
  };
  userId: {
    value: string;
  };
  active: boolean;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsData = await getAllPatients();
      console.log("Pacientes carregados:", patientsData);
      setPatients(patientsData);
    } catch (error) {
      setError("Erro ao buscar pacientes.");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatientProfile(id);
      fetchPatients();
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
    }
  };

  const handleEdit = (patient: IPatient) => {
    setSelectedPatient(patient);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setSelectedPatient(null);
    setIsEditing(false);
    fetchPatients();
  };

  return (
    <div>
      {loading && <p className="text-gray-500">Carregando pacientes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-gray-600">ID do Paciente</th>
            <th className="px-4 py-2 text-left text-gray-600">Data de Nascimento</th>
            <th className="px-4 py-2 text-left text-gray-600">Contato de Emergência</th>
            <th className="px-4 py-2 text-left text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (
            patients.map((patient, index) => (
              <tr key={index} className="hover:bg-gray-200 transition duration-200">
                <td className="px-4 py-3 border-b border-gray-300">{patient.id.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.dateOfBirth.date}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.emergencyContact.emergencyContact}</td>
                <td className="px-4 py-3 border-b border-gray-300 flex space-x-2">
                  <button
                    className="text-blue-600 hover:underline transition duration-200"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    Ver
                  </button>
                  <button
                    className="text-yellow-600 hover:underline transition duration-200"
                    onClick={() => handleEdit(patient)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline transition duration-200"
                    onClick={() => handleDelete(patient.id.value)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
