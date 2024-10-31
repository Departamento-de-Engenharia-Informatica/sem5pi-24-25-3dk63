import React, { useEffect, useState } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { PatientUser } from "@/model/PatientUser"; // Importando PatientUser
import Loading from "@/components/Loading/index";
import Pagination from "@/components/Pagination/index";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import Checkbox from "@/components/Checkbox/index";
import InputGroup from "@/components/InputGroup/index";
import EditPatientModal from "@/components/Modal/EditPatientModal";
import { PatientUpdateDTO } from "@/dto/PatientUpdateDTO";
import { Patient } from "@/model/Patient";

interface PatientListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PatientList: React.FC<PatientListProps> = ({ setAlertMessage }) => {
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientUser | null>(null);

  const patientService = useInjection<IPatientService>(TYPES.patientService);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const start = (page - 1) * 10;
    const end = start + 10;
    setFilteredPatients(
      patients
        .filter((patient) =>
          patient.id.value.includes(searchTerm) ||
          patient.userId.value.includes(searchTerm) ||
          (patient.emergencyContact && patient.emergencyContact.emergencyContact.includes(searchTerm))
        )
        .slice(start, end)
    );
  }, [patients, page, searchTerm]);

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

  const togglePatientSelection = (id: string) => {
    setSelectedPatients((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleDeleteSelected = async () => {
    setLoading(true);
    setError(null);
    try {
      for (const patientId of selectedPatients) {
        // await patientService.deletePatient(patientId);
      }
      setAlertMessage("Pacientes selecionados excluídos com sucesso.");
      fetchPatients();
    } catch (error) {
      setError("Erro ao excluir pacientes.");
      console.error("Erro ao excluir pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = (patient: PatientUser) => {
    setSelectedPatient(patient);
    setEditModalVisible(true);
  };

  const handleUpdatePatient = async (updatedPatient: Patient) => {
    const patientUpdateData: Partial<PatientUpdateDTO> = {
      id: {
        value: updatedPatient.id.value,
      },
      dateOfBirth: {
        date: updatedPatient.dateOfBirth.date,
      },
      gender: {
        gender: updatedPatient.gender.gender,
      },
      medicalHistory: {
        medicalHistory: updatedPatient.medicalHistory.medicalHistory,
      },
      emergencyContact: {
        emergencyContact: updatedPatient.emergencyContact.emergencyContact,
      },
    };

    try {
      await patientService.updatePatient(updatedPatient.id.value, patientUpdateData);
      setAlertMessage("Paciente atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      setAlertMessage("Erro ao atualizar paciente.");
    }
  };

  return (  
    <div >
      {loading && <Loading loadingText />}
      {error && <Alert type="error" message={error} />}

      <InputGroup title="Buscar Pacientes" description="Filtre por ID, nome ou contato de emergência">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </InputGroup>

      <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">
              <Checkbox
                label="Selecionar Tudo"
                isChecked={selectedPatients.size === filteredPatients.length}
                onChange={() =>
                  setSelectedPatients(
                    selectedPatients.size === filteredPatients.length
                      ? new Set()
                      : new Set(filteredPatients.map((patient) => patient.id.value))
                  )
                }
              />
            </th>
            <th className="px-4 py-2 text-left text-gray-600">ID</th>
            <th className="px-4 py-2 text-left text-gray-600">User ID</th>
            <th className="px-4 py-2 text-left text-gray-600">Email Pessoal</th>
            <th className="px-4 py-2 text-left text-gray-600">IAM Email</th>
            <th className="px-4 py-2 text-left text-gray-600">Nome</th>
            <th className="px-4 py-2 text-left text-gray-600">Data de Nascimento</th>
            <th className="px-4 py-2 text-left text-gray-600">Contato de Emergência</th>
            <th className="px-4 py-2 text-left text-gray-600">Número de Telefone</th>
            <th className="px-4 py-2 text-left text-gray-600">Sexo</th>
            <th className="px-4 py-2 text-left text-gray-600">Histórico Médico</th>
            <th className="px-4 py-2 text-left text-gray-600">Ativo</th>
            <th className="px-4 py-2 text-left text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length === 0 ? (
            <tr>
              <td colSpan={13} className="text-center p-4 text-gray-500">
                Nenhum paciente encontrado.
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr key={patient.id.value} className="hover:bg-gray-200 transition duration-200">
                <td className="px-4 py-3 border-b border-gray-300">
                  <Checkbox
                    label=""
                    isChecked={selectedPatients.has(patient.id.value)}
                    onChange={() => togglePatientSelection(patient.id.value)}
                  />
                </td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.id.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.userId.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.personalEmail.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.iamEmail.value}</td>
                <td className="px-4 py-3 border-b border-gray-300">
                  {patient.name ? `${patient.name.firstName} ${patient.name.lastName}` : "N/A"}
                </td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.dateOfBirth.date}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.emergencyContact?.emergencyContact}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.phoneNumber?.number}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.gender.gender}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.medicalHistory?.medicalHistory}</td>
                <td className="px-4 py-3 border-b border-gray-300">{patient.active ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 border-b border-gray-300">
                  <Button
                    name="editPatient"
                    onClick={() => handleEditPatient(patient)}
                    className="bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-700"
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <Button
          name="deleteSelected"
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700"
          disabled={selectedPatients.size === 0}
        >
          Excluir Selecionados
        </Button>
        <Pagination
          meta={{
            page: page,
            limit: 10,
            total: filteredPatients.length,
            totalPages: Math.ceil(filteredPatients.length / 10),
          }}
          changePage={setPage}
          className="mt-4"
        />
      </div>

      {isEditModalVisible && selectedPatient && (
        <EditPatientModal
          isVisible={isEditModalVisible}
          setIsVisible={setEditModalVisible}
          patient={selectedPatient}
          onUpdate={handleUpdatePatient}
        />
      )}

    </div>
  );
};

export default PatientList;