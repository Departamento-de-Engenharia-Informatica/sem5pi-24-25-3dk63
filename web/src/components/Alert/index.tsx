import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "@/styles/Icons";
import React from 'react';

interface AlertProps {
  type?: "error" | "warning" | "info" | "success";
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const alerts = {
    error: {
      classes: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      icon: <ErrorIcon />,
    },
    warning: {
      classes: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      icon: <WarningIcon />,
    },
    info: {
      classes: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      icon: <InfoIcon />,
    },
    success: {
      classes: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      icon: <SuccessIcon />,
    },
  };

  return (
    <div
      className={`flex flex-row items-center gap-8 rounded-xl px-12 py-4 ${alerts[type || "info"].classes}`}
    >
      <span className="text-2xl">{alerts[type || "info"].icon}</span>
      <p className="text-xl">{message}</p>
    </div>
  );
};

export default Alert;
