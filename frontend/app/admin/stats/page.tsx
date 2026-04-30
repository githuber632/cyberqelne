"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, BarChart2 } from "lucide-react";
import { useContentStore, type StatItem } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Select } from "@/components/admin/FormField";

const iconOptions = [
  { value: "Users", label: "👥 Пользователи" },
  { value: "Trophy", label: "🏆 Трофей" },
  { value: "DollarSign", label: "💲 Деньги" },
  { value: "Gamepad2", label: "🎮 Геймпад" },
  { value: "Globe", label: "🌍 Глобус" },
  { value: "Zap", label: "⚡ Молния" },
  { value: "Star", label: "⭐ Звезда" },
  { value: "Shield", label: "🛡️ Щит" },
];

const colorOptions = [
  { value: "text-cyber-neon", label: "Циановый" },
  { value: "text-yellow-400", label: "Жёлтый" },
  { value: "text-green-400", label: "Зелёный" },
  { value: "text-cyber-neon-blue", label: "Синий" },
  { value: "text-cyber-neon-pink", label: "Розовый" },
  { value: "text-red-400", label: "Красный" },
  { value: "text-purple-400", label: "Фиолетовый" },
  { value: "text-orange-400", label: "Оранжевый" },
];

const sourceOptions = [
  { value: "", label: "Вручную" },
  { value: "players", label: "Игроки (авто)" },
  { value: "tournaments_finished", label: "Турниры завершённые (авто)" },
  { value: "registrations_approved", label: "Заявки принятые (авто)" },
  { value: "prize_total", label: "Призовые сумма (авто)" },
];

const emptyForm: Omit<StatItem, "id"> = {
  label: "",
  value: 0,
  suffix: "+",
  prefix: "",
  icon: "Users",
  color: "text-cyber-neon",
  description: "",
  source: undefined,
};

export default function AdminStatsPage() {
  const { homeStats, addStat, updateStat, deleteStat } = useContentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StatItem | null>(null);
  const [form, setForm] = useState<Omit<StatItem, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  function showToast(msg: string) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(stat: StatItem) {
    setEditing(stat);
    setForm({ label: stat.label, value: stat.value, suffix: stat.suffix, prefix: stat.prefix ?? "", icon: stat.icon, color: stat.color, description: stat.description, source: stat.source });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.label.trim()) return;
    if (editing) {
      updateStat(editing.id, form);
      showToast("Статистика обновлена");
    } else {
      addStat(form);
      showToast("Статистика добавлена");
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    deleteStat(id);
    setConfirmDelete(null);
    showToast("Удалено");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyber-neon/20 border border-cyber-neon/40 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-cyber-neon" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-white">Статистика главной</h1>
            <p className="text-gray-500 text-sm font-mono">Цифры под Hero-секцией</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-semibold text-sm hover:shadow-neon transition-all"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {homeStats.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-display font-bold text-lg mb-1">Нет статистики</p>
          <p className="text-gray-600 text-sm font-mono mb-6">Добавьте цифры — они появятся на главной странице</p>
          <button onClick={openCreate} className="px-6 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-semibold text-sm hover:shadow-neon transition-all">
            Добавить первую
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyber-purple/30 flex items-center justify-center">
                  {stat.source ? (
                    <span className="text-xs font-bold text-cyber-neon text-center leading-tight">авто</span>
                  ) : (
                    <span className={`text-xl font-bold ${stat.color}`}>
                      {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">{stat.label}</div>
                  <div className="text-gray-500 text-xs font-mono">{stat.description}</div>
                  <div className="text-gray-600 text-xs mt-0.5">
                    {stat.source
                      ? <span className="text-cyber-neon/70">⚡ {sourceOptions.find(o => o.value === stat.source)?.label}</span>
                      : `Иконка: ${stat.icon}`
                    }
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(stat)} className="w-8 h-8 rounded-lg bg-cyber-purple/30 hover:bg-cyber-purple/50 flex items-center justify-center transition-colors">
                  <Edit className="w-3.5 h-3.5 text-cyber-neon" />
                </button>
                <button onClick={() => setConfirmDelete(stat.id)} className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Форма */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать" : "Новая статистика"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Название">
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Игроков" />
            </FormField>
            <FormField label="Подпись">
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Зарегистрировано" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Префикс">
              <Input value={form.prefix ?? ""} onChange={(e) => setForm({ ...form, prefix: e.target.value })} placeholder="" />
            </FormField>
            <FormField label="Суффикс">
              <Input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="+" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Иконка">
              <Select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as StatItem["icon"] })} options={iconOptions} />
            </FormField>
            <FormField label="Цвет">
              <Select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} options={colorOptions} />
            </FormField>
          </div>
          <FormField label="Источник данных">
            <Select
              value={form.source ?? ""}
              onChange={(e) => setForm({ ...form, source: (e.target.value as StatItem["source"]) || undefined })}
              options={sourceOptions}
            />
          </FormField>
          {!form.source && (
            <FormField label="Число">
              <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="12400" />
            </FormField>
          )}
          {form.source && (
            <p className="text-xs font-mono text-cyber-neon bg-cyber-neon/10 border border-cyber-neon/30 rounded-xl px-4 py-2.5">
              Значение подтягивается автоматически из базы данных — поле «Число» не нужно.
            </p>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all"
          >
            Сохранить
          </button>
        </div>
      </Modal>

      {/* Подтверждение удаления */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить статистику?">
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Это действие нельзя отменить.</p>
          <div className="flex gap-3">
            <button onClick={() => handleDelete(confirmDelete!)} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl font-semibold text-sm hover:bg-red-500/30 transition-colors">
              Удалить
            </button>
            <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 font-semibold text-sm hover:text-white transition-colors">
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      <AdminToast show={toast.show} message={toast.message} />
    </div>
  );
}
