import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Button from "@/components/Button";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Modal from "@/components/Modal";

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
    isModalVisible,
    setIsModalVisible,
    handleAddPatient,
    creatingPatient,
    setCreatingPatient,
    savePatient,
    totalPatients,
    itemsPerPage,
  } = usePatientListModule(setAlertMessage);

  const countryOptions = [
    { code: "+351" },
    { code: "+1" },
    { code: "+44" },
  ];

  const totalPages = Math.ceil(totalPatients / itemsPerPage);

  const renderActions = (patient: any) => {
    const options = [
      {
        label: "Edit",
        onClick: () => handleDelete(patient.id),
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
    "": renderActions(patient),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={handleAddPatient}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
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
          <Table headers={headers} data={tableData} />
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title="Register Patient"
        >
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mt-4">First Name</label>
            <input
              type="text"
              value={creatingPatient?.firstName?.value || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                  setCreatingPatient((prev: any) => ({
                    ...prev,
                    firstName: { value: inputValue },
                  }));
                }
              }}
              placeholder="Enter first name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

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

            <label className="block text-sm font-medium text-gray-700 mt-4">Date of Birth</label>
            <input
              type="date"
              value={creatingPatient?.dateOfBirth?.date || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  dateOfBirth: { date: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Gender</label>
            <select
              value={creatingPatient?.gender?.value || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  gender: { value: e.target.value },
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

            <label className="block text-sm font-medium text-gray-700 mt-4">Personal Email</label>
            <input
              type="text"
              value={creatingPatient?.email?.value || ""}
              onChange={(e) =>
                setCreatingPatient((prev: any) => ({
                  ...prev,
                  email: { value: e.target.value },
                }))
              }
              placeholder="Enter personal email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Phone Number</label>
            <div className="flex mt-1">
              <select
                value={creatingPatient?.phoneNumber?.number || ""}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  setCreatingPatient((prev: any) => ({
                    ...prev,
                    phoneNumber: { number: selectedCode + (prev.phoneNumber?.number.replace(/^\+\d*\s*/, "") || "") },
                  }));
                }}
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
                value={creatingPatient.phoneNumber.number}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue)) {
                    setCreatingPatient((prev: any) => ({
                      ...prev,
                      phoneNumber: { number: inputValue.replace(/^\+\d*\s*/, "") },
                    }));
                  }
                }}
                className="w-full border border-l-0 border-gray-300 rounded-r-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

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

            <button
              onClick={savePatient}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default PatientList;
