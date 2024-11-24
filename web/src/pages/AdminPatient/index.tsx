import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import Pagination from "@/components/Pagination";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
import SidebarMenu from "@/components/SidebarMenu";

interface PatientListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PatientList: React.FC<PatientListProps> = ({ setAlertMessage }) => {
  const {
    patients,
    loading,
    error,
    headers,
    menuOptions,
    currentPage,
    setCurrentPage,
    searchPatients,
    handleDelete,
    handleEdit,
    isModalVisible,
    setIsModalVisible,
    countryOptions,
    setCountryCode,
    setPhoneNumberPart,
    handleAddPatient,
    creatingPatient,
    setCreatingPatient,
    savePatient,
    totalPatients,
    itemsPerPage,
    popupMessage,
    setPopupMessage,
    cancelDelete,
    confirmDelete,
    isDialogVisible,
    countryCode,
    phoneNumberPart,
  } = usePatientListModule(setAlertMessage);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  const renderActions = (patient: any) => {
    const options = [
      {
        label: "Edit",
        onClick: () => handleEdit(patient.id),
        className: "text-blue-500",
      },
      {
        label: "Deactivate",
        onClick: () => handleDelete(patient.id),
        className: "text-yellow-500",
      },
      {
        label: "Delete",
        onClick: () => handleDelete(patient.id),
        className: "text-red-500",
      },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu options={options} buttonLabel="Actions" />
      </div>
    );
  };

  const tableData = patients.map((patient) => ({
    ...patient,
    actions: renderActions(patient),
  }));

  useEffect(() => {
    if (!isModalVisible) {
      setCountryCode(countryOptions[0].code);
      setPhoneNumberPart("");
    }
  }, [isModalVisible]);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
        <SidebarMenu options={menuOptions} title = "Admin Panel" basePath="/admin"/>
      </div>
      {/* Conteúdo principal */}
      <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto h-full">

        {/* Hamburger Menu: Só visível em telas pequenas */}
      <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
          />
      </div>

        <div className="mb-4">
          <button
            onClick={handleAddPatient}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 w-full sm:w-auto"
          >
            Add Patient
          </button>
        </div>
        <SearchFilter
          attributes={['Name', 'Email', 'dateOfBirth', 'medicalRecordNumber']}
          labels={{
            Name: 'Name',
            Email: 'Email',
            dateOfBirth: 'Date of Birth',
            medicalRecordNumber: 'Medical Record Number'
          }}
          onSearch={searchPatients}
          results={[]}
          renderResult={() => <></>}
        />
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
       <div className="overflow-x-auto">
          <Table headers={headers} data={tableData}   totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}/>
        </div>

      </div>

      {/* Modal de Cadastro/edição */}
     {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title={creatingPatient?.id ? "Edit Patient" : "Register Patient"}
        >
          <div className="p-4">

            {/* FIRST NAME */}
            <label className="block text-sm font-medium text-gray-700 mt-4">First Name</label>
            <input
              type="text"
              value={creatingPatient?.firstName?.value || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                  setCreatingPatient((prev: any) => ({
                    ...prev,
                    firstName: {value: inputValue },
                  }));
                }
              }}
              placeholder="Enter first name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* LAST NAME */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Last Name</label>
            <input
              type="text"
              value={creatingPatient?.lastName?.value || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                  setCreatingPatient((prev: any) => ({
                    ...prev,
                    lastName: { value: inputValue },
                  }));
                }
              }}
              placeholder="Enter last name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* DATE OF BIRTH */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Date of Birth</label>
            <input
              type="date"
              value={creatingPatient?.dateOfBirth?.date || ""}
              readOnly={!!creatingPatient?.id}
              disabled={!!creatingPatient?.id}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  dateOfBirth: { date: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* GENDER */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Gender</label>
            <select
              value={creatingPatient?.gender?.gender || ""}
              disabled={!!creatingPatient?.id}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  gender: { gender: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* EMAIL */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Personal Email</label>
            <input
              type="email"
              value={creatingPatient?.personalEmail?.value || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  personalEmail: { value: e.target.value },
                }))
              }
              placeholder="Enter personal email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* PHONE NUMBER */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Phone Number</label>
            <div className="flex mt-1">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/4 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
              >
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={phoneNumberPart}
                onChange={(e) => {
                  const inputValue = e.target.value.trim();
                  if (/^\d*$/.test(inputValue)) {
                    setPhoneNumberPart(inputValue);
                  }
                }}
                placeholder="Enter phone number"
                className="w-full border border-l-0 border-gray-300 rounded-r-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            {/* EMERGENCY CONTACT */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Emergency Contact</label>
            <input
              type="text"
              value={creatingPatient?.emergencyContact?.emergencyContact || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  emergencyContact: { emergencyContact: e.target.value },
                }))
              }
              placeholder="Enter emergency contact"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            {/* MEDICAL HISTORY */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Medical History</label>
            <textarea
              value={creatingPatient?.medicalHistory?.medicalHistory || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  medicalHistory: { medicalHistory: e.target.value },
                }))
              }
              placeholder="Enter medical history"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <button
              onClick={savePatient}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />
      <Confirmation
        isVisible={isDialogVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this patient?"
      />
    </div>
  );
};

export default PatientList;
