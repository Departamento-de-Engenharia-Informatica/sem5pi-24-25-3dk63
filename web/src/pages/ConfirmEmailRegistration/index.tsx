import React from "react";
import { useConfirmRegistrationModule } from "./module";

const ConfirmRegistrationPage: React.FC = () => {
  const { confirmationStatus } = useConfirmRegistrationModule();

  return (
    <div>
      <h1>Confirm Profile Registration</h1>
      <p>{confirmationStatus}</p>
    </div>
  );
};

export default ConfirmRegistrationPage;
