import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Marquee from "./Marquee";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const navLinks = [
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "WORK", href: "#work" },
  { label: "CONTACT", href: "#contact" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const yPortrait = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const { innerWidth } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 16);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMouse}
      className="hero-section relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0a0a] pt-20"
    >
      {/* ── cinematic background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[-24%] h-[78vh] w-[100vw] -translate-x-1/2 rounded-full bg-[#d7ff3e]/[0.045] blur-[150px]" />
        <div className="absolute right-[-12%] top-[18%] h-[58vh] w-[44vw] rounded-full bg-[#d7ff3e]/[0.03] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_24%,rgba(0,0,0,0.76)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1560px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
        {/* ── reference-style nav row ── */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
          aria-label="Sections"
          className="mx-auto hidden w-full max-w-[1000px] items-center justify-between lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55 transition-colors duration-300 hover:text-[#d7ff3e]"
            >
              <span className="h-1 w-1 rounded-full bg-[#d7ff3e]/0 transition-colors duration-300 group-hover:bg-[#d7ff3e]" />
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* ── giant greeting ── */}
        <motion.div
          style={{ y: yTitle }}
          className="relative z-20 mt-4"
        >
          <h1
            aria-label="Hi, I'm Ajzal M"
            className="hero-headline text-center font-display text-[clamp(2.9rem,14vw,18rem)] tracking-[-0.045em] text-white"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span
                initial={{ y: "106%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45, duration: 1, ease: EASE }}
                className="block whitespace-nowrap"
              >
                HI, I'M AJZAL<span className="text-stroke">.M</span>
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* ── portrait + side copy ── */}
        <div className="relative flex flex-1 flex-col justify-center lg:block">
          <motion.div
            style={{ y: yPortrait, x: sx }}
            initial={{ opacity: 0, scale: 0.965 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.1, ease: EASE }}
            className="hero-portrait pointer-events-none relative z-30 mx-auto -mt-[4vw] w-[88%] max-w-[360px] sm:w-[66%] sm:max-w-[460px] lg:-mt-[12vh] lg:max-w-[1100px]"
          >
            {/* ambient light + ground shadow */}
            <div className="absolute left-1/2 top-1/2 h-[94%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d7ff3e]/[0.06] blur-[60px]" />
            <div className="absolute bottom-[7%] left-1/2 h-[9%] w-[58%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl" />
            <img
              src="/images/hero.png"
              alt="Ajzal M"
              draggable={false}
              className="relative block w-full select-none"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, #000 8%), linear-gradient(to bottom, #000 87%, transparent 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, #000 8%), linear-gradient(to bottom, #000 87%, transparent 100%)",
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
                filter: "contrast(1.05) saturate(0.94) brightness(0.97)",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
            className="hero-lower relative z-40 mt-8 flex w-full flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:items-end sm:justify-between lg:absolute lg:inset-x-0 lg:top-[35%] lg:mt-0 lg:items-start lg:gap-0 lg:pb-0"
          >
            <div className="hero-copy max-w-[240px] sm:max-w-[260px] lg:max-w-[200px] xl:max-w-[300px]">
              <p className="hero-availability mb-3 flex items-center gap-2 font-body text-[8px] font-semibold uppercase tracking-[0.2em] text-[#d7ff3e] sm:text-[9px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3e] shadow-[0_0_10px_2px_rgba(215,255,62,0.45)]" />
                AVAILABLE FOR WORK
              </p>
              <p className="font-body text-[9px] font-medium uppercase leading-[1.8] tracking-[0.14em] text-white/60 sm:text-[10px] sm:leading-[1.7] lg:text-[10.5px] xl:text-[11px]">
                A digital marketer &amp; creative designer passionate about
                crafting bold, memorable projects{" "}
                <span className="text-[#d7ff3e]">✦</span>
              </p>
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex shrink-0 items-center gap-2 self-end rounded-full bg-[linear-gradient(100deg,#d7ff3e_0%,#ecff9a_46%,#b6e600_100%)] px-5 py-3 font-display text-[10px] tracking-[0.18em] text-black shadow-[0_0_36px_rgba(215,255,62,0.22)] sm:self-auto sm:px-6 sm:py-3.5 xl:px-7 xl:py-4 xl:text-[11px]"
            >
              CONTACT ME
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M2.5 9.5 9.5 2.5" />
                <path d="M4 2.5h5.5V8" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── lime loop ticker ── */}
      <motion.div
        initial={{ y: 64 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: EASE }}
        className="relative z-40 mt-4 shrink-0 border-y-2 border-[#d7ff3e] bg-[#d7ff3e] py-3"
      >
        <Marquee
          items={[
            "MOTION GRAPHICS",
            "GRAPHIC DESIGN",
            "SHORT FORM REELS",
            "DIGITAL MARKETING",
            "VIDEO EDITING",
          ]}
          className="font-display text-xl text-black md:text-3xl"
          starClass="text-black"
        />
      </motion.div>
    </section>
  );
}
