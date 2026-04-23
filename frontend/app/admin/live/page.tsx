"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useContentStore, type LiveBanner } from "@/store/contentStore";

type FormType = Omit<LiveBanner, "id">;

const empty: FormType = {
  title: "",
  description: "",
  thumbnailUrl: "",
  youtubeUrl: "",
  isLive: false,
  active: true,
  publishedAt: new Date().toISOString(),
};

export default function AdminLivePage() {
  const { liveBanners, addLiveBanner, updateLiveBanner, deleteLiveBanner } =
    useContentStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LiveBanner | null>(null);
  const [form, setForm] = useState<FormType>(empty);

  function openCreate() {
    setEditing(null);
    setForm({ ...empty, publishedAt: new Date().toISOString() });
    setModalOpen(true);
  }

  function openEdit(b: LiveBanner) {
    const { id, ...rest } = b;
    void id;
    setEditing(b);
    setForm(rest);
    setModalOpen(true);
  }

  function setField<K extends keyof FormType>(key: K, value: FormType[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!form.title.trim() || !form.youtubeUrl.trim()) return;
    if (editing) {
      updateLiveBanner(editing.id, form);
    } else {
      addLiveBanner(form);
    }
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Прямой эфир</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveBanners.map((b) => (
          <div key={b.id} className="p-4 bg-black/40 rounded-xl">
            <h3 className="text-white">{b.title}</h3>
            <p className="text-gray-400 text-sm">{b.description}</p>
            <a
              href={b.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 text-xs flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              link
            </a>
            <div className="flex gap-2 mt-2">
              <button onClick={() => openEdit(b)}>
                <Pencil />
              </button>
              <button onClick={() => deleteLiveBanner(b.id)}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="p-4 bg-black/80 rounded-xl space-y-4">
            <input
              placeholder="Название"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full bg-white/10 text-white rounded px-3 py-2"
            />
            <input
              placeholder="YouTube URL"
              value={form.youtubeUrl}
              onChange={(e) => setField("youtubeUrl", e.target.value)}
              className="w-full bg-white/10 text-white rounded px-3 py-2"
            />
            <input
              placeholder="Thumbnail URL"
              value={form.thumbnailUrl}
              onChange={(e) => setField("thumbnailUrl", e.target.value)}
              className="w-full bg-white/10 text-white rounded px-3 py-2"
            />
            <textarea
              placeholder="Описание"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full bg-white/10 text-white rounded px-3 py-2"
            />
            <label className="flex gap-2 text-white items-center">
              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) => setField("isLive", e.target.checked)}
              />
              Live
            </label>
            <label className="flex gap-2 text-white items-center">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setField("active", e.target.checked)}
              />
              Active
            </label>
            <button
              onClick={save}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Сохранить
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
