"use client";

import { useState, useEffect } from "react";
import { Save, Eye, Image, Type } from "lucide-react";
import { useContentStore, useMediaBlobStore } from "@/store/contentStore";
import { FormField, Input, Select, Toggle, ImageField } from "@/components/admin/FormField";
import { AdminToast } from "@/components/admin/Toast";
import { saveVideoDB, loadVideoDB, deleteVideoDB } from "@/lib/videoDB";
import Link from "next/link";

const PRESET_COLORS = [
  "#ffffff", "#a855f7", "#e879f9", "#facc15", "#4ade80",
  "#f97316", "#ef4444", "#60a5fa", "#000000",
];

function Slider({
  label, value, min, max, step = 1, unit = "px",
  leftLabel, rightLabel, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; leftLabel?: string; rightLabel?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-cyber-neon font-mono text-sm font-bold">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-gray-600 font-mono">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

function ColorPicker({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>
      <div className="flex items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c} type="button"
              onClick={() => onChange(c)}
              className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
              style={{
                background: c,
                borderColor: value === c ? "#ffffff" : "transparent",
                boxShadow: value === c ? "0 0 0 1px #a855f7" : "none",
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color" value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
          <input
            type="text" value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 px-2 py-1 text-xs font-mono bg-cyber-purple/20 border border-cyber-glass-border rounded-lg text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminHeroPage() {
  const { heroSettings, tournaments, updateHeroSettings } = useContentStore();
  const { heroBlobVideo, setHeroBlobVideo } = useMediaBlobStore();
  const [form, setForm] = useState({ ...heroSettings });
  const [toast, setToast] = useState({ show: false, message: "" });
  const [localVideoBlob, setLocalVideoBlob] = useState<string>(heroBlobVideo || "");
  const activePreviewVideo = localVideoBlob || form.backgroundVideo || "";

  // Restore blob from IndexedDB on mount
  useEffect(() => {
    if (localVideoBlob) return;
    loadVideoDB("hero-bg").then((url) => {
      if (url) {
        setLocalVideoBlob(url);
        setHeroBlobVideo(url);
      }
    });
  }, []);

  function showToast(msg: string) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateHeroSettings(form);
    // Publish blob video to global in-memory store so HeroSection sees it immediately
    if (localVideoBlob) setHeroBlobVideo(localVideoBlob);
    showToast("✓ Hero баннер сохранён");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const tournamentOptions = [
    { value: "", label: "— Выберите турнир —" },
    ...tournaments.map((t) => ({ value: t.id, label: `${t.title} (${t.status})` })),
  ];

  // Preview headline split
  const hl = form.headline || "CYBERQELN";
  const half = Math.ceil(hl.length / 2);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Hero баннер</h1>
          <p className="text-gray-500 text-sm mt-1">Настройка главного экрана сайта</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-cyber-neon hover:text-white transition-all text-sm">
          <Eye className="w-4 h-4" />
          Просмотр сайта
        </Link>
      </div>

      <form onSubmit={save} className="space-y-6">

        {/* Mode switch */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-4">Режим заголовка</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setF("heroMode", "text")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                form.heroMode !== "logo"
                  ? "border-cyber-neon bg-cyber-neon/10 text-white"
                  : "border-cyber-glass-border text-gray-400 hover:border-cyber-neon/40"
              }`}
            >
              <Type className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">Текстовый заголовок</div>
                <div className="text-xs opacity-60">Свой текст с выбором цветов</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setF("heroMode", "logo")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                form.heroMode === "logo"
                  ? "border-cyber-neon bg-cyber-neon/10 text-white"
                  : "border-cyber-glass-border text-gray-400 hover:border-cyber-neon/40"
              }`}
            >
              <Image className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">Логотип (картинка)</div>
                <div className="text-xs opacity-60">PNG/SVG вместо текста</div>
              </div>
            </button>
          </div>
        </div>

        {/* Text mode */}
        {form.heroMode !== "logo" && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="font-display font-bold text-white">Текст заголовка</h2>

            <FormField label="Первая строка заголовка">
              <Input value={form.headline} onChange={(e) => setF("headline", e.target.value)} placeholder="CYBER" />
            </FormField>

            <ColorPicker
              label="Цвет первой строки"
              value={form.headlineColor || "#ffffff"}
              onChange={(v) => setF("headlineColor", v)}
            />

            <ColorPicker
              label="Цвет второй строки (вторая половина)"
              value={form.headlineColor2 || "#a855f7"}
              onChange={(v) => setF("headlineColor2", v)}
            />

            <FormField label="Подзаголовок (строка под заголовком)">
              <Input value={form.subheadline} onChange={(e) => setF("subheadline", e.target.value)} placeholder="ESPORTS ECOSYSTEM" />
            </FormField>

            <ColorPicker
              label="Цвет подзаголовка"
              value={form.subheadlineColor || "#9ca3af"}
              onChange={(v) => setF("subheadlineColor", v)}
            />
          </div>
        )}

        {/* Logo mode */}
        {form.heroMode === "logo" && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="font-display font-bold text-white">Логотип в Hero</h2>

            <ImageField
              label="Картинка логотипа (PNG, SVG, WebP)"
              value={form.heroLogoUrl}
              onChange={(v) => setF("heroLogoUrl", v)}
            />

            <div className="space-y-4 pt-2">
              <Slider
                label="Размер логотипа"
                value={form.heroLogoHeight ?? 120}
                min={60} max={400} step={4}
                leftLabel="60px (маленький)" rightLabel="400px (большой)"
                onChange={(v) => setF("heroLogoHeight", v)}
              />
              <Slider
                label="Сдвиг по горизонтали"
                value={form.heroLogoOffsetX ?? 0}
                min={-200} max={200}
                leftLabel="← влево" rightLabel="вправо →"
                onChange={(v) => setF("heroLogoOffsetX", v)}
              />
              <Slider
                label="Сдвиг по вертикали"
                value={form.heroLogoOffsetY ?? 0}
                min={-100} max={100}
                leftLabel="↑ вверх" rightLabel="вниз ↓"
                onChange={(v) => setF("heroLogoOffsetY", v)}
              />
            </div>

            <FormField label="Подзаголовок под логотипом">
              <Input value={form.subheadline} onChange={(e) => setF("subheadline", e.target.value)} placeholder="ESPORTS ECOSYSTEM" />
            </FormField>

            <ColorPicker
              label="Цвет подзаголовка"
              value={form.subheadlineColor || "#9ca3af"}
              onChange={(v) => setF("subheadlineColor", v)}
            />
          </div>
        )}

        {/* Other settings */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-bold text-white">Прочие настройки Hero</h2>

          <FormField label="Текст кнопки CTA">
            <Input value={form.ctaText} onChange={(e) => setF("ctaText", e.target.value)} placeholder="Участвовать" />
          </FormField>

          <FormField label="Featured турнир (карточка на главной)">
            <Select
              value={form.featuredTournamentId}
              onChange={(e) => setF("featuredTournamentId", e.target.value)}
              options={tournamentOptions}
            />
          </FormField>

          {/* Background block */}
          <div className="space-y-4 p-4 bg-cyber-black/30 rounded-xl border border-cyber-glass-border">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Фон Hero</p>

            <ImageField
              value={form.backgroundImage}
              onChange={(v) => setF("backgroundImage", v)}
              label="Фоновое изображение (jpg/png/webp)"
            />

            {/* Video upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Фоновое видео (mp4/webm) — приоритет над картинкой
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.backgroundVideo ?? ""}
                  onChange={(e) => setF("backgroundVideo", e.target.value)}
                  placeholder="https://... или загрузи файл"
                  className="flex-1 px-3 py-2 bg-cyber-glass border border-cyber-glass-border rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50"
                />
                <label className="flex-shrink-0 px-3 py-2 bg-cyber-purple/40 border border-cyber-glass-border rounded-xl text-gray-300 hover:text-white hover:border-cyber-neon/50 text-xs font-mono transition-all whitespace-nowrap cursor-pointer">
                  📁 Файл
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (localVideoBlob?.startsWith("blob:")) URL.revokeObjectURL(localVideoBlob);
                      const blobUrl = URL.createObjectURL(file);
                      setLocalVideoBlob(blobUrl);
                      setHeroBlobVideo(blobUrl);
                      setF("backgroundVideo", "");
                      // Save to IndexedDB so video survives page refresh
                      saveVideoDB("hero-bg", file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {(localVideoBlob || form.backgroundVideo) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (localVideoBlob?.startsWith("blob:")) URL.revokeObjectURL(localVideoBlob);
                      setLocalVideoBlob("");
                      setHeroBlobVideo("");
                      setF("backgroundVideo", "");
                      deleteVideoDB("hero-bg");
                    }}
                    className="px-3 py-2 text-red-400 hover:text-red-300 text-xs border border-red-500/20 rounded-xl"
                  >
                    Удалить
                  </button>
                )}
              </div>
              {activePreviewVideo && (
                <video
                  key={activePreviewVideo}
                  src={activePreviewVideo}
                  muted autoPlay loop playsInline
                  className="w-full max-h-32 object-cover rounded-lg border border-cyber-glass-border mt-1"
                />
              )}
              {localVideoBlob && (
                <p className="text-xs text-yellow-500/80 font-mono">
                  ⚠ Загруженный файл работает только в текущей сессии. Для постоянного видео вставь ссылку (http://...).
                </p>
              )}
            </div>

            <Slider
              label="Затемнение фона"
              value={form.backgroundOverlay ?? 60}
              min={0} max={95} step={5}
              unit="%"
              leftLabel="0% (без затемнения)" rightLabel="95% (почти чёрный)"
              onChange={(v) => setF("backgroundOverlay", v)}
            />
          </div>

          <Toggle checked={form.showLiveBadge} onChange={(v) => setF("showLiveBadge", v)} label="Показывать Live бейдж" />
        </div>

        {/* Live preview */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-4">Предпросмотр</h2>
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-cyber-purple to-cyber-dark min-h-52 flex items-center px-8 py-8">
            {activePreviewVideo ? (
              <video key={activePreviewVideo} src={activePreviewVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : form.backgroundImage ? (
              <img src={form.backgroundImage} className="absolute inset-0 w-full h-full object-cover" alt="" />
            ) : null}
            <div className="absolute inset-0 bg-cyber-black" style={{ opacity: (form.backgroundOverlay ?? 60) / 100 }} />
            <div className="absolute inset-0 cyber-grid-bg opacity-20" />
            <div className="relative z-10">
              {form.showLiveBadge && (
                <div className="inline-flex items-center gap-2 mb-4 bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  LIVE NOW
                </div>
              )}

              {form.heroMode === "logo" ? (
                form.heroLogoUrl ? (
                  <img
                    src={form.heroLogoUrl}
                    alt="hero logo"
                    style={{
                      height: `${Math.min(form.heroLogoHeight ?? 120, 180)}px`,
                      transform: `translate(${form.heroLogoOffsetX ?? 0}px, ${form.heroLogoOffsetY ?? 0}px)`,
                    }}
                    className="object-contain mb-2"
                  />
                ) : (
                  <div className="w-40 h-20 rounded-xl border-2 border-dashed border-cyber-glass-border flex items-center justify-center text-gray-500 text-xs mb-2">
                    Загрузи логотип
                  </div>
                )
              ) : (
                <h1 className="font-display font-black leading-none mb-2">
                  <span className="block text-4xl" style={{ color: form.headlineColor || "#ffffff" }}>
                    {hl.length > 6 ? hl.slice(0, half) : hl}
                  </span>
                  {hl.length > 6 && (
                    <span className="block text-4xl" style={{ color: form.headlineColor2 || "#a855f7" }}>
                      {hl.slice(half)}
                    </span>
                  )}
                </h1>
              )}

              <p className="text-xl font-display tracking-widest" style={{ color: form.subheadlineColor || "#9ca3af" }}>
                {form.subheadline || "ESPORTS ECOSYSTEM"}
              </p>

              <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl text-sm">
                {form.ctaText || "Участвовать"}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-display font-bold rounded-xl hover:shadow-neon transition-all">
          <Save className="w-4 h-4" />
          Сохранить Hero
        </button>
      </form>

      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
