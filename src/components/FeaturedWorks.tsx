import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getVideos, type VideoItem } from "../utils/videoStore";

export default function FeaturedWorks() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadVideos = async () => {
    const stored = await getVideos();
    setVideos(stored);
  };

  useEffect(() => {
    loadVideos();

    const handler = () => { loadVideos(); };
    window.addEventListener("videosUpdated", handler);
    return () => {
      window.removeEventListener("videosUpdated", handler);
    };
  }, []);

  useEffect(() => {
    if (videos.length > 0 && activeIndex >= videos.length) {
      setActiveIndex(0);
    }
  }, [videos, activeIndex]);

  const goTo = (i: number) => {
    if (videos.length === 0) return;
    const idx = ((i % videos.length) + videos.length) % videos.length;
    setActiveIndex(idx);
    setPlayingId(null);
    videoRefs.current.forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  };

  const togglePlay = (id: string) => {
    const vid = videoRefs.current.get(id);
    if (!vid) return;
    if (playingId === id) {
      vid.pause();
      setPlayingId(null);
    } else {
      videoRefs.current.forEach((v, key) => {
        if (key !== id) {
          v.pause();
          v.currentTime = 0;
        }
      });
      vid.play();
      setPlayingId(id);
    }
  };

  if (videos.length === 0) {
    return (
      <section id="work" className="relative px-6 py-28 md:px-12 md:py-40">
        <div className="mx-auto max-w-7xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-4 font-display text-sm tracking-[0.4em] text-[#d7ff3e]"
          >
            ( 03 — FEATURED WORKS )
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl leading-[0.95] text-white md:text-8xl"
          >
            FEATURED
            <br />
            <span className="text-stroke">WORKS</span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-10 max-w-md font-body text-base text-white/40"
          >
            No videos uploaded yet. Check back soon for amazing short-form content.
          </motion.p>
        </div>
      </section>
    );
  }

  const getVisibleIndices = () => {
    if (videos.length === 1) return [0];
    if (videos.length === 2) return [0, 1];
    const prev = ((activeIndex - 1) + videos.length) % videos.length;
    const next = (activeIndex + 1) % videos.length;
    return [prev, activeIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section id="work" className="relative overflow-hidden px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-4 font-display text-sm tracking-[0.4em] text-[#d7ff3e]"
          >
            ( 03 — FEATURED WORKS )
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl leading-[0.95] text-white md:text-8xl"
          >
            FEATURED
            <br />
            <span className="text-stroke">WORKS</span>
          </motion.h3>
        </div>

        {/* Carousel */}
        <div className="relative" ref={scrollRef}>
          {/* Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7ff3e]/40 text-[#d7ff3e] transition-all duration-300 hover:bg-[#d7ff3e] hover:text-black md:-left-2"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7ff3e]/40 text-[#d7ff3e] transition-all duration-300 hover:bg-[#d7ff3e] hover:text-black md:-right-2"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="flex items-center justify-center gap-4 md:gap-8 px-14">
            <AnimatePresence mode="popLayout">
              {visibleIndices.map((vi) => {
                const video = videos[vi];
                const isCenter = vi === activeIndex;
                return (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.4,
                      scale: isCenter ? 1 : 0.82,
                      filter: isCenter ? "blur(0px)" : "blur(2px)",
                    }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 280, damping: 30 }}
                    className={`relative flex-shrink-0 overflow-hidden rounded-2xl ${
                      isCenter
                        ? "w-[280px] md:w-[400px] z-20 cursor-pointer"
                        : "hidden md:block w-[240px] md:w-[300px] z-10 pointer-events-none"
                    }`}
                    onClick={() => isCenter && togglePlay(video.id)}
                    style={{ aspectRatio: "9/16" }}
                  >
                    {/* Video */}
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current.set(video.id, el);
                      }}
                      src={video.videoUrl}
                      poster={video.thumbnailUrl || undefined}
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                      onEnded={() => setPlayingId(null)}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Play/Pause button */}
                    {isCenter && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: playingId === video.id ? 0 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30"
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </motion.div>
                      </div>
                    )}

                    {/* Category badge & title */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="inline-block rounded-full bg-[#d7ff3e] px-3 py-1 font-display text-[10px] tracking-wider text-black">
                        {video.category}
                      </span>
                      <h4 className="mt-2 font-display text-lg text-white md:text-xl">
                        {video.title}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          {videos.length > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-[#d7ff3e]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to video ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
