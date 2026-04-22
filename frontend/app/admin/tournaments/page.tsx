"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, Search, Trophy } from "lucide-react";
import { useContentStore, type Tournament } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Textarea, Select, Toggle, SaveButton, ImageField } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

const statusOptions = [
  { value: "upcoming", label: "Скоро" },
  { value: "registration", label: "Регистрация открыта" },
  { value: "active", label: "Live (идёт)" },
  { value: "finished", label: "Завершён" },
];

const formatOptions = [
  { value: "Single Elimination", label: "Single Elimination" },
  { value: "Double Elimination", label: "Double Elimination" },
  { value: "Round Robin", label: "Round Robin (круговой)" },
  { value: "Group + Playoffs", label: "Группы + Плей-офф" },
  { value: "Swiss", label: "Swiss" },
];

const emptyForm: Omit<Tournament, "id"> = {
  title: "",
  game: "MLBB",
  status: "upcoming",
  prizePool: "",
  teamsRegistered: 0,
  maxTeams: 16,
  startDate: "",
  endDate: "",
  entryFee: "Бесплатно",
  gameIcon: "🏆",
  featured: false,
  description: "",
  format: "Single Elimination",
  organizer: "CyberQELN",
  banner: "",
};

const statusLabels: Record<string, string> = {
  active: "Live",
  registration: "Регистрация",
  upcoming: "Скоро",
  finished: "Завершён",
};

const statusColors: Record<string, string> = {
  active: "text-red-400 bg-red-500/20 border-red-500/40",
  registration: "text-green-400 bg-green-500/20 border-green-500/40",
  upcoming: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40",
  finished: "text-gray-400 bg-gray-500/20 border-gray-500/40",
};

export default function AdminTournamentsPage() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useContentStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [form, setForm] = useState<Omit<Tournament, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  function showToast(msg: string) { setToast({ show: true, message: msg }); setTimeout(() => setToast({ show: false, message: "" }), 3500); }

  const filtered = tournaments.filter(
    (t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.game.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: Tournament) {
    setEditing(t);
    const { id, ...rest } = t;
    setForm(rest);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateTournament(editing.id, form);
    } else {
      addTournament(form);
    }
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
          <h1 className="font-display font-black text-2xl text-white">Управление турнирами</h1>
          <p className="text-gray-500 text-sm mt-1">{tournaments.length} турниров</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Новый турнир
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или игре..."
          className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Card top */}
            <div className="relative h-24 bg-gradient-to-br from-cyber-purple to-cyber-dark flex items-center justify-center">
              <span className="text-4xl opacity-30">{t.gameIcon}</span>
              <div className={cn("absolute top-3 right-3 px-2.5 py-1 rounded-full border text-xs font-mono font-bold", statusColors[t.status])}>
                {statusLabels[t.status]}
              </div>
              {t.featured && (
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-mono">
                  ★ Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-white text-sm mb-1 truncate">{t.title}</h3>
              <p className="text-gray-500 text-xs mb-3 font-mono">{t.game} • {t.format}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-cyber-purple/20 rounded-lg p-2">
                  <div className="text-gray-500">Призовой</div>
                  <div className="text-cyber-neon font-bold font-mono">{t.prizePool} UZS</div>
                </div>
                <div className="bg-cyber-purple/20 rounded-lg p-2">
                  <div className="text-gray-500">Команды</div>
                  <div className="text-white font-bold font-mono">{t.teamsRegistered}/{t.maxTeams}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateTournament(t.id, { featured: !t.featured })}
                  className={cn("p-2 rounded-lg transition-colors", t.featured ? "text-yellow-400 bg-yellow-500/20" : "text-gray-600 hover:text-yellow-400 hover:bg-yellow-500/10")}
                >
                  <Star className="w-3.5 h-3.5" fill={t.featured ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-cyber-neon hover:bg-cyber-neon/10 rounded-lg transition-colors text-xs font-medium"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Изменить
                </button>
                <button
                  onClick={() => setConfirmDelete(t.id)}
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Турниры не найдены</p>
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать турнир" : "Новый турнир"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Название турнира" required>
            <Input value={form.title} onChange={(e) => setF("title", e.target.value)} placeholder="CyberQELN Championship S3" required />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Игра" required>
              <Input value={form.game} onChange={(e) => setF("game", e.target.value)} placeholder="MLBB" required />
            </FormField>
            <FormField label="Иконка (emoji)">
              <Input value={form.gameIcon} onChange={(e) => setF("gameIcon", e.target.value)} placeholder="🏆" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Статус" required>
              <Select value={form.status} onChange={(e) => setF("status", e.target.value as Tournament["status"])} options={statusOptions} />
            </FormField>
            <FormField label="Формат">
              <Select value={form.format} onChange={(e) => setF("format", e.target.value)} options={formatOptions} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Призовой фонд (UZS)" required>
              <Input value={form.prizePool} onChange={(e) => setF("prizePool", e.target.value)} placeholder="50,000,000" required />
            </FormField>
            <FormField label="Взнос">
              <Input value={form.entryFee} onChange={(e) => setF("entryFee", e.target.value)} placeholder="Бесплатно" />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="Макс. команд">
              <Input type="number" value={form.maxTeams} onChange={(e) => setF("maxTeams", Number(e.target.value))} min={2} />
            </FormField>
            <FormField label="Начало">
              <Input type="date" value={form.startDate} onChange={(e) => setF("startDate", e.target.value)} />
            </FormField>
            <FormField label="Конец">
              <Input type="date" value={form.endDate} onChange={(e) => setF("endDate", e.target.value)} />
            </FormField>
          </div>

          <FormField label="Организатор">
            <Input value={form.organizer} onChange={(e) => setF("organizer", e.target.value)} placeholder="CyberQELN" />
          </FormField>

          <FormField label="Описание">
            <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} placeholder="Описание турнира..." rows={3} />
          </FormField>

          <ImageField value={form.banner} onChange={(v) => setF("banner", v)} label="Баннер турнира (URL)" />

          <div className="flex items-center gap-8">
            <Toggle checked={form.featured} onChange={(v) => setF("featured", v)} label="⭐ Featured (на главной)" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">
              Отмена
            </button>
            <SaveButton label={editing ? "Сохранить" : "Создать"} />
          </div>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить турнир?" size="sm">
        <p className="text-gray-400 mb-6">Турнир будет удалён навсегда.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
          <button onClick={() => { if (confirmDelete) { deleteTournament(confirmDelete); setConfirmDelete(null); } }} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">Удалить</button>
        </div>
      </Modal>
      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
