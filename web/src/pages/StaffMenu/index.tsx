import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button/index";
import Alert from "@/components/Alert/index";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useStaffMenuModule } from "./module";

const OperationRequestMenu: React.FC = () => {
  const {
    handleManageOperationRequests,
    menuOptions,
    alertMessage,
    handle3DFloor,
  } = useStaffMenuModule();

  return (
    <div className="relative pt-20 p-8 bg-gray-50 min-h-screen">
      <div className="fixed top-1 left-4 z-10">
        <HamburgerMenu options={menuOptions} />
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Manage operation requests</h1>
      {alertMessage && (
        <div className="mb-4">
          <Alert type="warning" message={alertMessage} />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <Button onClick={handleManageOperationRequests} name="manage-operation-requests">
            Manage Operation Requests
          </Button>
          <Button onClick={handle3DFloor} name="3d-floor">
            Open 3D floor visualization
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OperationRequestMenu;
