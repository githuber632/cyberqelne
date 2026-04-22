"use client";

import { useState } from "react";
import { Save, Eye, Home, Megaphone } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { FormField, Input, Select, Toggle, ImageField } from "@/components/admin/FormField";
import { AdminToast } from "@/components/admin/Toast";
import Link from "next/link";

export default function AdminHeroPage() {
  const { heroSettings, siteSettings, tournaments, updateHeroSettings, updateSiteSettings } = useContentStore();
  const [heroForm, setHeroForm] = useState({ ...heroSettings });
  const [siteForm, setSiteForm] = useState({ ...siteSettings, logoUrl: siteSettings.logoUrl || "" });
  const [toast, setToast] = useState({ show: false, message: "" });

  function showToast(message: string) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  }

  function saveHero(e: React.FormEvent) {
    e.preventDefault();
    updateHeroSettings(heroForm);
    showToast("✓ Hero баннер сохранён и применён на сайте");
  }

  function saveSite(e: React.FormEvent) {
    e.preventDefault();
    updateSiteSettings(siteForm);
    showToast("✓ Настройки сайта сохранены");
  }

  function setH<K extends keyof typeof heroForm>(k: K, v: (typeof heroForm)[K]) {
    setHeroForm((f) => ({ ...f, [k]: v }));
  }

  function setS<K extends keyof typeof siteForm>(k: K, v: (typeof siteForm)[K]) {
    setSiteForm((f) => ({ ...f, [k]: v }));
  }

  const tournamentOptions = [
    { value: "", label: "— Выберите турнир —" },
    ...tournaments.map((t) => ({ value: t.id, label: `${t.title} (${t.status})` })),
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Главная страница</h1>
          <p className="text-gray-500 text-sm mt-1">Настройка Hero баннера и общих параметров сайта</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-cyber-neon hover:text-white hover:border-cyber-neon/40 transition-all text-sm">
          <Eye className="w-4 h-4" />
          Просмотр сайта
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Hero settings */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-cyber-neon" />
            </div>
            <h2 className="font-display font-bold text-lg text-white">Hero баннер</h2>
          </div>

          <form onSubmit={saveHero} className="space-y-5">
            <FormField label="Главный заголовок">
              <Input value={heroForm.headline} onChange={(e) => setH("headline", e.target.value)} placeholder="CYBERQELN" />
            </FormField>

            <FormField label="Подзаголовок">
              <Input value={heroForm.subheadline} onChange={(e) => setH("subheadline", e.target.value)} placeholder="ESPORTS ECOSYSTEM" />
            </FormField>

            <FormField label="Текст кнопки CTA">
              <Input value={heroForm.ctaText} onChange={(e) => setH("ctaText", e.target.value)} placeholder="Участвовать" />
            </FormField>

            <FormField label="Featured турнир (карточка на главной)" hint="Выберите турнир для отображения в Hero секции">
              <Select
                value={heroForm.featuredTournamentId}
                onChange={(e) => setH("featuredTournamentId", e.target.value)}
                options={tournamentOptions}
              />
            </FormField>

            <ImageField
              value={heroForm.backgroundImage}
              onChange={(v) => setH("backgroundImage", v)}
              label="Фоновое изображение Hero"
            />

            <Toggle checked={heroForm.showLiveBadge} onChange={(v) => setH("showLiveBadge", v)} label="Показывать Live бейдж" />

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all">
              <Save className="w-4 h-4" />
              Сохранить Hero
            </button>
          </form>
        </div>

        {/* Site settings */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-orange-400" />
            </div>
            <h2 className="font-display font-bold text-lg text-white">Настройки сайта</h2>
          </div>

          <form onSubmit={saveSite} className="space-y-5">
            <FormField label="Название сайта">
              <Input value={siteForm.siteName} onChange={(e) => setS("siteName", e.target.value)} placeholder="CyberQELN" />
            </FormField>

            <FormField label="Слоган">
              <Input value={siteForm.tagline} onChange={(e) => setS("tagline", e.target.value)} placeholder="Главная киберспортивная платформа СНГ" />
            </FormField>

            <FormField label="Текст логотипа (2-3 символа, если нет картинки)">
              <Input value={siteForm.logoText} onChange={(e) => setS("logoText", e.target.value.slice(0, 3))} placeholder="CQ" maxLength={3} />
            </FormField>

            <ImageField
              value={siteForm.logoUrl}
              onChange={(v) => setS("logoUrl", v)}
              label="Логотип сайта (jpg/png/ico — заменяет текст в навбаре)"
            />

            <FormField label="Текст объявления (верхняя строка)">
              <Input value={siteForm.announcementBanner} onChange={(e) => setS("announcementBanner", e.target.value)} placeholder="🏆 Анонс турнира..." />
            </FormField>

            <div className="space-y-3">
              <Toggle checked={siteForm.announcementEnabled} onChange={(v) => setS("announcementEnabled", v)} label="Показывать строку объявлений" />
              <Toggle checked={siteForm.registrationEnabled} onChange={(v) => setS("registrationEnabled", v)} label="Регистрация открыта" />
              <Toggle checked={siteForm.maintenanceMode} onChange={(v) => setS("maintenanceMode", v)} label="⚠ Режим обслуживания" />
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:shadow-neon transition-all">
              <Save className="w-4 h-4" />
              Сохранить настройки
            </button>
          </form>
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-4">Предпросмотр Hero</h2>
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-cyber-purple to-cyber-dark p-8 min-h-48 flex items-center">
          {heroForm.backgroundImage && (
            <img src={heroForm.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
          )}
          <div className="absolute inset-0 cyber-grid-bg opacity-20" />
          <div className="relative">
            {heroForm.showLiveBadge && (
              <div className="inline-flex items-center gap-2 mb-4 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-mono">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                LIVE NOW
              </div>
            )}
            <h1 className="font-display font-black text-4xl text-white">{heroForm.headline || "CYBERQELN"}</h1>
            <p className="font-display text-xl text-gray-400 tracking-widest mt-1">{heroForm.subheadline || "ESPORTS ECOSYSTEM"}</p>
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl text-sm">
              {heroForm.ctaText || "Участвовать"}
            </button>
          </div>
        </div>
      </div>

      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
