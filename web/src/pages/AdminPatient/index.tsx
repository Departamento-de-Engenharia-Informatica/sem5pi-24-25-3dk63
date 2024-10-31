// view.jsx
import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table/Table";
import { usePatientListModule } from "./module";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useNavigate } from "react-router-dom";

interface PatientListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PatientList: React.FC<PatientListProps> = ({ setAlertMessage }) => {
  const { patients, loading, error, headers } = usePatientListModule(setAlertMessage);
  const navigate = useNavigate(); 

  const menuOptions = [
    { label: "Homepage", action: () => navigate("/") },
    { label: "AdminMenu", action: () => navigate("/admin") },
  ];

  return (
    <div className="relative">
      <HamburgerMenu options={menuOptions} />
      <div className="container mx-auto p-4">
        {loading && <Loading loadingText />}
        {error && <Alert type="error" message={error} />}
        <div className="overflow-x-auto">
          <Table headers={headers} data={patients} />
        </div>
      </div>
    </div>
  );
};

export default PatientList;
