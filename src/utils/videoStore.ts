// IndexedDB-based video storage — supports large video files (hundreds of MB)

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  videoUrl: string;      // base64 data URL
  thumbnailUrl: string;  // base64 data URL
}

const DB_NAME = "fable5_db";
const DB_VERSION = 1;
const STORE_NAME = "videos";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getVideos(): Promise<VideoItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveVideos(videos: VideoItem[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const v of videos) {
      store.put(v);
    }
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("videosUpdated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function addVideo(video: VideoItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(video);
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("videosUpdated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => {
      window.dispatchEvent(new Event("videosUpdated"));
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}
