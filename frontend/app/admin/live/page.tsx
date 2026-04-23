"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { useContentStore, type LiveBanner } from "@/store/contentStore";
import { cn } from "@/lib/utils";

const empty: Omit<LiveBanner, "id"> = {
  title: "", description: "", thumbnailUrl: "", youtubeUrl: "",
  isLive: false, active: true,
  publishedAt: new Date().toISOString(),
};

export default function AdminLivePage() {
  const { liveBanners, addLiveBanner, updateLiveBanner, deleteLiveBanner } = useContentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LiveBanner | null>(null);
  const [form, setForm] = useState<Omit<LiveBanner, "id">>(empty);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm({ ...empty, publishedAt: new Date().toISOString() }); setModalOpen(true); }
  function openEdit(b: LiveBanner) { setEditing(b); const { id, ...rest } = b; setForm(rest); setModalOpen(true); }

  function save() {
    if (!form.title.trim() || !form.youtubeUrl.trim()) return;
    if (editing) updateLiveBanner(editing.id, form);
    else addLiveBanner(form);
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-xl flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-white">Прямой эфир</h1>
            <p className="text-gray-500 text-sm font-mono">{liveBanners.length} баннеров · {liveBanners.filter(b => b.active).length} активных</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-400 text-white font-display font-bold rounded-xl hover:shadow-lg transition-all text-sm">
          <Plus className="w-4 h-4" /> Добавить баннер
        </button>
      </div>

      {liveBanners.length === 0 ? (
        <div className="glass-card rounded-2xl py-20 text-center text-gray-600">
          <Radio className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-mono text-sm">Нет баннеров. Добавь первый!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {liveBanners.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl overflow-hidden">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-red-900/60 to-cyber-dark flex items-center justify-center">
                {b.thumbnailUrl ? (
                  <img src={b.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Radio className="w-12 h-12 text-red-400/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
                {b.isLive && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-white text-xs font-mono font-bold">LIVE</span>
                  </div>
                )}
                <div className={cn("absolute top-3 right-3 text-xs font-mono font-bold px-2 py-0.5 rounded-full",
                  b.active ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-gray-500/20 text-gray-500 border border-gray-500/40")}>
                  {b.active ? "Активен" : "Скрыт"}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-bold text-white text-sm mb-1 line-clamp-1">{b.title}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{b.description}</p>
                <a href={b.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 transition-colors mb-4 truncate">
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {b.youtubeUrl}
                </a>

                <div className="flex gap-2">
                  <button onClick={() => updateLiveBanner(b.id, { active: !b.active })}
                    className={cn("flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition-all border",
                      b.active ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-green-500/30 text-green-400 hover:bg-green-500/10")}>
                    {b.active ? "Скрыть" : "Показать"}
                  </button>
                  <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-neon/20 flex items-center justify-center text-gray-400 hover:text-cyber-neon transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(b.id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="glass-card rounded-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-glass-border">
                  <h2 className="font-display font-bold text-white">{editing ? "Редактировать баннер" : "Новый баннер"}</h2>
                  <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: "Название *", key: "title", placeholder: "CyberQELN Championship — Финал" },
                    { label: "YouTube URL *", key: "youtubeUrl", placeholder: "https://youtube.com/live/..." },
                    { label: "URL превью (картинка)", key: "thumbnailUrl", placeholder: "https://..." },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
                      <input value={(form as unknown as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                        className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">Описание</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Краткое описание..."
                      className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono resize-none" />
                  </div>
                  <div className="flex gap-6">
                    {[
                      { label: "Прямой эфир сейчас", key: "isLive" },
                      { label: "Показывать на сайте", key: "active" },
                    ].map(({ label, key }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={(form as unknown as Record<string, boolean>)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                          className="w-4 h-4 rounded accent-purple-500" />
                        <span className="text-sm text-gray-300 font-mono">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={save} className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-400 rounded-xl text-white font-display font-bold text-sm hover:opacity-90 transition-all">
                      {editing ? "Сохранить" : "Добавить"}
                    </button>
                    <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 font-display font-bold text-sm hover:text-white transition-all">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirm delete */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="glass-card rounded-2xl w-full max-w-sm pointer-events-auto p-6 text-center">
                <p className="text-white font-display font-bold mb-2">Удалить баннер?</p>
                <p className="text-gray-400 text-sm mb-6">Это действие необратимо.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white text-sm font-display font-bold transition-all">Отмена</button>
                  <button onClick={() => { deleteLiveBanner(confirmDelete); setConfirmDelete(null); }}
                    className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 text-sm font-display font-bold transition-all">Удалить</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
