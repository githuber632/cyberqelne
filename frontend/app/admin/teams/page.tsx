"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Users } from "lucide-react";
import { useContentStore, type Team } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Textarea, Toggle, SaveButton, ImageField } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

const emptyForm: Omit<Team, "id"> = {
  name: "", tag: "", logo: "", country: "🇺🇿", rating: 1000,
  wins: 0, losses: 0, members: 5, active: true,
  description: "", createdAt: new Date().toISOString().slice(0, 10),
};

const countries = ["🇺🇿", "🇰🇿", "🇷🇺", "🇰🇬", "🇹🇯", "🇦🇿", "🇬🇪", "🇺🇦", "🇧🇾"];

export default function AdminTeamsPage() {
  const { teams, addTeam, updateTeam, deleteTeam } = useContentStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [form, setForm] = useState<Omit<Team, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  function showToast(msg: string) { setToast({ show: true, message: msg }); setTimeout(() => setToast({ show: false, message: "" }), 3500); }

  const filtered = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase()));

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(t: Team) { setEditing(t); const { id, ...rest } = t; setForm(rest); setModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateTeam(editing.id, form);
    else addTeam(form);
    setModalOpen(false);
    showToast(editing ? "✓ Изменения сохранены" : "✓ Запись успешно создана");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const sorted = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление командами</h1>
          <p className="text-gray-500 text-sm mt-1">{teams.length} команд</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm">
          <Plus className="w-4 h-4" />
          Добавить команду
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по названию или тегу..." className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-glass-border">
                {["#", "Команда", "Тег", "Страна", "Рейтинг", "W/L", "Статус", "Действия"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-glass-border">
              {sorted.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-500 font-mono text-sm">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon-blue flex items-center justify-center text-white font-bold text-xs">
                        {t.logo ? <img src={t.logo} className="w-9 h-9 rounded-xl object-cover" alt="" /> : t.tag}
                      </div>
                      <span className="text-white font-semibold text-sm">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cyber-neon font-mono text-sm font-bold">[{t.tag}]</td>
                  <td className="px-4 py-3 text-xl">{t.country}</td>
                  <td className="px-4 py-3 text-cyber-neon font-display font-bold">{t.rating.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-mono">
                    <span className="text-green-400">{t.wins}W</span>
                    <span className="text-gray-600"> / </span>
                    <span className="text-red-400">{t.losses}L</span>
                  </td>
                  <td className="px-4 py-3">
                    <Toggle checked={t.active} onChange={(v) => updateTeam(t.id, { active: v })} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-gray-500 hover:text-cyber-neon rounded-lg hover:bg-cyber-neon/10 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Команды не найдены</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать команду" : "Новая команда"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Название" required>
              <Input value={form.name} onChange={(e) => setF("name", e.target.value)} placeholder="Team Phantom" required />
            </FormField>
            <FormField label="Тег (до 6 символов)" required>
              <Input value={form.tag} onChange={(e) => setF("tag", e.target.value.toUpperCase().slice(0, 6))} placeholder="PH" required maxLength={6} />
            </FormField>
          </div>
          <FormField label="Страна (emoji)">
            <div className="flex gap-2 flex-wrap">
              {countries.map((c) => (
                <button key={c} type="button" onClick={() => setF("country", c)}
                  className={cn("text-2xl p-1.5 rounded-lg transition-colors", form.country === c ? "bg-cyber-neon/20 border border-cyber-neon/40" : "hover:bg-white/10")}>
                  {c}
                </button>
              ))}
            </div>
          </FormField>
          <ImageField value={form.logo} onChange={(v) => setF("logo", v)} label="Логотип (URL)" />
          <FormField label="Описание">
            <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} rows={2} placeholder="О команде..." />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Рейтинг">
              <Input type="number" value={form.rating} onChange={(e) => setF("rating", Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="Победы">
              <Input type="number" value={form.wins} onChange={(e) => setF("wins", Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="Поражения">
              <Input type="number" value={form.losses} onChange={(e) => setF("losses", Number(e.target.value))} min={0} />
            </FormField>
          </div>
          <Toggle checked={form.active} onChange={(v) => setF("active", v)} label="Активна" />
          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
            <SaveButton label={editing ? "Сохранить" : "Создать"} />
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить команду?" size="sm">
        <p className="text-gray-400 mb-6">Команда будет удалена с платформы.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
          <button onClick={() => { if (confirmDelete) { deleteTeam(confirmDelete); setConfirmDelete(null); } }} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">Удалить</button>
        </div>
      </Modal>
      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
