import React from "react";
import Loading from "@/components/Loading";
import Alert from "@/components/Alert";
import Table from "@/components/Table";
import { useStaffListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";

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
  } = useStaffListModule(setAlertMessage);

  const totalPages = Math.ceil(totalStaffs / itemsPerPage);

  const renderActions = (staff: any) => (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleEdit(staff)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 text-sm"
      >
        Editar
      </button>
      <button
        onClick={() => handleDeactivate(staff.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm"
      >
        Desativar
      </button>
      <button
        onClick={() => handleDelete(staff.id)}
        className="flex-1 min-w-[100px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 text-sm"
      >
        Eliminar
      </button>
    </div>
  );

  const tableData = staffs.map((staff) => ({
    ...staff,
    Ações: renderActions(staff),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
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
          title="Editar Informações do Staff"
        >
          <div>
            <label>Email</label>
            <input
              type="email"
              value={staffToEdit?.email?.value || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  email: { value: e.target.value },
                }))
              }
            />
            <label>Telefone</label>
            <input
              type="text"
              value={staffToEdit?.phoneNumber?.number || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  phoneNumber: { number: e.target.value },
                }))
              }
            />
            <label>Specialization</label>
            <input
              type="text"
              value={staffToEdit?.specialization || ""}
              onChange={(e) =>
                setStaffToEdit((prev: any) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
            />
            <button onClick={saveChanges}>Salvar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffList;
