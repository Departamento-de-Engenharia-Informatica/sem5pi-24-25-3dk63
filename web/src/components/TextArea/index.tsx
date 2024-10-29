interface TextAreaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  rows?: number;
  name?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  description,
  className,
  disabled,
  inputRef,
  defaultValue,
  rows = 5,
  name,
}) => {
  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <label htmlFor={placeholder} className="ml-1 font-bold text-slate-500">
        {placeholder}
      </label>
      <p className="-mt-2 mb-1 ml-1 text-sm text-slate-500">{description}</p>
      <textarea
        disabled={disabled}
        className={`h-28 max-h-64 min-h-[80px] w-full resize-y rounded-lg border border-slate-500 bg-slate-100 px-4 py-2.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${className}`}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        name={name || placeholder}
        aria-label={name}
        maxLength={255}
        rows={rows}
        onChange={(e) => onChange && onChange(e.target.value)}
        ref={inputRef}
      />
    </div>
  );
};

export default TextArea;
