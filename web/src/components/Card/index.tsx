import { useNavigate } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  link: string;
  action: string;
}

const Card: React.FC<CardProps> = ({ title, description, link, action }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-40 w-[26rem] flex-col justify-between gap-y-4 rounded-lg border-slate-300 bg-slate-100 px-6 py-4 shadow-md">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="font-archivo">{description}</p>
      </div>
      <button
        onClick={() => {
          navigate(link);
        }}
        className="w-fit self-end font-bold text-slate-500 hover:brightness-90"
      >
        {action}
      </button>
    </div>
  );
};

export default Card;
