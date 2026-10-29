import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Magnetic from "./Magnetic";

const links = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "WORK", href: "#work" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 200 && !open);
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 mix-blend-difference"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <a href="#home" className="font-display text-2xl tracking-wider text-white">
          AJZAL<span className="text-[#d7ff3e]">.</span>M
        </a>
        <Magnetic>
          <button
            onClick={() => setOpen(!open)}
            className="group flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-white/40"
            aria-label="Menu"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
              className="block h-0.5 w-5 bg-white"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
              className="block h-0.5 w-5 bg-white"
            />
          </button>
        </Magnetic>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#d7ff3e] px-8 md:px-24"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((link, i) => (
              <div key={link.label} className="overflow-hidden border-b border-black/10">
                <motion.a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-6 py-2"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  <span className="font-body text-sm font-bold text-black/50">0{i + 1}</span>
                  <span className="font-display text-5xl md:text-8xl text-black transition-transform duration-300 group-hover:translate-x-6 group-hover:italic">
                    {link.label}
                  </span>
                </motion.a>
              </div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-6 font-body text-sm font-bold text-black/70"
            >
              <span>INSTAGRAM ↗</span>
              <span>BEHANCE ↗</span>
              <span>LINKEDIN ↗</span>
              <span>YOUTUBE ↗</span>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
