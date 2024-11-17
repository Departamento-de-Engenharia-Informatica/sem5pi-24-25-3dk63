import React from "react";
import { useSurgeryRoomListModule } from "./module";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Card";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";

interface SurgeryRoomListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const SurgeryRoomList: React.FC<SurgeryRoomListProps> = ({ setAlertMessage }) => {
  const {
    surgeryRooms,
    loading,
    error,
    headers,
    menuOptions,
    totalSurgeryRooms,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    surgeryRoomToEdit,
    setSurgeryRoomToEdit,
    handleEdit,
    handleDelete,
    saveChanges,
    searchSurgeryRooms,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    roomNumber,
    setRoomNumber,
  } = useSurgeryRoomListModule(setAlertMessage);

  const totalPages = Math.ceil(totalSurgeryRooms / itemsPerPage);



  const tableData = surgeryRooms.map((surgeryRoom) => ({
    ...surgeryRoom,
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} onClick={() => {}} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto">
          <Table headers={headers} data={tableData} totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}/>
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
          title="Edit Surgery Room Information"
        >
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={surgeryRoomToEdit?.name || ""}
              onChange={(e) =>
                setSurgeryRoomToEdit((prev: any) => ({
                  ...prev,
                  name: e.target.value,
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
            confirmDeactivate();
            setConfirmDeactivate(null);
          }
        }}
        onCancel={handleCancelDeactivate}
        message="Are you sure you want to delete this surgery room?"
      />
    </div>
  );
};

export default SurgeryRoomList;
