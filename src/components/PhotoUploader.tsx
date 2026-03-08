"use client";

import { useState, useRef, useCallback } from "react";

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.8;

interface PhotoItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
  url: string | null;
  error: string | null;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function PhotoUploader({
  photos,
  onChange,
  onUpload,
}: {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[] | ((prev: PhotoItem[]) => PhotoItem[])) => void;
  onUpload: (file: Blob, filename: string, onProgress: (pct: number) => void) => Promise<string>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = MAX_PHOTOS - photos.length;
      const toAdd = Array.from(files).slice(0, remaining);
      const newPhotos: PhotoItem[] = [];

      for (const file of toAdd) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          newPhotos.push({
            id: crypto.randomUUID(),
            file,
            preview: "",
            progress: 0,
            uploaded: false,
            url: null,
            error: `Unsupported format: ${file.type.split("/")[1] || "unknown"}. Use JPG, PNG, or WebP.`,
          });
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          newPhotos.push({
            id: crypto.randomUUID(),
            file,
            preview: "",
            progress: 0,
            uploaded: false,
            url: null,
            error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 10MB.`,
          });
          continue;
        }
        newPhotos.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          uploaded: false,
          url: null,
          error: null,
        });
      }

      const updated = [...photos, ...newPhotos];
      onChange(updated);

      // Auto-upload valid new photos
      for (const photo of newPhotos) {
        if (photo.error) continue;
        try {
          const compressed = await compressImage(photo.file);
          const filename = `${photo.id}.jpg`;
          const url = await onUpload(compressed, filename, (pct) => {
            onChange((prev: PhotoItem[]) =>
              prev.map((p) => (p.id === photo.id ? { ...p, progress: pct } : p))
            );
          });
          onChange((prev: PhotoItem[]) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, progress: 100, uploaded: true, url } : p
            )
          );
        } catch {
          onChange((prev: PhotoItem[]) =>
            prev.map((p) =>
              p.id === photo.id ? { ...p, error: "Upload failed. Try again." } : p
            )
          );
        }
      }
    },
    [photos, onChange, onUpload]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function removePhoto(id: string) {
    onChange(photos.filter((p) => p.id !== id));
  }

  function handleReorderDragStart(index: number) {
    setDragIndex(index);
  }

  function handleReorderDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newPhotos = [...photos];
    const [moved] = newPhotos.splice(dragIndex, 1);
    newPhotos.splice(index, 0, moved);
    onChange(newPhotos);
    setDragIndex(index);
  }

  function handleReorderDragEnd() {
    setDragIndex(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">
          Photos
        </label>
        <span className="text-xs text-gray-400">
          {photos.length} of {MAX_PHOTOS} uploaded
        </span>
      </div>

      {/* Drop zone */}
      {photos.length < MAX_PHOTOS && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors mb-4 ${
            dragOver
              ? "border-hw-blue bg-hw-blue/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Drop photos here or click to browse
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG, or WebP. Max 10MB each.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              draggable
              onDragStart={() => handleReorderDragStart(index)}
              onDragOver={(e) => handleReorderDragOver(e, index)}
              onDragEnd={handleReorderDragEnd}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                dragIndex === index ? "opacity-50 scale-95" : "opacity-100"
              } ${photo.error ? "border-red-300" : "border-gray-200"}`}
            >
              {photo.preview ? (
                <img
                  src={photo.preview}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
              )}

              {/* Cover badge */}
              {index === 0 && !photo.error && (
                <div className="absolute top-1.5 left-1.5 bg-hw-blue text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Cover
                </div>
              )}

              {/* Progress overlay */}
              {!photo.uploaded && !photo.error && photo.progress < 100 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-3/4">
                    <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${photo.progress}%` }}
                      />
                    </div>
                    <p className="text-white text-xs text-center mt-1">{photo.progress}%</p>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {photo.error && (
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                  <p className="text-white text-xs text-center leading-tight">{photo.error}</p>
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Remove photo"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs text-gray-400 mt-2">
          Drag to reorder. First photo is the listing cover.
        </p>
      )}
    </div>
  );
}

export type { PhotoItem };
