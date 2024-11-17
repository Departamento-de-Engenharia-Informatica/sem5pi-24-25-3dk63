import React from "react";
import { useConfirmDeletionModule } from "./module";

const ConfirmDeletionPage: React.FC = () => {
  const { confirmationStatus } = useConfirmDeletionModule();

  return (
    <div>
      <h1>Confirm Account Deletion</h1>
      <p>{confirmationStatus}</p>
    </div>
  );
};

export default ConfirmDeletionPage;
