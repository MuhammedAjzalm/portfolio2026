import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 50, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(target);
  }, [inView, mv, target]);

  useMotionValueEvent(spring, "change", (v) => setDisplay(Math.round(v)));

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const statement =
  "I'm Ajzal — a digital marketer who speaks fluent design. I build brands that stop the scroll, cut videos that hold attention, and craft motion that makes people feel something. Strategy in one hand, creativity in the other.";

function RevealText() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });
  const words = statement.split(" ");

  return (
    <p ref={ref} className="flex flex-wrap gap-x-[0.3em] gap-y-1 font-body text-2xl font-medium leading-snug md:text-4xl">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} progress={scrollYProgress} range={[start, end]} word={word} />;
      })}
    </p>
  );
}

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const highlight = ["Ajzal", "scroll,", "attention,", "feel"].includes(word);
  return (
    <motion.span style={{ opacity }} className={highlight ? "text-[#d7ff3e]" : "text-white"}>
      {word}
    </motion.span>
  );
}

export default function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const stats = [
    { n: 50, suffix: "+", label: "PROJECTS DELIVERED" },
    { n: 30, suffix: "+", label: "HAPPY CLIENTS" },
    { n: 4, suffix: "+", label: "YEARS CREATING" },
    { n: 10, suffix: "M+", label: "VIEWS GENERATED" },
  ];

  return (
    <section id="about" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <h2 className="font-display text-sm tracking-[0.4em] text-[#d7ff3e]">( 01 — ABOUT )</h2>
          <span className="hidden font-body text-sm text-white/40 md:block">BASED IN INDIA · WORKING WORLDWIDE</span>
        </div>

        <div className="grid gap-16 md:grid-cols-5">
          <div className="md:col-span-3">
            <RevealText />
            <motion.a
              href="#contact"
              data-cursor="LET'S GO"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group mt-12 inline-flex items-center gap-4 font-display text-lg tracking-widest text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d7ff3e] text-black transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45">
                ↗
              </span>
              MORE ABOUT ME
            </motion.a>
          </div>

          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl md:col-span-2"
            data-cursor="HEY!"
          >
            <motion.img
              style={{ y, scale: 1.2 }}
              src="/images/about.jpg"
              alt="Ajzal at work"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-4 rotate-[-3deg] bg-[#d7ff3e] px-4 py-1 font-display text-sm tracking-wider text-black">
              IN THE LAB 🧪
            </div>
          </motion.div>
        </div>

        {/* stats */}
        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#0a0a0a] p-8 transition-colors duration-300 hover:bg-[#d7ff3e]"
            >
              <div className="font-display text-5xl text-[#d7ff3e] transition-colors duration-300 group-hover:text-black md:text-6xl">
                <Counter target={s.n} suffix={s.suffix} />
              </div>
              <div className="mt-2 font-body text-xs font-bold tracking-[0.25em] text-white/50 transition-colors duration-300 group-hover:text-black/70">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
