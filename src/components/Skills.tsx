import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Marquee from "./Marquee";

const skills = [
  {
    title: "DIGITAL MARKETING",
    tags: "SEO · PAID ADS · SOCIAL STRATEGY · ANALYTICS",
    img: "/images/work-social.jpg",
  },
  {
    title: "VIDEO EDITING",
    tags: "REELS · COMMERCIALS · YOUTUBE · COLOR GRADING",
    img: "/images/work-video.jpg",
  },
  {
    title: "MOTION GRAPHICS",
    tags: "LOGO ANIMATION · 3D · KINETIC TYPE · VFX",
    img: "/images/work-motion.jpg",
  },
  {
    title: "GRAPHIC DESIGN",
    tags: "BRANDING · POSTERS · SOCIAL CREATIVES · UI",
    img: "/images/work-brand.jpg",
  },
];

export default function Skills() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section id="skills" className="relative py-28 md:py-40">
      <div className="px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 font-display text-sm tracking-[0.4em] text-[#d7ff3e]">( 02 — WHAT I DO )</h2>
          <p className="mb-16 max-w-xl font-body text-white/50">
            Four weapons. One mission — make your brand impossible to ignore. Hover to see.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
        className="relative border-t border-white/10"
      >
        {/* floating preview */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              className="pointer-events-none absolute z-30 hidden h-64 w-96 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl md:block"
              style={{ left: sx, top: sy }}
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: -4 }}
              exit={{ scale: 0, rotate: 8 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={active}
                  src={skills[active].img}
                  alt=""
                  className="h-full w-full object-cover"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {skills.map((skill, i) => (
          <motion.div
            key={skill.title}
            onMouseEnter={() => setActive(i)}
            data-cursor="VIEW"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden border-b border-white/10"
          >
            {/* yellow sweep */}
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3e] transition-transform duration-400 ease-out group-hover:scale-y-100" />

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-2 px-6 py-10 transition-colors duration-300 md:flex-row md:items-center md:justify-between md:px-12 md:py-14">
              <div className="flex items-baseline gap-6">
                <span className="font-body text-sm font-bold text-[#d7ff3e] group-hover:text-black/50">
                  0{i + 1}
                </span>
                <h3 className="font-display text-4xl text-white transition-all duration-300 group-hover:translate-x-4 group-hover:text-black md:text-7xl">
                  {skill.title}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-body text-xs font-bold tracking-widest text-white/40 group-hover:text-black/60 md:text-sm">
                  {skill.tags}
                </span>
                <span className="hidden font-display text-3xl text-white transition-transform duration-300 group-hover:rotate-45 group-hover:text-black md:block">
                  ↗
                </span>
              </div>
            </div>

            {/* mobile image */}
            <div className="relative z-10 px-6 pb-8 md:hidden">
              <img src={skill.img} alt={skill.title} className="h-44 w-full rounded-lg object-cover" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 rotate-1 border-y border-white/15 py-4">
        <Marquee
          items={["PREMIERE PRO", "AFTER EFFECTS", "PHOTOSHOP", "ILLUSTRATOR", "DAVINCI RESOLVE", "META ADS", "GOOGLE ADS", "FIGMA", "BLENDER"]}
          speed="animate-marquee-reverse"
          outline
          className="font-display text-2xl md:text-4xl"
        />
      </div>
    </section>
  );
}
