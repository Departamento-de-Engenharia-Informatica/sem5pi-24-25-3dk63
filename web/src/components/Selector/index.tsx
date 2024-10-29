interface SelectorProps {
  items: { name: string; selected: boolean }[];
  setItems: React.Dispatch<
    React.SetStateAction<{ name: string; selected: boolean }[]>
  >;
  additionalText?: string;
  activeClassName?: string;
  title?: string;
  disabled?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  items,
  setItems,
  additionalText,
  title,
  disabled,
  activeClassName = "bg-secondary",
}) => {
  function sanitizeName(name: string) {
    return name.replace("_", " ");
  }

  return (
    <div className="flex flex-col">
      <h2 className="my-4 ml-1 text-2xl font-bold">{title}</h2>

      <div className="flex flex-col gap-y-4">
        {items.map((item) => (
          <button
            key={item.name}
            name={item.name}
            disabled={disabled}
            className={`relative flex items-center justify-center gap-x-4 text-center text-xl font-bold capitalize disabled:cursor-not-allowed disabled:bg-slate-300 ${
              !disabled && "hover:brightness-90"
            }
          ${
            item.selected ? activeClassName : "bg-slate-200"
          } w-full rounded-md py-2`}
            onClick={() => {
              setItems(
                items.map((item_) =>
                  item_.name === item.name
                    ? { ...item_, selected: !item_.selected }
                    : item_
                )
              );
            }}
          >
            {additionalText}
            {sanitizeName(item.name)}
            <span>{item.selected ? "✅" : "❌"}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;
