"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatButtonProps {
  onClick: () => void;
  hasMessages: boolean;
}

export default function ChatButton({ onClick, hasMessages }: ChatButtonProps) {
  return (
    <motion.div
      className="fixed bottom-24 right-6 z-30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onClick}
        className="h-14 w-14 rounded-full bg-[#f8a4a9] hover:bg-[#f68e94] text-white shadow-lg flex items-center justify-center p-0 relative"
      >
        <MessageSquare size={24} />
        {hasMessages && (
          <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></span>
        )}
      </Button>
    </motion.div>
  );
}
