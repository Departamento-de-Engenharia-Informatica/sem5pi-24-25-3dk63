import React, { useState, useEffect } from "react";
import { usePatientMenuModule } from "./module";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import MenuSection from "@/components/MenuSection";
import { FaUserAlt, FaClipboardList, FaHistory,FaTrashAlt } from "react-icons/fa";
import HamburgerMenu from "@/components/HamburgerMenu";
import SidebarMenu from "@/components/SidebarMenu";

const PatientMenu: React.FC = () => {
  const {
    alertMessage,
    updateProfileData = {},
    isModalVisible,
    submitProfileUpdate,
    setIsModalVisible,
    popupMessage,
    setPopupMessage,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    handleChange,
    handlePhoneNumberChange,
    menuOptions
  } = usePatientMenuModule();

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Menu para telas grandes */}
      <div className="hidden lg:block w-64">
        <SidebarMenu options={menuOptions} title="Patient Panel" basePath="/patient" />
      </div>

      {/* Hamburger Menu para dispositivos móveis */}
      <div className="lg:hidden">
        <HamburgerMenu options={menuOptions} />
        {isMobileMenuVisible && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10">
            <SidebarMenu options={menuOptions} title="Admin Panel" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-10 p-6 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-[#1f2937] dark:to-[#374151] overflow-y-auto">
        {/* Alerta */}
        {alertMessage && (
          <div className="mb-6 w-full max-w-2xl mx-auto">
            <Alert type="warning" message={alertMessage} />
          </div>
        )}
 {/* Mensagem de Boas-Vindas */}
        <MenuSection
          title="Welcome to the Patient Panel!"
          description="Access your medical records, manage your profile, and view your appointment history. Explore the sections on the left to get started."
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
          isWelcomeMessage={true}
        />

        {/* Seções principais com ícones e descrições */}
       <div className="mt-8 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <MenuSection
          title="Edit Profile"
          description="Update your personal details, contact information, and emergency contact."
          Icon={FaUserAlt}
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
        />
        <MenuSection
          title="Appointment History"
          description="Review your past appointments, including details about procedures and follow-ups."
          Icon={FaHistory}
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
        />
        <MenuSection
          title="Medical Records"
          description="View your medical history, test results, prescriptions, and doctor's notes."
          Icon={FaClipboardList}
          iconColorClass="text-primary-500 dark:text-primary-300"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
        />
        <MenuSection
          title="Request Account Deletion"
          description="Submit a request to permanently delete your account and personal data."
          Icon={FaTrashAlt}
          iconColorClass="text-red-500 dark:text-red-400"
          backgroundClass="bg-white dark:bg-[#2d2f3f]"
        />
      </div>

        {/* Modal Section */}
          <div className="flex flex-col space-y-4">
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
                    value={updateProfileData?.firstName || ""}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                  />

                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={updateProfileData?.lastName || ""}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                  />

                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={updateProfileData?.email?.value || ""}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4">Phone Number</label>
                  <div className="flex mt-1">
                    <select
                      value={countryCode}
                      onChange={(e) => {
                        const newCountryCode = e.target.value;
                        setCountryCode(newCountryCode);
                        handlePhoneNumberChange(`${newCountryCode}${phoneNumberPart}`);
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
                      value={phoneNumberPart}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full border border-l-0 border-gray-300 rounded-r-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                  </div>

                  <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    value={updateProfileData?.emergencyContact?.emergencyContact || ""}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
                  />

                  <label className="block text-sm font-medium text-gray-700">Medical History</label>
                  <input
                    type="text"
                    value={updateProfileData?.medicalHistory?.medicalHistory || ""}
                    onChange={(e) => handleChange('medicalHistory', e.target.value)}
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
          </div>
        </div>


      {/* Popup Message */}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />
    </div>
  );
};

export default PatientMenu;