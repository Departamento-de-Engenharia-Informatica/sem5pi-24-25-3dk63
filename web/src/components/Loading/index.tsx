import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { RepeatIcon } from "@/styles/Icons";
import "react-loading-skeleton/dist/skeleton.css";
import React from 'react';

interface LoadingProps {
  loadingText?: boolean;
  loading?: boolean; // Adiciona controle de carregamento explícito
}

const Loading: React.FC<LoadingProps> = ({ loadingText = true, loading = true }) => {
  return (
    <div className="mt-6 w-full pr-8">
      {loading && (
        <>
          {loadingText && (
            <h1 className="flex w-full items-center justify-center text-center text-4xl font-bold text-[#284b62]">
              Loading
              <div className="flex justify-start ml-2">
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
              <RepeatIcon className="ml-4 h-8 w-8 animate-spin text-[#284b62]" />
            </h1>
          )}
          <Skeleton className="mt-8 h-28 w-full bg-[#e0e0e0] dark:bg-slate-700/50" count={4} />
        </>
      )}
    </div>
  );
};

export default Loading;
