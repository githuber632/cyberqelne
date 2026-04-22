"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Plus, Pencil, Trash2, Save, X, ChevronDown } from "lucide-react";
import { useContentStore, SocialLink, FaqItem, CommunityStat } from "@/store/contentStore";
import { cn } from "@/lib/utils";

type Tab = "page" | "socials" | "faq" | "stats";

const TABS: { id: Tab; label: string }[] = [
  { id: "page", label: "Страница" },
  { id: "socials", label: "Соцсети" },
  { id: "faq", label: "FAQ" },
  { id: "stats", label: "Статистика" },
];

const ICON_OPTIONS = ["Users", "Trophy", "Star", "MessageCircle"] as const;
const COLOR_OPTIONS = [
  { label: "Фиолетовый", value: "text-cyber-neon" },
  { label: "Жёлтый", value: "text-yellow-400" },
  { label: "Розовый", value: "text-pink-400" },
  { label: "Синий", value: "text-blue-400" },
  { label: "Зелёный", value: "text-green-400" },
  { label: "Красный", value: "text-red-400" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono transition-colors", className)}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 font-mono transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-neon/50 font-mono transition-colors"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ─── TAB: PAGE ───────────────────────────────────────────

function PageTab() {
  const { communitySettings: c, updateCommunitySettings } = useContentStore();
  const [form, setForm] = useState({
    title: c.title, subtitle: c.subtitle,
    socialsTitle: c.socialsTitle, faqTitle: c.faqTitle,
    ctaTitle: c.ctaTitle, ctaSubtitle: c.ctaSubtitle,
    ctaPrimaryText: c.ctaPrimaryText, ctaPrimaryHref: c.ctaPrimaryHref,
    ctaSecondaryText: c.ctaSecondaryText, ctaSecondaryHref: c.ctaSecondaryHref,
  });
  const [saved, setSaved] = useState(false);

  function save() {
    updateCommunitySettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-white">Заголовок страницы</h3>
        <Field label="Заголовок"><Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} /></Field>
        <Field label="Подзаголовок"><Input value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} /></Field>
        <Field label="Заголовок секции Соцсети"><Input value={form.socialsTitle} onChange={(v) => setForm({ ...form, socialsTitle: v })} /></Field>
        <Field label="Заголовок секции FAQ"><Input value={form.faqTitle} onChange={(v) => setForm({ ...form, faqTitle: v })} /></Field>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-white">CTA блок</h3>
        <Field label="Заголовок CTA"><Input value={form.ctaTitle} onChange={(v) => setForm({ ...form, ctaTitle: v })} /></Field>
        <Field label="Подзаголовок CTA"><Input value={form.ctaSubtitle} onChange={(v) => setForm({ ...form, ctaSubtitle: v })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Кнопка 1 — текст"><Input value={form.ctaPrimaryText} onChange={(v) => setForm({ ...form, ctaPrimaryText: v })} /></Field>
          <Field label="Кнопка 1 — ссылка"><Input value={form.ctaPrimaryHref} onChange={(v) => setForm({ ...form, ctaPrimaryHref: v })} /></Field>
          <Field label="Кнопка 2 — текст"><Input value={form.ctaSecondaryText} onChange={(v) => setForm({ ...form, ctaSecondaryText: v })} /></Field>
          <Field label="Кнопка 2 — ссылка"><Input value={form.ctaSecondaryHref} onChange={(v) => setForm({ ...form, ctaSecondaryHref: v })} /></Field>
        </div>
      </div>

      <button onClick={save} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all", saved ? "bg-green-500/20 text-green-400 border border-green-500/40" : "bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white hover:shadow-neon")}>
        <Save className="w-4 h-4" />
        {saved ? "Сохранено!" : "Сохранить"}
      </button>
    </div>
  );
}

// ─── TAB: SOCIALS ────────────────────────────────────────

function SocialsTab() {
  const { communitySettings: c, addSocial, updateSocial, deleteSocial } = useContentStore();
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [adding, setAdding] = useState(false);
  const emptyForm = { name: "", desc: "", icon: "✈️", color: "from-blue-600 to-blue-400", members: "0", href: "#" };
  const [form, setForm] = useState(emptyForm);

  function openAdd() { setForm(emptyForm); setAdding(true); setEditing(null); }
  function openEdit(s: SocialLink) { setForm(s); setEditing(s); setAdding(false); }
  function close() { setAdding(false); setEditing(null); }

  function save() {
    if (!form.name.trim()) return;
    if (adding) addSocial(form);
    else if (editing) updateSocial(editing.id, form);
    close();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm font-mono">{c.socials.length} платформ</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white text-sm font-display font-bold hover:shadow-neon transition-all">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {c.socials.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl flex-shrink-0", s.color)}>{s.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-white text-sm">{s.name}</div>
              <div className="text-gray-500 text-xs font-mono truncate">{s.desc}</div>
              <div className="text-cyber-neon text-xs font-mono mt-0.5">{s.members} · {s.href}</div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-neon/20 flex items-center justify-center text-gray-400 hover:text-cyber-neon transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => deleteSocial(s.id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(adding || editing) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-card rounded-2xl p-6 space-y-4 border border-cyber-neon/30">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-white">{adding ? "Добавить платформу" : "Редактировать"}</h3>
              <button onClick={close} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Название"><Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Telegram" /></Field>
              <Field label="Иконка (emoji)"><Input value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} placeholder="✈️" /></Field>
              <Field label="Описание"><Input value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} placeholder="Канал новостей..." /></Field>
              <Field label="Участников"><Input value={form.members} onChange={(v) => setForm({ ...form, members: v })} placeholder="12.4K" /></Field>
              <Field label="Ссылка"><Input value={form.href} onChange={(v) => setForm({ ...form, href: v })} placeholder="https://t.me/..." /></Field>
              <Field label="Градиент (Tailwind)"><Input value={form.color} onChange={(v) => setForm({ ...form, color: v })} placeholder="from-blue-600 to-blue-400" /></Field>
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="px-5 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white text-sm font-display font-bold hover:shadow-neon transition-all">Сохранить</button>
              <button onClick={close} className="px-5 py-2 glass-card rounded-xl text-gray-400 text-sm font-display font-bold hover:text-white transition-all">Отмена</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TAB: FAQ ────────────────────────────────────────────

function FaqTab() {
  const { communitySettings: c, addFaq, updateFaq, deleteFaq } = useContentStore();
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [adding, setAdding] = useState(false);
  const emptyForm = { q: "", a: "" };
  const [form, setForm] = useState(emptyForm);

  function openAdd() { setForm(emptyForm); setAdding(true); setEditing(null); }
  function openEdit(f: FaqItem) { setForm(f); setEditing(f); setAdding(false); }
  function close() { setAdding(false); setEditing(null); }

  function save() {
    if (!form.q.trim()) return;
    if (adding) addFaq(form);
    else if (editing) updateFaq(editing.id, form);
    close();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm font-mono">{c.faq.length} вопросов</p>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white text-sm font-display font-bold hover:shadow-neon transition-all">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      <div className="space-y-3">
        {c.faq.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-white text-sm mb-1">{item.q}</div>
                <div className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.a}</div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-neon/20 flex items-center justify-center text-gray-400 hover:text-cyber-neon transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteFaq(item.id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(adding || editing) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-card rounded-2xl p-6 space-y-4 border border-cyber-neon/30">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-white">{adding ? "Добавить вопрос" : "Редактировать"}</h3>
              <button onClick={close} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <Field label="Вопрос"><Input value={form.q} onChange={(v) => setForm({ ...form, q: v })} placeholder="Как зарегистрироваться?" /></Field>
            <Field label="Ответ"><Textarea value={form.a} onChange={(v) => setForm({ ...form, a: v })} placeholder="Подробный ответ..." rows={4} /></Field>
            <div className="flex gap-3">
              <button onClick={save} className="px-5 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white text-sm font-display font-bold hover:shadow-neon transition-all">Сохранить</button>
              <button onClick={close} className="px-5 py-2 glass-card rounded-xl text-gray-400 text-sm font-display font-bold hover:text-white transition-all">Отмена</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TAB: STATS ──────────────────────────────────────────

function StatsTab() {
  const { communitySettings: c, updateCommunityStat } = useContentStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, CommunityStat>>({});

  function startEdit(s: CommunityStat) {
    setForms((prev) => ({ ...prev, [s.id]: { ...s } }));
    setEditing(s.id);
  }

  function save(id: string) {
    updateCommunityStat(id, forms[id]);
    setEditing(null);
  }

  return (
    <div className="space-y-4 max-w-xl">
      <p className="text-gray-400 text-sm font-mono">4 статистики на странице сообщества</p>
      {c.stats.map((s) => (
        <div key={s.id} className="glass-card rounded-xl p-4">
          {editing === s.id && forms[s.id] ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Значение"><Input value={forms[s.id].value} onChange={(v) => setForms((p) => ({ ...p, [s.id]: { ...p[s.id], value: v } }))} placeholder="12,400+" /></Field>
                <Field label="Подпись"><Input value={forms[s.id].label} onChange={(v) => setForms((p) => ({ ...p, [s.id]: { ...p[s.id], label: v } }))} placeholder="Игроков" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Иконка">
                  <Select value={forms[s.id].iconName} onChange={(v) => setForms((p) => ({ ...p, [s.id]: { ...p[s.id], iconName: v as CommunityStat["iconName"] } }))}
                    options={ICON_OPTIONS.map((ic) => ({ label: ic, value: ic }))} />
                </Field>
                <Field label="Цвет">
                  <Select value={forms[s.id].color} onChange={(v) => setForms((p) => ({ ...p, [s.id]: { ...p[s.id], color: v } }))}
                    options={COLOR_OPTIONS} />
                </Field>
              </div>
              <div className="flex gap-2">
                <button onClick={() => save(s.id)} className="px-4 py-1.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-lg text-white text-xs font-display font-bold hover:shadow-neon transition-all">Сохранить</button>
                <button onClick={() => setEditing(null)} className="px-4 py-1.5 glass-card rounded-lg text-gray-400 text-xs font-display font-bold hover:text-white transition-all">Отмена</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={cn("text-xl font-display font-black", s.color)}>{s.value}</span>
                <span className="text-gray-400 text-sm font-mono">{s.label}</span>
                <span className="text-gray-600 text-xs font-mono">({s.iconName})</span>
              </div>
              <button onClick={() => startEdit(s)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyber-neon/20 flex items-center justify-center text-gray-400 hover:text-cyber-neon transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────

export default function AdminCommunityPage() {
  const [tab, setTab] = useState<Tab>("page");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-white">Сообщество</h1>
          <p className="text-gray-500 text-sm font-mono">Управление страницей сообщества</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass-card rounded-xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("px-4 py-2 rounded-lg text-sm font-display font-bold transition-all", tab === t.id ? "bg-cyber-neon/20 text-cyber-neon" : "text-gray-500 hover:text-white")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {tab === "page" && <PageTab />}
          {tab === "socials" && <SocialsTab />}
          {tab === "faq" && <FaqTab />}
          {tab === "stats" && <StatsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
