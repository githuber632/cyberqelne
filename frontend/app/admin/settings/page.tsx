"use client";

import { useState } from "react";
import { Save, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { FormField, Input, Toggle, ImageField } from "@/components/admin/FormField";
import { AdminToast } from "@/components/admin/Toast";

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useContentStore();
  const [form, setForm] = useState({ ...siteSettings, logoUrl: siteSettings.logoUrl || "" });
  const [toast, setToast] = useState({ show: false, message: "" });
  const [clearConfirm, setClearConfirm] = useState(false);

  function showToast(msg: string) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateSiteSettings(form);
    showToast("✓ Настройки сайта сохранены");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function clearAllData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cyberqeln-content");
      window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl text-white">Настройки сайта</h1>
        <p className="text-gray-500 text-sm mt-1">Общие параметры платформы CyberQELN</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-bold text-white">Основные настройки</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Название сайта">
              <Input value={form.siteName} onChange={(e) => setF("siteName", e.target.value)} placeholder="CyberQELN" />
            </FormField>
            <FormField label="Текст логотипа (если нет картинки)">
              <Input value={form.logoText} onChange={(e) => setF("logoText", e.target.value.slice(0, 3))} placeholder="CQ" maxLength={3} />
            </FormField>
          </div>

          <ImageField
            label="Логотип сайта (jpg/png/ico — заменяет текст)"
            value={form.logoUrl || ""}
            onChange={(v) => setF("logoUrl" as keyof typeof form, v as never)}
          />

          <FormField label="Слоган">
            <Input value={form.tagline} onChange={(e) => setF("tagline", e.target.value)} placeholder="Главная киберспортивная платформа СНГ" />
          </FormField>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-bold text-white">Объявления</h2>

          <FormField label="Текст тикера (верхняя полоса)" hint="Используй • для разделения сообщений">
            <Input value={form.announcementBanner} onChange={(e) => setF("announcementBanner", e.target.value)} placeholder="🏆 Анонс..." />
          </FormField>

          <Toggle checked={form.announcementEnabled} onChange={(v) => setF("announcementEnabled", v)} label="Показывать строку объявлений" />
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-bold text-white">Управление доступом</h2>

          <div className="space-y-3">
            <Toggle checked={form.registrationEnabled} onChange={(v) => setF("registrationEnabled", v)} label="Регистрация новых пользователей открыта" />
            <Toggle checked={form.maintenanceMode} onChange={(v) => setF("maintenanceMode", v)} label="⚠ Режим обслуживания (сайт недоступен для пользователей)" />
          </div>

          {form.maintenanceMode && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm">
              ⚠ Режим обслуживания включён — обычные пользователи не смогут войти на сайт.
            </div>
          )}
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
          <Save className="w-4 h-4" />
          Сохранить настройки
        </button>
      </form>

      {/* Danger zone */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="font-display font-bold text-red-400">Зона опасности</h2>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Сброс данных удалит все новости, турниры, товары, видео и команды — вернув начальные данные. Действие нельзя отменить.
        </p>

        {!clearConfirm ? (
          <button
            onClick={() => setClearConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Сбросить все данные
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-400 text-sm font-semibold">Ты уверен? Это удалит ВСЕ данные!</p>
            <div className="flex gap-3">
              <button onClick={() => setClearConfirm(false)} className="px-5 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">
                Отмена
              </button>
              <button onClick={clearAllData} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold">
                <Trash2 className="w-4 h-4" />
                Да, сбросить всё
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
