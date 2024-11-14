import React from "react";
import { usePatientMenuModule } from "./module";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";

const PatientMenu: React.FC = () => {
  const {
    alertMessage,
    loading,
    isDeletionRequested,
    handleAppointments,
    updateProfileData,
    setUpdateProfile,
    isModalVisible,
    submitProfileUpdate,
    setIsModalVisible,
    popupMessage,
    setPopupMessage,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    setPhoneNumberPart,
    handleMedicalRecords,
    handleAccountDeletionRequest,
  } = usePatientMenuModule();

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Paciente</h1>
      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          
          <Button onClick={handleAppointments} name="appointments">
            Access Appointments
          </Button>
          
          <Button onClick={handleMedicalRecords} name="medical-records">
            View Medical Records
          </Button>
          
          {/* Edit Profile Button */}
          <Button
            onClick={() => setIsModalVisible(true)}  // Opens the modal
            name="edit-profile"
          >
            Edit Profile
          </Button>
          
          {isModalVisible && (
            <Modal
              isVisible={isModalVisible}
              setIsVisible={setIsModalVisible}
              title="Update Profile"
            >
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={updateProfileData?.name?.firstName || ""}
                  onChange={(e) => setUpdateProfile({ ...updateProfileData, name: { ...updateProfileData?.name, firstName: e.target.value } })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                />

                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={updateProfileData?.name?.lastName || ""}
                  onChange={(e) => setUpdateProfile({ ...updateProfileData, name: { ...updateProfileData?.name, lastName: e.target.value } })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                />

                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={updateProfileData?.email?.value || ""}
                  onChange={(e) => setUpdateProfile({ ...updateProfileData, email: { value: e.target.value } })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                />

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

                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <input
                  type="text"
                  value={updateProfileData?.emergencyContact?.emergencyContact || ""}
                  onChange={(e) => setUpdateProfile({ ...updateProfileData, emergencyContact: { emergencyContact: e.target.value } })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                />

                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <input
                  value={updateProfileData?.medicalHistory?.medicalHistory || ""}
                  onChange={(e) => setUpdateProfile({ ...updateProfileData, medicalHistory: { medicalHistory: e.target.value } })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                />

                <button
                  onClick={submitProfileUpdate}
                  className="mt-6 w-full bg-[#284b62] text-white font-semibold py-2 rounded-md hover:bg-opacity-80 transition duration-200"
                >
                  Update profile
                </button>
              </div>
            </Modal>
          )}

          {/* Delete Account Button */}
          <Button
            onClick={handleAccountDeletionRequest}
            name="delete-account"
            disabled={loading || isDeletionRequested}
            className={`bg-red-500 hover:bg-red-600 text-white ${loading ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? "Requesting..." : "Request Account Deletion"}
          </Button>
        </div>
      </div>

      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />

    </div>
  );
};

export default PatientMenu;
