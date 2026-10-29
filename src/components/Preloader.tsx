import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["DIGITAL MARKETER", "VIDEO EDITOR", "MOTION DESIGNER", "AJZAL.M"];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (index < words.length - 1) {
      const t = setTimeout(() => setIndex((i) => i + 1), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setExit(true), 700);
    const t2 = setTimeout(onDone, 1500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [index, onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-[#d7ff3e]"
            initial={{ width: "0%" }}
            animate={{ width: `${((index + 1) / words.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`font-display text-4xl md:text-7xl tracking-wide ${
                index === words.length - 1 ? "text-[#d7ff3e]" : "text-white/80"
              }`}
            >
              {words[index]}
            </motion.h1>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
