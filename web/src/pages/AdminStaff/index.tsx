import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useStaffListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";
import Modal from "@/components/Modal";
import { PendingStaffChangesDTO } from "@/dto/PendingStaffChangesDTO";

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
    isModalVisible,           // Controle do modal
    setIsModalVisible,        // Função para controlar a visibilidade do modal
    staffToEdit,              // Staff atualmente sendo editado
    setStaffToEdit,  
    saveChanges,         // Função para definir o staff a ser editado
  } = useStaffListModule(setAlertMessage);

  const totalPages = Math.ceil(totalStaffs / itemsPerPage);

  

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto">
          <Table headers={headers} data={staffs}  />
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
                // Mude aqui: Acesse o valor do email corretamente
                value={staffToEdit?.email?.value || ""} 
                onChange={(e) =>
                    setStaffToEdit((prev: any) => ({
                        ...prev,
                        // Altere para o novo formato que envolve o email
                        email: { value: e.target.value }, 
                    }))
                }
            />
          <label>Telefone</label>
                  <input
                      type="text"
                      // Mude aqui: Acesse o número do telefone corretamente
                      value={staffToEdit?.phoneNumber?.number || ""} 
                      onChange={(e) =>
                          setStaffToEdit((prev: any) => ({
                              ...prev,
                              // Altere para o novo formato que envolve o telefone
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
