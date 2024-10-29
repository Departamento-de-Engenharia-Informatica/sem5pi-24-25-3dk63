interface CheckboxProps {
  label: string;
  isChecked: boolean;
  // onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked }) => {
  return (
    <label className="capitalize">
      <input type="checkbox" checked={isChecked} />
      {label}
    </label>
  );
};

export default Checkbox;
