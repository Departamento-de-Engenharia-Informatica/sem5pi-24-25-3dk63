import React from "react";
import { useConfirmUpdateModule } from "./module";

const ConfirmUpdatePage: React.FC = () => {
  const { confirmationStatus } = useConfirmUpdateModule();

  return (
    <div>
      <h1>Confirm Profile Update</h1>
      <p>{confirmationStatus}</p>
    </div>
  );
};

export default ConfirmUpdatePage;
