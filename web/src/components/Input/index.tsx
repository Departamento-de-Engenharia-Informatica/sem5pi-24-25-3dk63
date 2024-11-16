import React from "react";

interface InputProps {
  label?: string;
  value?: string;
  defaultValue?: string | number;
  onChange?: (val: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  description?: string;
  className?: string;
  step?: number;
  name?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  description,
  name,
  step,
  disabled,
  autoComplete,
  className,
  inputRef,
  defaultValue,
  readOnly,
}) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name || placeholder}
          className="ml-1 font-bold text-slate-500 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <p className="-mt-2 mb-1 ml-1 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <input
        className="w-full rounded-lg border border-slate-500 bg-slate-100 px-4 py-2.5 text-left disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-500"
        placeholder={placeholder}
        type={type}
        name={name || placeholder}
        step={step}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined} // Condicional para onChange
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={inputRef}
      />
    </div>
  );
};

export default Input;
