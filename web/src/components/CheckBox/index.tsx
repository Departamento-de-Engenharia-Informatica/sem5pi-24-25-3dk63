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
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out focus:ring focus:ring-blue-500 rounded"
      />
      <span className="ml-1 text-gray-800 text-sm">{label}</span>
    </label>
  );
};

export default Checkbox;
