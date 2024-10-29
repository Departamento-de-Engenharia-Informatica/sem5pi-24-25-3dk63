interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLSelectElement>;
  options: { code: string; name: string }[];
  selected?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  placeholder,
  className,
  disabled,
  inputRef,
  options,
  selected,
  ...rest
}) => {
  const selectList = options.map((option, index) => (
    <option key={index} value={option.code}>
      {option.name}
    </option>
  ));

  return (
    <div className={`flex flex-col gap-y-1 ${className}`}>
      <label className="ml-1 font-bold text-slate-500" htmlFor={name}>
        {name}
      </label>
      <select
        name={name}
        id={name}
        disabled={disabled}
        placeholder={placeholder}
        ref={inputRef}
        defaultValue={selected ? selected : ""}
        key={`${options.length}-${selected}`}
        className={`w-full rounded-lg border border-slate-500 bg-slate-100 px-4 py-2.5 text-left disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${className}`}
        {...rest}
      >
        <option value="" disabled>
          Select an option...
        </option>
        {selectList}
      </select>
    </div>
  );
};

export default Dropdown;
