import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Card";
import { useStaffListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Modal from "@/components/Modal";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
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
    availabilitySlots,
    setAvailabilitySlots,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
    formatAvailabilitySlots,
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
    "Availability Slots": formatAvailabilitySlots(staff["Availability Slots"]),
    actions: renderActions(staff),
  }));

  useEffect(() => {
    if (!isModalVisible) {
      setAvailabilitySlots([]);
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

      <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
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
          <div className="p-4">
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

            {/* Availability Slots */}
            <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Availability Slots</label>
            {availabilitySlots.map((slot, index) => {
              const now = new Date();
              const minDateTime = now.toISOString().slice(0, 16);
              return (
                <div key={index} className="relative flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="text-red-500 hover:text-red-700 self-center mr-2"
                  >
                    ✕
                  </button>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600">Start</label>
                    <input
                      type="datetime-local"
                      value={slot.start}
                      min={minDateTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (new Date(value) < now) {
                          setPopupMessage("Start time cannot be in the past.");
                          return;
                        }
                        updateAvailabilitySlot(index, "start", value);
                      }}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600">End</label>
                    <input
                      type="datetime-local"
                      value={slot.end}
                      min={slot.start || minDateTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (slot.start && new Date(value) <= new Date(slot.start)) {
                          setPopupMessage("End time must be after the start time.");
                          return;
                        }
                        updateAvailabilitySlot(index, "end", value);
                      }}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addAvailabilitySlot}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Slot
            </button>
          </div>

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
          <div className="p-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={staffToEdit?.Email?.value || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  Email: { value: e.target.value },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
              placeholder="example@domain.com"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4">Phone</label>
            <input
              type="text"
              value={staffToEdit?.phoneNumber?.Number    || ""}
              onChange={(e) => {
                const value = e.target.value;

                // Validar apenas números e '+' no início
                const regex = /^\+?[0-9]*$/; // '+' opcional no início seguido de dígitos
                if (regex.test(value)) {
                  setStaffToEdit((prev: any) => ({
                    ...prev,
                    phoneNumber: { Number: value },
                  }));
                }
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
              placeholder="+1234567890"
            />
              <label className="block text-sm font-medium text-gray-700 mt-4">Specialization</label>
              <select
                value={staffToEdit?.Specialization || ""}
                onChange={(e) =>
                  setStaffToEdit((prev: any) => ({
                    ...prev,
                    Specialization: e.target.value,
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

              {/* Availability Slots */}
              <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Availability Slots</label>
              {availabilitySlots.map((slot, index) => {
                const now = new Date();
                const minDateTime = now.toISOString().slice(0, 16);
                return (
                  <div key={index} className="relative flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(index)}
                      className="text-red-500 hover:text-red-700 self-center mr-2"
                    >
                      ✕
                    </button>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">Start</label>
                      <input
                        type="datetime-local"
                        value={slot.start}
                        min={minDateTime}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (new Date(value) < now) {
                            setPopupMessage("Start time cannot be in the past.");
                            return;
                          }
                          updateAvailabilitySlot(index, "start", value);
                        }}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">End</label>
                      <input
                        type="datetime-local"
                        value={slot.end}
                        min={slot.start || minDateTime}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (slot.start && new Date(value) <= new Date(slot.start)) {
                            setPopupMessage("End time must be after the start time.");
                            return;
                          }
                          updateAvailabilitySlot(index, "end", value);
                        }}
                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={addAvailabilitySlot}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Slot
              </button>
            </div>

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