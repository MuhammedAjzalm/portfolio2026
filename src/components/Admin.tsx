import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getVideos, saveVideos, addVideo, deleteVideo, type VideoItem } from "../utils/videoStore";

const ADMIN_PASSWORD = "1919";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function generateThumbnail(videoDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = videoDataUrl;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 1;
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 360;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    }, { once: true });
    video.addEventListener("error", () => {
      resolve("");
    }, { once: true });
    video.load();
  });
}

/* ──────────────── Login Screen ──────────────── */
function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPass("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-12 text-center">
          <a href="#home" onClick={() => { window.location.hash = "#home"; window.location.reload(); }} className="font-display text-3xl tracking-wider text-white">
            AJZAL<span className="text-[#d7ff3e]">.</span>M
          </a>
          <p className="mt-2 font-body text-xs tracking-[0.3em] text-white/30">ADMIN PANEL</p>
        </div>

        {/* Lock icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#d7ff3e]/20 bg-[#d7ff3e]/5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d7ff3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <label className="mb-2 block font-body text-xs font-bold tracking-[0.2em] text-white/50">
              ENTER PASSWORD
            </label>
            <input
              ref={inputRef}
              type="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-body text-lg text-white outline-none transition-all duration-300 focus:border-[#d7ff3e]/50 focus:ring-1 focus:ring-[#d7ff3e]/30 placeholder:text-white/20"
              placeholder="••••"
              autoComplete="off"
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 font-body text-xs text-red-400"
                >
                  Incorrect password. Try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-xl bg-[#d7ff3e] py-4 font-display text-sm tracking-[0.2em] text-black transition-all duration-300 hover:shadow-[0_0_40px_rgba(215,255,62,0.3)]"
          >
            <span className="relative z-10">UNLOCK</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }}
            className="font-body text-xs text-white/30 transition-colors hover:text-[#d7ff3e]"
          >
            ← Back to site
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────── Upload Modal ──────────────── */
function UploadModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (v: VideoItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Video Editing");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!videoFile || !title.trim()) return;
    setUploading(true);
    try {
      const videoDataUrl = await fileToDataUrl(videoFile);
      const thumbnailUrl = await generateThumbnail(videoDataUrl);
      const item: VideoItem = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title: title.trim(),
        category: category.trim(),
        videoUrl: videoDataUrl,
        thumbnailUrl,
      };
      onSave(item);
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-xl text-white">UPLOAD VIDEO</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${
              dragOver
                ? "border-[#d7ff3e] bg-[#d7ff3e]/5"
                : videoFile
                ? "border-[#d7ff3e]/30 bg-[#d7ff3e]/5"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {videoPreview ? (
              <div className="relative w-full" style={{ aspectRatio: "9/16", maxHeight: "200px" }}>
                <video
                  src={videoPreview}
                  className="mx-auto h-full rounded-lg object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <p className="font-body text-xs text-white/70">Click to change</p>
                </div>
              </div>
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d7ff3e" strokeWidth="1.5" className="mb-3 opacity-40">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <p className="font-body text-sm text-white/40">
                  Drop video here or <span className="text-[#d7ff3e]">browse</span>
                </p>
                <p className="mt-1 font-body text-[10px] text-white/20">MP4, MOV, WebM</p>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block font-body text-[10px] font-bold tracking-[0.2em] text-white/40">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white outline-none transition-all focus:border-[#d7ff3e]/40 placeholder:text-white/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block font-body text-[10px] font-bold tracking-[0.2em] text-white/40">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-body text-sm text-white outline-none transition-all focus:border-[#d7ff3e]/40"
            >
              <option value="Video Editing">Video Editing</option>
              <option value="Motion Graphics">Motion Graphics</option>
              <option value="Short Film">Short Film</option>
              <option value="Reel">Reel</option>
              <option value="Commercial">Commercial</option>
              <option value="Music Video">Music Video</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!videoFile || !title.trim() || uploading}
            className="w-full rounded-xl bg-[#d7ff3e] py-3.5 font-display text-sm tracking-[0.15em] text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(215,255,62,0.25)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {uploading ? "PROCESSING..." : "ADD TO GALLERY"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── Admin Dashboard ──────────────── */
function Dashboard() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadVideos = async () => {
    const stored = await getVideos();
    setVideos(stored);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSave = async (v: VideoItem) => {
    await addVideo(v);
    await loadVideos();
    setShowUpload(false);
  };

  const handleDelete = async (id: string) => {
    await deleteVideo(id);
    await loadVideos();
    setDeleteConfirm(null);
  };

  const handleReorder = async (from: number, dir: "up" | "down") => {
    const to = dir === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= videos.length) return;
    const arr = [...videos];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    setVideos(arr);
    await saveVideos(arr);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="font-display text-xl tracking-wider text-white">
              AJZAL<span className="text-[#d7ff3e]">.</span>M
            </span>
            <span className="ml-3 rounded-full bg-[#d7ff3e]/10 px-3 py-1 font-body text-[10px] font-bold tracking-wider text-[#d7ff3e]">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }}
              className="font-body text-xs text-white/40 hover:text-white transition-colors"
            >
              View Site ↗
            </a>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 rounded-xl bg-[#d7ff3e] px-5 py-2.5 font-display text-xs tracking-wider text-black transition-all hover:shadow-[0_0_30px_rgba(215,255,62,0.25)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              UPLOAD
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="font-body text-[10px] font-bold tracking-[0.2em] text-white/30">TOTAL VIDEOS</p>
            <p className="mt-2 font-display text-3xl text-white">{videos.length}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="font-body text-[10px] font-bold tracking-[0.2em] text-white/30">CATEGORIES</p>
            <p className="mt-2 font-display text-3xl text-white">
              {new Set(videos.map((v) => v.category)).size}
            </p>
          </div>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d7ff3e" strokeWidth="1" className="mb-4 opacity-30">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <path d="M10 8l6 4-6 4V8z" />
            </svg>
            <p className="font-body text-sm text-white/30">No videos yet</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 rounded-lg bg-[#d7ff3e]/10 px-4 py-2 font-body text-xs text-[#d7ff3e] transition-colors hover:bg-[#d7ff3e]/20"
            >
              Upload your first video
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {videos.map((video, i) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                  {/* Thumbnail */}
                  <div className="relative" style={{ aspectRatio: "9/16" }}>
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                    ) : (
                      <video src={video.videoUrl} className="h-full w-full object-cover" muted playsInline />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {i > 0 && (
                        <button
                          onClick={() => handleReorder(i, "up")}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      {i < videos.length - 1 && (
                        <button
                          onClick={() => handleReorder(i, "down")}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
                          title="Move right"
                        >
                          →
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(video.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-[#d7ff3e]/10 px-2.5 py-0.5 font-body text-[10px] font-bold tracking-wider text-[#d7ff3e]">
                      {video.category}
                    </span>
                    <h4 className="mt-2 truncate font-display text-sm text-white">{video.title}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSave={handleSave} />}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </div>
              <h4 className="font-display text-lg text-white">DELETE VIDEO?</h4>
              <p className="mt-2 font-body text-sm text-white/40">This action cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-white/10 py-3 font-display text-xs tracking-wider text-white/60 hover:bg-white/5"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 rounded-xl bg-red-500 py-3 font-display text-xs tracking-wider text-white hover:bg-red-600"
                >
                  DELETE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────── Main Admin Export ──────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState(false);

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;
  return <Dashboard />;
}
