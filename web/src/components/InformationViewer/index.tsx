import React from 'react';
import Modal from '@/components/Modal';
import { motion } from 'framer-motion';

interface InformationViewerModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  items: { label: string; value: string }[];
}

const InformationViewerModal: React.FC<InformationViewerModalProps> = ({ 
  isVisible, 
  setIsVisible, 
  title,
  items
}) => {
  return (
    <Modal 
      isVisible={isVisible} 
      setIsVisible={setIsVisible} 
      title={title}
    >
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">No details found.</p>
        ) : (
          items.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100 p-3 rounded-md border border-gray-200"
            >
              <div className="flex justify-between">
                <p className="font-semibold text-sm text-gray-700">{item.label}</p>
                <p>{item.value}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default InformationViewerModal;