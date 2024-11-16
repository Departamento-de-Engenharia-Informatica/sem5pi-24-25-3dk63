import React from 'react';

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
      <div className="mb-2 ml-1 text-slate-500 dark:text-slate-300">
        <p className="-mb-1 font-bold ">{title}</p>
        <p className="text-sm ">{description}</p>
      </div>
      <div
        className={`relative flex w-full flex-col items-center gap-4 rounded-lg md:flex-row p-5 shadow-sm ${
          bgAlt
            ? `bg-slate-100/50 dark:bg-slate-700/50`
            : `bg-slate-200/50 dark:bg-slate-800/50`
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
