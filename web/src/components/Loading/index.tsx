import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

import { RepeatIcon } from "@/styles/Icons";

import "react-loading-skeleton/dist/skeleton.css";

interface LoadingProps {
  loadingText?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loadingText = true }) => {
  return (
    <div className="mt-6 w-full pr-8">
      {loadingText && (
        <h1 className="flex w-full items-center justify-center text-center text-4xl font-bold">
          Loading
          <div className="flex justify-start">
            <motion.span
              animate={{ translateY: [-5, 0, -5] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                repeatType: "loop",
              }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ translateY: [-5, 0, -5] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                repeatType: "loop",
                delay: 0.2,
              }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ translateY: [-5, 0, -5] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                repeatType: "loop",
                delay: 0.4,
              }}
            >
              .
            </motion.span>
          </div>
          <RepeatIcon className="ml-4 h-8 w-8 animate-spin" />
        </h1>
      )}
      <Skeleton className="mt-8 h-28 w-full" count={4} />
    </div>
  );
};

export default Loading;
