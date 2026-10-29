import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const projects = [
  {
    title: "VELOCITY LAUNCH FILM",
    category: "VIDEO EDITING",
    year: "2025",
    img: "/images/work-video.jpg",
    stat: "2.4M VIEWS",
  },
  {
    title: "NEON PULSE IDENT",
    category: "MOTION GRAPHICS",
    year: "2025",
    img: "/images/work-motion.jpg",
    stat: "AWARD SHORTLIST",
  },
  {
    title: "APEX BRAND SYSTEM",
    category: "GRAPHIC DESIGN",
    year: "2024",
    img: "/images/work-brand.jpg",
    stat: "FULL REBRAND",
  },
  {
    title: "GROWTH ENGINE CAMPAIGN",
    category: "DIGITAL MARKETING",
    year: "2024",
    img: "/images/work-social.jpg",
    stat: "+340% REACH",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({
      x: ((e.clientY - rect.top) / rect.height - 0.5) * -6,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 6,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.12 }}
      className={index % 2 === 1 ? "md:mt-28" : ""}
    >
      <div
        ref={ref}
        data-cursor="VIEW ↗"
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="group"
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="aspect-[4/3] overflow-hidden">
            <motion.img
              style={{ y: yImg, scale: 1.25 }}
              src={project.img}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.35]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute left-4 top-4 rotate-[-3deg] rounded-full bg-[#d7ff3e] px-4 py-1 font-display text-xs tracking-wider text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-[3deg]">
            {project.stat}
          </div>
          <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-body text-xs font-bold tracking-[0.3em] text-[#d7ff3e]">
              {project.category}
            </span>
          </div>
        </motion.div>

        <div className="mt-5 flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <h3 className="font-display text-2xl text-white transition-colors duration-300 group-hover:text-[#d7ff3e] md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-1 font-body text-xs font-bold tracking-[0.25em] text-white/40">
              {project.category}
            </p>
          </div>
          <span className="font-display text-lg text-white/30">{project.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Works() {
  return (
    <section id="work" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mb-6 font-display text-sm tracking-[0.4em] text-[#d7ff3e]">( 03 — SELECTED WORK )</h2>
            <h3 className="font-display text-5xl leading-[0.9] text-white md:text-8xl">
              STUFF THAT
              <br />
              <span className="text-stroke">PERFORMS.</span>
            </h3>
          </div>
          <p className="max-w-xs font-body text-sm text-white/50">
            Not just pretty pixels — every project is built to convert, engage, and grow. Numbers don't lie.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-x-14">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="#contact"
            data-cursor="GO"
            className="group relative overflow-hidden rounded-full border border-[#d7ff3e] px-10 py-5 font-display text-lg tracking-widest text-[#d7ff3e]"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#d7ff3e] transition-transform duration-300 group-hover:scale-y-100" />
            <span className="relative transition-colors duration-300 group-hover:text-black">
              WANT RESULTS LIKE THESE? →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
