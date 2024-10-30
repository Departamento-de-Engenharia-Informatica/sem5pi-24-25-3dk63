import React, { useEffect, useState } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { Patient } from "@/model/Patient";

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const patientService = useInjection<IPatientService>(TYPES.patientService);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsData = await patientService.getPatients();
      setPatients(patientsData);
    } catch (error) {
      setError("Erro ao buscar pacientes.");
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p className="text-gray-500">Carregando pacientes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-gray-600">ID</th>
            <th className="px-4 py-2 text-left text-gray-600">User ID</th>
            <th className="px-4 py-2 text-left text-gray-600">Data de Nascimento</th>
            <th className="px-4 py-2 text-left text-gray-600">Contato de Emergência</th>
            <th className="px-4 py-2 text-left text-gray-600">Sexo</th>
            <th className="px-4 py-2 text-left text-gray-600">Histórico Médico</th>
            <th className="px-4 py-2 text-left text-gray-600">Ativo</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id.value} className="hover:bg-gray-200 transition duration-200">
                <td className="px-4 py-3 border-b border-gray-300">{patient.id.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.userId.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.dateOfBirth.date}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.emergencyContact.emergencyContact}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.gender.gender}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.medicalHistory.medicalHistory}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.active.toString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
