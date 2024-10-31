// pages/AdminPatient/NewPatient.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPatientService } from "@/service/IService/IPatientService";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";

const NewPatient: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: { value: "" },
    lastName: { value: "" },
    dateOfBirth: { date: "" },
    email: { value: "" },
    phone: { value: "" },
    emergencyContact: { emergencyContact: "" },
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patientService.createPatient(formData);
      setAlertMessage("Patient created successfully!");
      navigate("/admin/patients");
    } catch (error) {
      setAlertMessage("Failed to create patient. Please try again.");
    }
  };

  const patientService = useInjection<IPatientService>(TYPES.patientService);

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Create New Patient</h1>
      {alertMessage && <Alert type="warning" message={alertMessage} />}
      <form className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
        <textarea name="emergencyContact" placeholder="Emergency Contact" onChange={handleChange} />

        <Button
        name="create-patient"
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded px-4 py-1 hover:bg-blue-700"
        >
        Registar
        </Button>
      </form>
    </div>
  );
};

export default NewPatient;
