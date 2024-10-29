import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface FloorMapVisualizerProps {
  map: number[][];
  floorCode: string;
}

const FloorMapVisualizer: React.FC<FloorMapVisualizerProps> = ({
  map,
  floorCode,
}) => {
  const [activeCell, setActiveCell] = useState<number[]>([-1, -1]);

  if (map.length === 0)
    return (
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
    );

  return (
    <div className="my-8 h-full w-full">
      <div className="flex h-8 items-center justify-center">
        {Array.from(Array(map[0].length + 1).keys()).map((i) => (
          <div
            key={i.toString()}
            className="flex h-10 w-10 items-center justify-center text-xl font-bold"
          >
            {i !== 0 && i}
          </div>
        ))}
      </div>
      {map.map((row, i) => (
        <div
          key={row.toString()}
          className="flex h-10 items-center justify-center"
        >
          <div className="flex h-10 w-10 items-center justify-center text-xl font-bold">
            {i + 1}
          </div>
          {row.map((cell, j) => (
            <div
              key={cell.toString()}
              className={`relative flex h-10 w-10 select-none items-center justify-center border border-slate-400 text-xl font-bold ${
                cell === 1 || cell === 2 || cell === 3
                  ? "bg-gray-800 hover:bg-slate-900"
                  : i === map.length - 1 && j === row.length - 1
                  ? "bg-gray-800 hover:bg-slate-900"
                  : "bg-gray-200 hover:bg-slate-300"
              }`}
              onMouseOver={() => setActiveCell([j, i])}
              onMouseLeave={() => setActiveCell([-1, -1])}
              onClick={() => {
                navigator.clipboard.writeText(
                  `cel(${floorCode},${i + 1},${j + 1})`
                );
                toast.success("Coordinates copied to clipboard!", {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  autoClose: 2000,
                });
              }}
            >
              {cell === 4 || cell === 5
                ? "E"
                : cell === 11 || cell === 12
                ? "D"
                : ""}
              {activeCell[0] === j && activeCell[1] === i && (
                <div className="absolute -top-10 left-1/2 flex h-8 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-slate-300">
                  {i + 1}, {j + 1}
                </div>
              )}
            </div>
          ))}
          <ToastContainer />
        </div>
      ))}
    </div>
  );
};

export default FloorMapVisualizer;
