"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Gamepad2 } from "lucide-react";
import { useContentStore, type Game } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { FormField, Input, Textarea, Toggle, SaveButton, ImageField } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

const emptyForm: Omit<Game, "id"> = {
  name: "",
  shortName: "",
  icon: "🎮",
  image: "",
  active: true,
  featured: false,
  description: "",
  color: "#a855f7",
};

export default function AdminGamesPage() {
  const { games, addGame, updateGame, deleteGame } = useContentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [form, setForm] = useState<Omit<Game, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(g: Game) { setEditing(g); const { id, ...rest } = g; setForm(rest); setModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateGame(editing.id, form);
    else addGame(form);
    setModalOpen(false);
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление играми</h1>
          <p className="text-gray-500 text-sm mt-1">{games.length} игр на платформе</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm">
          <Plus className="w-4 h-4" />
          Добавить игру
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn("glass-card rounded-2xl overflow-hidden", !g.active && "opacity-50")}
          >
            {/* Header */}
            <div
              className="relative h-28 flex items-center justify-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${g.color}30, #0d0d1a)` }}
            >
              {g.image ? (
                <img src={g.image} className="w-full h-full object-cover absolute inset-0" alt="" />
              ) : (
                <span className="text-5xl">{g.icon}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
              <div className="absolute top-3 right-3 flex gap-2">
                {g.featured && <span className="text-yellow-400 text-xs bg-yellow-500/20 border border-yellow-500/40 rounded-full px-2 py-0.5 font-mono">★ Featured</span>}
                <span className={cn("text-xs font-mono rounded-full px-2 py-0.5 border", g.active ? "text-green-400 bg-green-500/20 border-green-500/40" : "text-gray-500 bg-gray-500/20 border-gray-500/40")}>
                  {g.active ? "Активна" : "Неактивна"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{g.icon}</span>
                <h3 className="font-display font-bold text-white text-base">{g.name}</h3>
              </div>
              <p className="text-cyber-neon text-xs font-mono mb-2">{g.shortName}</p>
              <p className="text-gray-500 text-xs mb-4 line-clamp-2">{g.description}</p>

              <div className="flex items-center gap-3 mb-4">
                <Toggle checked={g.active} onChange={(v) => updateGame(g.id, { active: v })} label="Активна" />
                <Toggle checked={g.featured} onChange={(v) => updateGame(g.id, { featured: v })} label="Featured" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(g)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyber-neon/10 text-cyber-neon hover:bg-cyber-neon/20 rounded-xl transition-colors text-xs font-medium">
                  <Edit className="w-3.5 h-3.5" /> Изменить
                </button>
                <button onClick={() => setConfirmDelete(g.id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать игру" : "Добавить игру"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Полное название" required>
            <Input value={form.name} onChange={(e) => setF("name", e.target.value)} placeholder="Mobile Legends: Bang Bang" required />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Короткое название" required>
              <Input value={form.shortName} onChange={(e) => setF("shortName", e.target.value)} placeholder="MLBB" required />
            </FormField>
            <FormField label="Иконка (emoji)">
              <Input value={form.icon} onChange={(e) => setF("icon", e.target.value)} placeholder="🎮" />
            </FormField>
          </div>
          <FormField label="Описание">
            <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} rows={2} placeholder="Краткое описание игры..." />
          </FormField>
          <ImageField value={form.image} onChange={(v) => setF("image", v)} label="Изображение (URL)" />
          <FormField label="Цвет акцента (hex)" hint="Например: #a855f7">
            <div className="flex items-center gap-3">
              <Input value={form.color} onChange={(e) => setF("color", e.target.value)} placeholder="#a855f7" />
              <input type="color" value={form.color} onChange={(e) => setF("color", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-cyber-glass-border bg-transparent" />
            </div>
          </FormField>
          <div className="flex items-center gap-8">
            <Toggle checked={form.active} onChange={(v) => setF("active", v)} label="Активна на платформе" />
            <Toggle checked={form.featured} onChange={(v) => setF("featured", v)} label="Featured" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
            <SaveButton label={editing ? "Сохранить" : "Добавить"} />
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить игру?" size="sm">
        <p className="text-gray-400 mb-6">Игра будет удалена с платформы.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
          <button onClick={() => { if (confirmDelete) { deleteGame(confirmDelete); setConfirmDelete(null); } }} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">Удалить</button>
        </div>
      </Modal>
    </div>
  );
}
