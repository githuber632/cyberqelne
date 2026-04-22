"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, Search, Play } from "lucide-react";
import { useContentStore, type Video } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Textarea, Select, Toggle, SaveButton, ImageField } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { value: "tournament", label: "Турнир" },
  { value: "highlight", label: "Хайлайт" },
  { value: "stream", label: "Стрим" },
  { value: "educational", label: "Обучение" },
  { value: "interview", label: "Интервью" },
];

const emptyForm: Omit<Video, "id"> = {
  title: "",
  description: "",
  thumbnailUrl: "",
  videoUrl: "",
  duration: "",
  category: "highlight",
  views: 0,
  featured: false,
  publishedAt: new Date().toISOString().slice(0, 16),
};

const catColors: Record<string, string> = {
  tournament: "text-cyber-neon bg-cyber-neon/20 border-cyber-neon/40",
  highlight: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40",
  stream: "text-red-400 bg-red-500/20 border-red-500/40",
  educational: "text-blue-400 bg-blue-500/20 border-blue-500/40",
  interview: "text-pink-400 bg-pink-500/20 border-pink-500/40",
};

export default function AdminMediaPage() {
  const { videos, addVideo, updateVideo, deleteVideo } = useContentStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState<Omit<Video, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  function showToast(msg: string) { setToast({ show: true, message: msg }); setTimeout(() => setToast({ show: false, message: "" }), 3500); }

  const filtered = videos.filter((v) => v.title.toLowerCase().includes(search.toLowerCase()));

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(v: Video) { setEditing(v); const { id, ...rest } = v; setForm(rest); setModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateVideo(editing.id, form);
    else addVideo(form);
    setModalOpen(false);
    showToast(editing ? "✓ Изменения сохранены" : "✓ Запись успешно создана");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление медиа</h1>
          <p className="text-gray-500 text-sm mt-1">{videos.length} видео</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm">
          <Plus className="w-4 h-4" />
          Добавить видео
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск видео..." className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl overflow-hidden group">
            {/* Thumbnail */}
            <div className="relative h-36 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
              {v.thumbnailUrl ? (
                <img src={v.thumbnailUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white/20" />
                </div>
              )}
              <div className={cn("absolute top-2 left-2 px-2 py-0.5 border rounded-full text-xs font-mono font-bold", catColors[v.category])}>
                {categoryOptions.find((c) => c.value === v.category)?.label}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-white text-xs font-mono">
                {v.duration}
              </div>
              {v.featured && (
                <div className="absolute top-2 right-2 text-yellow-400 text-xs font-mono bg-yellow-500/20 border border-yellow-500/40 rounded-full px-1.5">★</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 leading-snug">{v.title}</h3>
              <p className="text-gray-600 text-xs font-mono mb-3">{v.views.toLocaleString()} просмотров</p>
              <div className="flex items-center gap-2">
                <button onClick={() => updateVideo(v.id, { featured: !v.featured })} className={cn("p-1.5 rounded-lg transition-colors", v.featured ? "text-yellow-400 bg-yellow-500/20" : "text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10")}>
                  <Star className="w-3.5 h-3.5" fill={v.featured ? "currentColor" : "none"} />
                </button>
                <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-cyber-neon hover:bg-cyber-neon/10 rounded-lg transition-colors text-xs">
                  <Edit className="w-3.5 h-3.5" /> Изменить
                </button>
                <button onClick={() => setConfirmDelete(v.id)} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать видео" : "Добавить видео"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Заголовок" required>
            <Input value={form.title} onChange={(e) => setF("title", e.target.value)} placeholder="Название видео" required />
          </FormField>
          <FormField label="Категория">
            <Select value={form.category} onChange={(e) => setF("category", e.target.value as Video["category"])} options={categoryOptions} />
          </FormField>
          <FormField label="Описание">
            <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} rows={2} placeholder="Описание видео..." />
          </FormField>
          <FormField label="URL видео (YouTube/Twitch)" required>
            <Input value={form.videoUrl} onChange={(e) => setF("videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." required />
          </FormField>
          <ImageField value={form.thumbnailUrl} onChange={(v) => setF("thumbnailUrl", v)} label="Превью (URL)" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Длительность">
              <Input value={form.duration} onChange={(e) => setF("duration", e.target.value)} placeholder="1:24:38" />
            </FormField>
            <FormField label="Просмотры">
              <Input type="number" value={form.views} onChange={(e) => setF("views", Number(e.target.value))} min={0} />
            </FormField>
          </div>
          <div className="flex items-center gap-8">
            <Toggle checked={form.featured} onChange={(v) => setF("featured", v)} label="⭐ Featured" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
            <SaveButton label={editing ? "Сохранить" : "Добавить"} />
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить видео?" size="sm">
        <p className="text-gray-400 mb-6">Видео будет удалено из медиатеки.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
          <button onClick={() => { if (confirmDelete) { deleteVideo(confirmDelete); setConfirmDelete(null); } }} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">Удалить</button>
        </div>
      </Modal>
      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
