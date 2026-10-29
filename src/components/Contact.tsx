import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden pt-28 md:pt-40">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#d7ff3e]/10 blur-[120px]" />

      <div className="-rotate-1 border-y border-white/15 py-4">
        <Marquee
          items={["LET'S WORK TOGETHER", "GOT A PROJECT?", "LET'S TALK"]}
          speed="animate-marquee-slow"
          outline
          className="font-display text-3xl md:text-5xl"
        />
      </div>

      <motion.div style={{ y, scale }} className="relative z-10 px-6 py-24 text-center md:py-36">
        <p className="mb-6 font-body text-sm font-bold tracking-[0.4em] text-[#d7ff3e]">
          ( 04 — CONTACT )
        </p>
        <h2 className="font-display leading-[0.85]">
          <span className="block text-[clamp(3rem,11vw,10rem)] text-white">LET'S MAKE</span>
          <span className="text-stroke block text-[clamp(3rem,11vw,10rem)]">SOMETHING</span>
          <span className="block text-[clamp(3rem,11vw,10rem)] text-[#d7ff3e]">LOUD.</span>
        </h2>

        <div className="mt-16 flex flex-col items-center gap-8">
          <Magnetic strength={0.4}>
            <a
              href="mailto:hello@ajzal.com"
              data-cursor="SAY HI"
              className="group relative flex h-44 w-44 items-center justify-center rounded-full bg-[#d7ff3e] md:h-56 md:w-56"
            >
              <span className="absolute inset-0 rounded-full bg-[#d7ff3e] transition-transform duration-500 group-hover:scale-110" />
              <span className="relative font-display text-xl tracking-wider text-black md:text-2xl">
                HIRE ME ↗
              </span>
            </a>
          </Magnetic>
          <a
            href="mailto:hello@ajzal.com"
            className="font-body text-lg font-medium text-white/60 underline decoration-[#d7ff3e] underline-offset-8 transition-colors hover:text-[#d7ff3e] md:text-2xl"
          >
            hello@ajzal.com
          </a>
        </div>
      </motion.div>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <span className="font-display text-xl tracking-wider text-white">
            AJZAL<span className="text-[#d7ff3e]">.</span>M
          </span>
          <div className="flex flex-wrap justify-center gap-6 font-body text-xs font-bold tracking-widest text-white/50">
            {["INSTAGRAM", "BEHANCE", "LINKEDIN", "YOUTUBE"].map((s) => (
              <a key={s} href="#" className="transition-colors hover:text-[#d7ff3e]">
                {s} ↗
              </a>
            ))}
          </div>
          <span className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} AJZAL.M — MADE TO BE SEEN
          </span>
        </div>
      </footer>
    </section>
  );
}
