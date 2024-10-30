// Checkbox.tsx
interface CheckboxProps {
  isChecked: boolean;
  label: string;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked, onChange }) => {
  return (
    <label className="capitalize">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange} 
      />
      {label}
    </label>
  );
};

export default Checkbox;
