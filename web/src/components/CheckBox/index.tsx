import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center mr-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out focus:ring focus:ring-blue-500 rounded dark:text-blue-400 dark:focus:ring-blue-300"
      />
      <span className="ml-1 text-gray-800 text-sm dark:text-gray-200">{label}</span>
    </label>
  );
};

export default Checkbox;
