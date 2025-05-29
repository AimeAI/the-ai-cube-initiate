import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MythTechTheme } from '@/styles/theme';
import { MythButton } from './MythButton';

interface MythProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  progress?: number; // Optional progress value (0-100)
  layoutId?: string; // For fluid transitions
}

export const MythProgressModal: React.FC<MythProgressModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  progress,
  layoutId = "myth-progress-modal", // Default layoutId
}) => {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      y: "-100vh",
      opacity: 0,
      scale: 0.7,
    },
    visible: {
      y: "0",
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      scale: 0.7,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-myth-background/80 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            layoutId={layoutId}
            className="bg-myth-surface border border-myth-accent/30 rounded-xl shadow-glow p-6 sm:p-8 w-full max-w-md m-4 text-myth-textPrimary"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-orbitron uppercase text-myth-accent">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-myth-textSecondary hover:text-myth-accent transition-colors"
                aria-label="Close modal"
              >
                <X size={28} />
              </button>
            </div>

            {message && (
              <p className="text-myth-textSecondary mb-4 text-sm sm:text-base">{message}</p>
            )}

            {typeof progress === 'number' && (
              <div className="w-full bg-myth-border/20 rounded-full h-3 sm:h-4 my-4 overflow-hidden border border-myth-accent/20">
                <motion.div
                  className="bg-gradient-to-r from-myth-secondary to-myth-accent h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <MythButton
                label="Close"
                onClick={onClose}
                className="bg-myth-surface hover:bg-myth-border text-myth-textSecondary border border-myth-accent/50 hover:shadow-myth-accent/30"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};