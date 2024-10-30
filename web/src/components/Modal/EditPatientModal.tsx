import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button/index";
import Input from "@/components/Input/index";
import { Patient } from "@/model/Patient";

interface EditPatientModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patient: Patient;
  onUpdate: (updatedPatient: Patient) => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isVisible,
  setIsVisible,
  patient,
  onUpdate,
}) => {
  const [updatedPatient, setUpdatedPatient] = useState<Patient>(patient);

  const handleInputChange = (field: keyof Patient, value: any) => {
    setUpdatedPatient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdate(updatedPatient);
    setIsVisible(false);
  };

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible} title="Editar Paciente">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Paciente</h2>

        <div className="space-y-4">
          <Input
            label="ID"
            value={updatedPatient.id.value}
            readOnly
          />
          <Input
            label="User ID"
            value={updatedPatient.userId.value}
            onChange={(e) => handleInputChange("userId", { value: e })}
          />
          <Input
            label="Data de Nascimento"
            value={updatedPatient.dateOfBirth.date}
            onChange={(e) => handleInputChange("dateOfBirth", { date: e })}
          />
          <Input
            label="Contato de Emergência"
            value={updatedPatient.emergencyContact.emergencyContact}
            onChange={(e) => handleInputChange("emergencyContact", { emergencyContact: e })}
          />
          <Input
            label="Sexo"
            value={updatedPatient.gender.gender}
            onChange={(e) => handleInputChange("gender", { gender: e })}
          />
          <Input
            label="Histórico Médico"
            value={updatedPatient.medicalHistory.medicalHistory}
            onChange={(e) => handleInputChange("medicalHistory", { medicalHistory: e })}
          />
          <div className="flex justify-between mt-4">
            <Button onClick={handleSubmit} name="updatePatient" type="default">
              Atualizar
            </Button>
            <Button onClick={() => setIsVisible(false)} name="closeEditModal" type="default">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditPatientModal;