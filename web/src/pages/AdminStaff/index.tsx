import React from "react";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Table";
import { useStaffListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";

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
    staffToEdit,
    setStaffToEdit,
    handleEdit,
    handleDelete,
    handleDeactivate,
    saveChanges,
    searchStaffs,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
  } = useStaffListModule(setAlertMessage);

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
    " ": renderActions(staff),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        <SearchFilter
          attributes={['Name', 'Email', 'Specialization']}
          labels={{
            Name: 'Name',
            Email: 'Email',
            Specialization: 'Specialization',
          }}
          onSearch={searchStaffs}
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
            <input
              type="text"
              value={staffToEdit?.specialization || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-[#284b62]"
            />
            <button
              onClick={saveChanges}
              className="mt-6 w-full bg-[#284b62] text-white font-semibold py-2 rounded-md hover:bg-opacity-80 transition duration-200"
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
      isVisible={!!confirmDeactivate}
      onConfirm={() => {
        if (confirmDeactivate) {
          confirmDeactivate(); // Chama a função de desativação
          setConfirmDeactivate(null); // Reseta o estado
        }
      }}
      onCancel={handleCancelDeactivate}
      message="Are you sure you want to deactivate this operation type?"
    />
        </div>
  );
};

export default StaffList;
