import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table";
import { useOpTypesListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import Pagination from "@/components/Pagination";

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
  } = useOpTypesListModule(setAlertMessage);

  const totalPages = Math.ceil(totalOTypes / itemsPerPage);

  

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto">
          <Table headers={headers} data={OTypes}  />
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          />
          </div>
        </div>
      );
    };

export default OpTypesList;
