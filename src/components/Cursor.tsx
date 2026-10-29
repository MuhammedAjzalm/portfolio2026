import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement).closest("a, button, [data-cursor]");
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute("data-cursor") || "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[99] pointer-events-none flex items-center justify-center rounded-full bg-[#d7ff3e] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 90 : hovering ? 56 : 14,
          height: label ? 90 : hovering ? 56 : 14,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {label && (
          <span className="font-display text-xs tracking-widest text-black mix-blend-normal">
            {label}
          </span>
        )}
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[98] pointer-events-none h-10 w-10 rounded-full border border-[#d7ff3e]/40"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovering ? 0 : 1 }}
      />
    </>
  );
}
