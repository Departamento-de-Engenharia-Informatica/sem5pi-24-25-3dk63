interface InputProps {
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
}

const Input: React.FC<InputProps> = ({
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
}) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <label
        htmlFor={name || placeholder}
        className="ml-1 font-bold text-slate-500"
      >
        {name || placeholder}
      </label>
      <p className="-mt-2 mb-1 ml-1 text-sm text-slate-500">{description}</p>
      {onChange === undefined ? (
        <input
          className="w-full rounded-lg border border-slate-500 bg-slate-100 px-4 py-2.5 text-left
          disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          placeholder={placeholder}
          type={type}
          name={name || placeholder}
          step={step}
          disabled={disabled}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          ref={inputRef}
        />
      ) : (
        <input
          className="w-full rounded-lg border border-slate-500 bg-slate-100 px-4 py-2.5 text-left disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          placeholder={placeholder}
          type={type}
          name={name || placeholder}
          disabled={disabled}
          step={step}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={inputRef}
        />
      )}
    </div>
  );
};

export default Input;
