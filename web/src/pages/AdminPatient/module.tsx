import { useState, useEffect } from "react";
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { IPatientService } from "@/service/IService/IPatientService";
import { useNavigate } from "react-router-dom";

export const usePatientListModule = (setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>) => {

  const countryOptions = [
    { code: "+351" },
    { code: "+1" },
    { code: "+44" },
  ];

  const navigate = useNavigate();
  const patientService = useInjection<IPatientService>(TYPES.patientService);

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [creatingPatient, setCreatingPatient] = useState<any | null>(null);
  const [patientForm, setPatientForm] = useState<any | null>(null);
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [phoneNumberPart, setPhoneNumberPart] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);

  const itemsPerPage = 10;

  const headers = [
    "Medical Record Number",
    "Full Name",
    "Personal Email",
    "IAM Email",
    "Date of Birth",
    "Gender",
    "Contact Phone",
    "Active",
    "",
  ];

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "Admin Menu", action: () => navigate("/admin") },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  };

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    setNoDataMessage(null);
    try {
      const patientsData = await patientService.getPatients();
      console.log("Data returned from getPatients:", patientsData);
      setTotalPatients(patientsData.length);

      const filteredData = patientsData.map((patientUser) => ({
        "Medical Record Number": patientUser.id.value,
        "Full Name": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
        "Personal Email": patientUser.personalEmail.value,
        "IAM Email": patientUser.iamEmail.value,
        "Date of Birth": formatDate(patientUser.dateOfBirth.date),
        Gender: patientUser.gender.gender,
        "Contact Phone": patientUser.phoneNumber.number,
        Active: patientUser.active ? "Yes" : "No",
        id: patientUser.id.value,
      }));

      if (filteredData.length === 0) {
        setNoDataMessage("No data found for the requirements.");
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPatients = filteredData.slice(startIndex, startIndex + itemsPerPage);
      setPatients(paginatedPatients);
    } catch (error: any) {
      console.error("Error fetching patients:", error);
      setError("Error fetching patients.");
      setAlertMessage("Error fetching patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    const patientToEdit = patients.find(patient => patient.id === id);

    if (patientToEdit) {
      const fullName = patientToEdit["Full Name"].split(" ");
      const firstName = fullName[0] || "";
      const lastName = fullName.length > 1 ? fullName.slice(1).join(" ") : "";

      setCreatingPatient({
        ...patientToEdit,
        firstName: { value: firstName },
        lastName: { value: lastName },
        dateOfBirth: { date: patientToEdit["Date of Birth"] },
        gender: { gender: patientToEdit["Gender"] },
        personalEmail: { value: patientToEdit["Personal Email"] },
        phoneNumber: { number: patientToEdit["Contact Phone"] },
        emergencyContact: { emergencyContact: patientToEdit["Emergency Contact"] },
      });
      setIsModalVisible(true);
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientService.deletePatient(id);
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
        setAlertMessage("Patient deleted successfully.");
        setPopupMessage("Patient deleted successfully..");
      } catch (error) {
        console.error("Error deleting patient:", error);
        setAlertMessage("Error deleting patient.");
        setPopupMessage("Error while deleting patient.");
      }
    }
  };

  const handleAddPatient = () => {
    console.log("Add new Patient");
    const patientFormDto = {
      firstName: { value: "" },
      lastName: { value: "" },
      dateOfBirth: { date: "" },
      gender: { gender: "" },
      personalEmail: { value: "" },
      phoneNumber: { number: "" },
      emergencyContact: { emergencyContact: "" },
    };
    console.log("New Patient Form:", patientFormDto);

    setCreatingPatient(patientFormDto);
    setIsModalVisible(true);
  };

  const savePatient = async () => {
    if (!creatingPatient) {
      return;
    }
    try {
      const updatedPatient = {
        ...creatingPatient,
        phoneNumber: { number: `${countryCode}${phoneNumberPart}` },
      };

      // Map the form dto to the patientRegister dto
      const patientDto = {
        dateOfBirth: {
          date: updatedPatient.dateOfBirth.date,
        },
        gender: {
          gender: updatedPatient.gender.gender,
        },
        emergencyContact: {
          emergencyContact: updatedPatient.emergencyContact.emergencyContact,
        },
        appointmentHistoryList: [],
        personalEmail: {
          value: updatedPatient.personalEmail.value,
        },
        name: {
          firstName: updatedPatient.firstName.value,
          lastName: updatedPatient.lastName.value,
        },
        phoneNumber: {
          number: updatedPatient.phoneNumber.number,
        },
      };

      console.log("Saving Patient:", patientDto);
      await patientService.createPatient(patientDto);
      setPopupMessage("Patient created successfully.");
      
      setIsModalVisible(false);
      fetchPatients();
    } catch (error) {
      console.error("Error creating Patient:", error);
      window.confirm("Error creating Patient.");
    }
  };

const searchPatients = async (query: Record<string, string>) => {
  setLoading(true);
  setError(null);
  setNoDataMessage(null);
  setPatients([]);
  try {
    console.log("Query:", query);
    const patientsData = await patientService.searchPatients(query);
    console.log("Data returned from searchPatients:", patientsData);

    const filteredData = patientsData.map((patientUser) => ({
      "Medical Record Number": patientUser.id.value,
      "Full Name": `${patientUser.name.firstName} ${patientUser.name.lastName}`,
      "Personal Email": patientUser.personalEmail.value,
      "IAM Email": patientUser.iamEmail.value,
      "Date of Birth": formatDate(patientUser.dateOfBirth.date),
      Gender: patientUser.gender.gender,
      "Contact Phone": patientUser.phoneNumber.number,
      Active: patientUser.active ? "Yes" : "No",
      id: patientUser.id.value,
    }));

    if (filteredData.length === 0) {
      setNoDataMessage("No data found for the requirements.");
    }
    setPatients(filteredData);
  } catch (error) {
    setError("No data found for the requirements.");
    console.error("Error fetching patients:", error);
    setAlertMessage("No data found for the requirements.");
    setPatients([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  return {
    patients,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    handleDelete,
    handleEdit,
    isModalVisible,
    setIsModalVisible,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    setPhoneNumberPart,
    patientForm,
    handleAddPatient,
    creatingPatient,
    setCreatingPatient,
    savePatient,
    totalPatients,
    itemsPerPage,
    searchPatients,
    popupMessage,
    setPopupMessage,
    noDataMessage,
  };
};
