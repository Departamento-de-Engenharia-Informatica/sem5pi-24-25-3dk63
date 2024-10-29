import { motion } from "framer-motion";

import { Room } from "@/model/Room";

import Alert from "../Alert";

interface ListRoomsProps {
  rooms: Room[] | null;
}

const ListRooms: React.FC<ListRoomsProps> = ({ rooms }) => {
  const ANIMATION_DELAY = 0.1;

  if (!rooms)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return (
    <>
      {rooms.length ? (
        <div className="flex w-full flex-col gap-8 rounded-xl bg-slate-300 px-6 py-6">
          {rooms.map((room, i) => (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: ANIMATION_DELAY * i }}
              key={room.name}
              className="flex w-full items-center gap-x-10 bg-slate-200 px-12 py-8"
            >
              <h2 className="text-5xl font-bold">{room.name}</h2>
              <div className="flex flex-col">
                <h3 className="text-left text-xl font-bold">
                  {room.description}
                </h3>
                <div className="text-left text-sm text-slate-600">
                  {room.dimensions.length} x {room.dimensions.width}
                  <span>&nbsp;&middot; {room.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Alert type="warning" message="This floor does not have any room." />
      )}
    </>
  );
};

export default ListRooms;
