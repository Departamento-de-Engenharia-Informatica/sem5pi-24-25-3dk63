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

  } = useStaffListModule(setAlertMessage);

  const totalPages = Math.ceil(totalStaffs / itemsPerPage);

  const renderActions = (staff: any) => {
    const options = [
      {
        label: "Editar",
        onClick: () => handleEdit(staff),
        className: "text-blue-500",
      },
      {
        label: "Desativar",
        onClick: () => handleDeactivate(staff.id),
        className: "text-yellow-500",
      },
      {
        label: "Eliminar",
        onClick: () => handleDelete(staff.id),
        className: "text-red-500",
      },
    ];


    return (
        <div className="flex flex-wrap gap-2">
          <DropdownMenu options={options} buttonLabel="Ações" />
        </div>
      );
  };
  const tableData = staffs.map((staff) => ({
    ...staff,
    Ações: renderActions(staff),
  }));

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
      <SearchFilter
        attributes={['Name', 'Email', 'Specialization']}
        labels={{
          Name: 'Nome',
          Email: 'E-mail',
          Specialization: 'Especialização'
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
        title="Editar Informações do Staff"
      >
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={staffToEdit?.email?.value || ""}
            onChange={(e) =>
              setStaffToEdit((prev:any) => ({
                ...prev,
                email: { value: e.target.value },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Telefone</label>
          <input
            type="text"
            value={staffToEdit?.phoneNumber?.number || ""}
            onChange={(e) =>
              setStaffToEdit((prev:any) => ({
                ...prev,
                phoneNumber: { number: e.target.value },
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Especialização</label>
          <input
            type="text"
            value={staffToEdit?.specialization || ""}
            onChange={(e) =>
              setStaffToEdit((prev:any) => ({
                ...prev,
                specialization: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={saveChanges}
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Salvar
          </button>
        </div>
      </Modal>
      )}
    </div>
  );
};

export default StaffList;
