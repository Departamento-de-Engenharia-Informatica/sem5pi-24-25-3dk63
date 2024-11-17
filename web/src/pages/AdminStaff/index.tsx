import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Card";
import { useStaffListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
import { StaffUser } from "@/model/StaffUser";
import SidebarMenu from "@/components/SidebarMenu";

interface StaffListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const StaffList: React.FC<StaffListProps> = ({ setAlertMessage }) => {
  const {
    staffs,
    loading,
    error,
    headers,
    menuOptions,
    totalStaffs,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    countryOptions,
    countryCode,
    setCountryCode,
    phoneNumberPart,
    setPhoneNumberPart,
    setCreatingStaff,
    creatingStaff,
    saveStaff,
    isEditing,
    staffToEdit,
    setStaffToEdit,
    saveChanges,
    specializations,
    handleDelete,
    handleEdit,
    handleDeactivate,
    handleAddStaff,
    searchStaffs,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
  } = useStaffListModule(setAlertMessage);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Controla a visibilidade da sidebar em telas pequenas

  const totalPages = Math.ceil(totalStaffs / itemsPerPage);

  const renderActions = (staff: any) => {
    const options = [
      {
        label: "Edit",
        onClick: () => handleEdit(staff),
        className: "text-blue-500",
      },
      {
        label: "Deactivate",
        onClick: () => handleDeactivate(staff.id),
        className: "text-yellow-500",
      },
      {
        label: "Delete",
        onClick: () => handleDelete(staff.id),
        className: "text-red-500",
      },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu options={options} buttonLabel="Actions" />
      </div>
    );
  };

  const tableData = staffs.map((staff) => ({
    ...staff,
    actions: renderActions(staff),
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
        <SidebarMenu options={menuOptions} />
      </div>
      {/* Conteúdo principal */}
      <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto h-full">

      <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          />
      </div>
      <div className="mb-4">
        <button
          onClick={handleAddStaff}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Add Staff
        </button>
      </div>
      <SearchFilter
        attributes={['Name', 'Email', 'Specialization']}
        labels={{
          Name: 'Name',
          Email: 'Email',
          Specialization: 'Specialization'
        }}
        onSearch={searchStaffs}
        results={[]}
        renderResult={() => <></>}
      />
      {/* Loading and Error States */}
      {loading && <Loading loadingText />}
      {error && <Alert type="error" message={error} />}

      {/* Table Data */}
      <div className="overflow-x-auto">
        <Table headers={headers} data={tableData}   totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}/>
      </div>

     
      </div>

      {/* Modal for adding staff */}
      {isModalVisible && !isEditing && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title="Add new staff"
        >
          <div className="p-6">
            {/* First name */}
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={creatingStaff?.firstName || ""}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />

            {/* Last name */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Last Name</label>
            <input
              type="text"
              value={creatingStaff?.lastName || ""}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />

            {/* License Number */}
            <label className="block text-sm font-medium text-gray-700 mt-4">License Number</label>
            <input
              type="text"
              value={creatingStaff?.licenseNumber || ""}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  licenseNumber: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />

            {/* Email */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
            <input
              type="email"
              value={creatingStaff?.email || ""}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />

            {/* Phone Number */}
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

            {/* Role */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Role</label>
            <select
              value={creatingStaff?.role || ""}
              disabled={!!creatingStaff?.id}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Technician">Technician</option>
            </select>


            {/* Specialization */}
            <label className="block text-sm font-medium text-gray-700 mt-4">Specialization</label>
            <select
              value={creatingStaff?.specialization || ""}
              onChange={(e) =>
                setCreatingStaff((prev: any) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            >
              <option value="" disabled>Select specialization</option>
              {specializations.map((description, index) => (
                <option key={index} value={description}>
                  {description}
                </option>
              ))}
            </select>

            {/* Save Staff Button */}
            <button
              onClick={saveStaff}
              className="mt-6 w-full bg-[#284b62] text-white font-semibold py-2 rounded-md hover:bg-opacity-80 transition duration-200"
            >
              Save Staff
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for editing staff */}
      {isModalVisible && isEditing && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title="Edit Staff Information"
        >
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={staffToEdit?.email?.value || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  email: { value: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Phone</label>
            <input
              type="text"
              value={staffToEdit?.phoneNumber?.number || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  phoneNumber: { number: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />
              <label className="block text-sm font-medium text-gray-700 mt-4">Specialization</label>
              <select
                value={staffToEdit?.specialization || ""}
                onChange={(e) =>
                  setStaffToEdit((prev: any) => ({
                    ...prev,
                    specialization: e.target.value,
                  }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
              >
                <option value="" disabled>Select Specialization</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            <button
              onClick={saveChanges}
              className="mt-6 w-full bg-[#284b62] text-white font-semibold py-2 rounded-md hover:bg-opacity-80 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Popup and Confirmation */}
      <Popup
        isVisible={!!popupMessage}
        setIsVisible={() => setPopupMessage(null)}
        message={popupMessage}
      />

      <Confirmation
        isVisible={!!confirmDeactivate}
        onConfirm={() => {
          if (confirmDeactivate) {
            confirmDeactivate();
            setConfirmDeactivate(null);
          }
        }}
        onCancel={handleCancelDeactivate}
        message="Are you sure you want to deactivate this staff?"
      />
    </div>
  );
};

export default StaffList;
