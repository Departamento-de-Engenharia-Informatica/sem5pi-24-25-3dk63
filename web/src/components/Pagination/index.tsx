interface PaginationProps {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  changePage: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  changePage,
  className,
}) => {
  if (!meta || !meta.total || meta.totalPages == 1) return null;

  return (
    <div className={`flex items-center justify-center gap-x-4 ${className}`}>
      <button
        disabled={meta.page === 1}
        onClick={() => changePage(meta.page - 1)}
        className="flex h-10 w-10 items-start justify-center rounded-md bg-slate-500 text-2xl font-bold text-white opacity-90 hover:bg-slate-600 disabled:opacity-20 disabled:hover:bg-slate-500"
      >
        <span>←</span>
      </button>

      {Array(meta.totalPages)
        .fill(0)
        .map((_, i) => (
          <button
            key={i + 1}
            onClick={() => changePage(i + 1)}
            className={`flex h-10 w-10 items-center justify-center rounded-md ${
              meta.page === i + 1
                ? "bg-primary text-white opacity-80"
                : "bg-white text-slate-500 hover:bg-slate-200"
            }`}
          >
            <span>{i + 1}</span>
          </button>
        ))}

      <button
        disabled={meta.page === meta.totalPages}
        onClick={() => {
          changePage(meta.page + 1);
        }}
        className="flex h-10 w-10 items-start justify-center rounded-md bg-slate-500 text-2xl font-bold text-white opacity-90 hover:bg-slate-600 disabled:opacity-20 disabled:hover:bg-slate-500"
      >
        <span>→</span>
      </button>
    </div>
  );
};

export default Pagination;
