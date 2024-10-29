import React, { useEffect, useState } from "react";
import { Patient as ImportedPatient } from "@/model/Patient";
import { HttpService } from "@/service/IService/HttpService";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

interface IPatient {
  id: {
    _value: string;
  };
}

const PatientList: React.FC = () => {
  const http = useInjection<HttpService>(TYPES.api);
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
      const res = await http.get<IPatient[]>("/api/patients");
      if (res.status === 200) {
        console.log("Pacientes carregados:", res.data);
        setPatients(res.data);
      } else {
        setError(`Erro: ${res.statusText}`);
      }
    } catch (error) {
      setError("Erro ao buscar pacientes.");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await http.delete(`/api/patients/${id}`);
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
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
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-bold mb-4">Gerenciar Pacientes</h3>
      {loading && <p className="text-gray-500">Carregando pacientes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-gray-600">ID do Paciente</th>
            <th className="px-4 py-2 text-left text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={2} className="text-center p-4 text-gray-500">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (
            patients.map((patient, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{patient.id._value}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    Ver
                  </button>
                  <button
                    className="text-yellow-500 hover:underline mr-2"
                    onClick={() => handleEdit(patient)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(patient.id._value)}
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
