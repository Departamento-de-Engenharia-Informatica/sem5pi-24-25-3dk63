import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Floor } from "@/model/Floor";

import Alert from "../Alert";

interface ListFloorsProps {
  floors: Floor[] | null;
  buildingCode?: string;
}

const ANIMATION_DELAY = 0.1;

const ListFloors: React.FC<ListFloorsProps> = ({ floors, buildingCode }) => {
  if (!floors)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  const navigate = useNavigate();

  return (
    <>
      {floors.length ? (
        <div
          aria-label="floors-container"
          className="flex flex-col gap-8 overflow-auto rounded-xl bg-slate-300 px-6 py-6"
        >
          {floors.map((floor, i) => (
            <motion.button
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: ANIMATION_DELAY * i }}
              key={floor.code}
              onClick={() =>
                navigate(`/buildings/${buildingCode}/floors/${floor.code}`)
              }
              className="flex w-full items-center gap-x-10 bg-slate-200 px-12 py-8"
            >
              <h2 className="text-6xl font-bold">{floor.code}</h2>
              <div className="flex flex-col">
                <h3 className="text-left text-xl font-bold">
                  {floor.description}
                </h3>
                <div className="text-left text-sm text-slate-600">
                  {floor.dimensions.width} x {floor.dimensions.length}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <Alert
          type="warning"
          message="This building does not have any floor."
        />
      )}
    </>
  );
};

export default ListFloors;
