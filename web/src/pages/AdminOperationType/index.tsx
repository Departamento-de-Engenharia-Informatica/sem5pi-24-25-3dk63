import React, { useState } from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Card";
import { useOpTypesListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Modal from "@/components/Modal";
import Popup from "@/components/Popup";
import Confirmation from "@/components/Confirmation";
import SearchFilter from "@/components/SearchFilter";
import DropdownMenu from "@/components/DropdownMenu";
import SidebarMenu from "@/components/SidebarMenu";

interface OperationTypeListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const OpTypesList: React.FC<OperationTypeListProps> = ({ setAlertMessage }) => {
  const {
    OTypes,
    loading,
    error,
    headers,
    menuOptions,
    totalOTypes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isModalVisible,
    setIsModalVisible,
    handleDeactivate,
    handleAddOperationType,
    handleEdit,
    creatingOperationType,
    setCreatingOperationType,
    saveOperationType,
    specializations,
    popupMessage,
    setPopupMessage,
    confirmDeactivate,
    setConfirmDeactivate,
    handleCancelDeactivate,
    searchOperationTypes,
  } = useOpTypesListModule(setAlertMessage);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const totalPages = Math.ceil(totalOTypes / itemsPerPage);


  const renderActions = (opType: any) => {
    const isInactive = opType.Active === 'No';
  
    const options = [
      {
        label: "Edit",
        onClick: () => !isInactive && handleEdit(opType.id),
        className: `text-blue-500 ${isInactive ? "opacity-50 cursor-not-allowed" : ""}`,
        disabled: isInactive,
      },
      {
        label: "Deactivate",
        onClick: () => handleDeactivate(opType.id),
        className: "flex-1 min-w-[100px] px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 text-sm",
      },
    ];
  
    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu
          options={options.map((option) => ({
            ...option,
            disabled: option.disabled || false,
          }))}
          buttonLabel="Actions"
        />
      </div>
    );
  };
  

  const tableData = OTypes.map((opType) => ({
    ...opType,
    actions: renderActions(opType),
  }));

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
    <div className={`lg:w-64 w-full ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>
      <SidebarMenu options={menuOptions} title = "Admin Panel"  basePath="/admin"/>
    </div>
    {/* Conteúdo principal */}
    <div className="flex-1 pt-20 pb-10 px-6 bg-[var(--background)] overflow-y-auto flex flex-col">
      {/* Hamburger Menu: Só visível em telas pequenas */}
      <div className="lg:hidden mb-4">
          <HamburgerMenu
            options={menuOptions}
          />
      </div>

        <div className="mb-4">
          <button
            onClick={handleAddOperationType}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Add Operation Type
          </button>
        </div>
        <SearchFilter
          attributes={['name', 'specialization', 'active']}
          labels={{
            name: 'Name',
            specialization: 'Specialization',
            active: 'Active',
          }}
          fieldTypes={{
            active: 'select',
          }}
          selectOptions={{
            active: [
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ],
          }}
          onSearch={searchOperationTypes}
          results={[]}
          renderResult={() => <></>}
        />
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto overflow-y-auto">
          <Table
            headers={headers}
            data={tableData}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
      {/* Modal de Cadastro/edição */}

      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          title={creatingOperationType?.id ? "Edit Operation Type" : "Create New Operation Type"}
        >
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={creatingOperationType?.name || ""}
              onChange={(e) =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Preparation Time</label>
          <input
            type="number"
            value={creatingOperationType?.preparation || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                preparation: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Surgery Time</label>
          <input
            type="number"
            value={creatingOperationType?.surgery || ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                surgery: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Cleaning Time</label>
          <input
            type="number"
            value={creatingOperationType?.cleaning|| ""}
            min="1"
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) =>
              setCreatingOperationType((prev: any) => ({
                ...prev,
                cleaning: parseInt(e.target.value, 10),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Specialization and Required Staff</label>
          <div className="relative">
            <button
              className="block w-full text-left border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:outline-none focus:ring focus:ring-blue-500"
              onClick={() =>
                setCreatingOperationType((prev: any) => ({
                  ...prev,
                  showSpecializationDropdown: !prev?.showSpecializationDropdown,
                }))
              }
            >
            {creatingOperationType?.specialities?.length > 0
                  ? creatingOperationType.specialities
                  .map((spec: any, index: number) => `${spec} (${creatingOperationType.requiredStaff[index] || 1})`)
                  .join(', ')
              : 'Select Specializations'}
              </button>
              {creatingOperationType?.showSpecializationDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {specializations.map((spec) => (
                  <div key={spec.id} className="flex items-center px-4 py-2">
                    <input
                      type="checkbox"
                      id={`specialization-${spec.id}`}
                      value={spec.description}
                      checked={
                        creatingOperationType?.specialities?.includes(spec.description) || false
                      }
                      onChange={(e) => {
                        const selectedSpecialization = e.target.value;
                        setCreatingOperationType((prev: any) => {
                          const currentSpecialities = prev?.specialities || [];
                          const currentRequiredStaff = prev?.requiredStaff || [];
                          if (e.target.checked) {
                            return {
                              ...prev,
                              specialities: [...currentSpecialities, selectedSpecialization],
                              requiredStaff: [...currentRequiredStaff, 1],
                            };
                          } else {
                            const indexToRemove = currentSpecialities.indexOf(selectedSpecialization);

                  return {
                    ...prev,
                    specialities: currentSpecialities.filter(
                      (spec: string) => spec !== selectedSpecialization
                    ),
                    requiredStaff: currentRequiredStaff.filter(
                      (item: any) => item.specialization !== selectedSpecialization
                    ),
                  };
                }
              });
            }}
            className="mr-2"
                    />
                    <label
                      htmlFor={`specialization-${spec.id}`}
                      className="text-gray-700"
                    >
                      {spec.description}
                    </label>
                    {/* Add new required staff input field */}
                    {creatingOperationType?.specialities?.includes(spec.description) && (
                      <div className="ml-4">
                        <input
                          type="number"
                          value={
                            creatingOperationType?.requiredStaff?.[
                              creatingOperationType.specialities.indexOf(spec.description)
                            ] || 1}
                          min="1"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            setCreatingOperationType((prev: any) => {
                              const indexToUpdate = prev.specialities.indexOf(spec.description);
                              const updatedRequiredStaff = [...prev.requiredStaff];
                              updatedRequiredStaff[indexToUpdate] = parseInt(e.target.value, 10);
                              return {
                                ...prev,
                                requiredStaff: updatedRequiredStaff,
                              };
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
            <button
              onClick={saveOperationType}
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



export default OpTypesList;