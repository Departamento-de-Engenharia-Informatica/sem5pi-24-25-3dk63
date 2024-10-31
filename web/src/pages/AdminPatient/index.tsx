// view.jsx
import React from "react";
import Loading from "@/components/Loading/index";
import Alert from "@/components/Alert/index";
import Table from "@/components/Table/Table";
import { usePatientListModule } from "./module";

interface PatientListProps {
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PatientList: React.FC<PatientListProps> = ({ setAlertMessage }) => {
  const { patients, loading, error, headers } = usePatientListModule(setAlertMessage);

  return (
    <div className="container mx-auto p-4">
      {loading && <Loading loadingText />}
      {error && <Alert type="error" message={error} />}
      <div className="overflow-x-auto">
        <Table headers={headers} data={patients} />
      </div>
    </div>
  );
};

export default PatientList;
