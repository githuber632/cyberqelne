"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  currentUrl?: string;
  storagePath?: string;
  accept?: string;
  className?: string;
  compact?: boolean;
}

export function FileUpload({
  onUpload, onUploadingChange, currentUrl, storagePath = "uploads",
  accept = "image/*", className, compact = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentUrl || "");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    onUploadingChange?.(true);
    setProgress(0);

    // Read as base64 for preview and fallback
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    setPreview(base64);

    try {
      const storageRef = ref(storage, `${storagePath}/${Date.now()}-${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        "state_changed",
        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        () => {
          // Firebase Storage failed — use base64 as fallback
          onUpload(base64);
          setUploading(false);
          onUploadingChange?.(false);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          onUpload(url);
          setPreview(url);
          setUploading(false);
          onUploadingChange?.(false);
        }
      );
    } catch {
      // Firebase Storage not available — use base64 as fallback
      onUpload(base64);
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  if (compact) {
    return (
      <div className={cn("relative inline-block", className)}>
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <button onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg text-xs font-mono text-gray-400 hover:text-cyber-neon hover:border-cyber-neon/40 transition-all">
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? `${Math.round(progress)}%` : "Загрузить фото"}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden">
          <img src={preview} alt="" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button onClick={() => inputRef.current?.click()}
              className="w-9 h-9 bg-cyber-neon/20 border border-cyber-neon/40 rounded-lg flex items-center justify-center text-cyber-neon hover:bg-cyber-neon/30 transition-all">
              <Upload className="w-4 h-4" />
            </button>
            <button onClick={() => { setPreview(""); onUpload(""); }}
              className="w-9 h-9 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()}
          className="w-full h-36 border-2 border-dashed border-cyber-glass-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-cyber-neon/50 hover:bg-cyber-neon/5 transition-all group">
          <ImageIcon className="w-8 h-8 text-gray-600 group-hover:text-cyber-neon transition-colors" />
          <span className="text-xs font-mono text-gray-500 group-hover:text-gray-300 transition-colors">Нажми или перетащи файл</span>
          <span className="text-xs font-mono text-gray-600">PNG, JPG, WebP до 10MB</span>
        </button>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-cyber-dark/85 rounded-xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-cyber-neon animate-spin" />
          <div className="w-3/4">
            <div className="h-1.5 bg-cyber-purple-mid rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-xs font-mono text-cyber-neon">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
