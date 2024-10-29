interface InputGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  bgAlt?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  title,
  description,
  bgAlt,
  children,
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 ml-1 text-slate-500">
        <p className="-mb-1 font-bold ">{title}</p>
        <p className="text-sm ">{description}</p>
      </div>
      <div
        className={`relative flex w-full flex-col items-center gap-4 rounded-lg md:flex-row ${
          bgAlt ? `bg-slate-100/50` : `bg-slate-200/50`
        } p-5 shadow-sm`}
      >
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
