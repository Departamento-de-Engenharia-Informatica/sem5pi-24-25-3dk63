import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { FaStethoscope } from "react-icons/fa"; // Importando o ícone de estetoscópio
import "react-loading-skeleton/dist/skeleton.css";
import React from "react";

interface LoadingProps {
  loadingText?: boolean;
  loading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loadingText = true, loading = true }) => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col space-y-6">
      {loading && (
        <>
          {loadingText && (
            <div className="flex items-center text-center space-x-3 text-3xl font-semibold text-primary dark:text-primary-light">
              <span>Loading</span>
              <div className="flex space-x-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    repeatType: "loop",
                  }}
                  className="text-primary dark:text-primary-light"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    repeatType: "loop",
                    delay: 0.2,
                  }}
                  className="text-primary dark:text-primary-light"
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    repeatType: "loop",
                    delay: 0.4,
                  }}
                  className="text-primary dark:text-primary-light"
                >
                  .
                </motion.span>
              </div>
            </div>
          )}

          {/* Skeleton para placeholders */}
          <Skeleton
            className="w-full h-16 bg-gradient-to-r from-primary/20 to-primary/60 dark:from-primary-light/20 dark:to-primary-light/60 rounded-full shadow-lg"
            count={3}
          />

          {/* Ícone de Estetoscópio personalizado */}
          <div className="flex justify-center mt-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "loop",
              }}
              className="text-primary dark:text-primary-light"
            >
              <FaStethoscope className="h-12 w-12" />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Loading;
