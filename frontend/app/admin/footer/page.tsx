"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, Check, X, GripVertical, Link as LinkIcon, Share2 } from "lucide-react";
import { useContentStore, type FooterSection, type FooterLink, type FooterSocial } from "@/store/contentStore";
import { SOCIAL_PLATFORMS, getSocialPlatform } from "@/lib/socialIcons";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

// ─── Inline editable text ───────────────────────────────────

function EditableText({
  value, onSave, placeholder, className,
}: { value: string; onSave: (v: string) => void; placeholder?: string; className?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() { onSave(draft); setEditing(false); }
  function cancel() { setDraft(value); setEditing(false); }

  if (editing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          className={`bg-cyber-purple/20 border border-cyber-neon/40 rounded-lg px-2 py-1 text-white text-sm font-mono focus:outline-none flex-1 ${className}`}
          placeholder={placeholder} />
        <button onClick={commit} className="p-1 text-green-400 hover:text-green-300"><Check className="w-3.5 h-3.5" /></button>
        <button onClick={cancel} className="p-1 text-gray-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
      </div>
    );
  }
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      className={`text-left hover:text-cyber-neon transition-colors group flex items-center gap-1.5 ${className}`}>
      {value || <span className="text-gray-600 italic">{placeholder}</span>}
      <Edit className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
    </button>
  );
}

// ─── Platform icon picker ────────────────────────────────────

function PlatformPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {SOCIAL_PLATFORMS.map((p) => {
        const active = value === p.id;
        return (
          <button key={p.id} type="button" onClick={() => onChange(p.id)}
            className={cn(
              "py-2 rounded-lg border flex flex-col items-center gap-1 transition-all",
              active ? "border-cyber-neon/60 bg-cyber-neon/10 text-cyber-neon" : "border-cyber-glass-border text-gray-500 hover:text-white hover:border-white/20"
            )}>
            <p.Icon className="w-4 h-4" />
            <span className="text-[10px] font-mono leading-none">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Link row ───────────────────────────────────────────────

function LinkRow({ link, sectionId }: { link: FooterLink; sectionId: string }) {
  const { updateFooterLink, deleteFooterLink } = useContentStore();

  return (
    <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-white/5 group">
      <GripVertical className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
        <EditableText value={link.label} onSave={(v) => updateFooterLink(sectionId, link.id, { label: v })} placeholder="Название" className="text-white text-sm" />
        <EditableText value={link.href} onSave={(v) => updateFooterLink(sectionId, link.id, { href: v })} placeholder="/путь" className="text-gray-400 text-xs font-mono" />
      </div>
      <button onClick={() => deleteFooterLink(sectionId, link.id)}
        className="p-1 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Section card ────────────────────────────────────────────

function SectionCard({ section }: { section: FooterSection }) {
  const { updateFooterSection, deleteFooterSection, addFooterLink } = useContentStore();
  const [addingLink, setAddingLink] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  function submitLink() {
    if (!newLabel.trim()) return;
    addFooterLink(section.id, { label: newLabel.trim(), href: newHref.trim() || "/" });
    setNewLabel(""); setNewHref(""); setAddingLink(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-glass-border">
        <EditableText value={section.title} onSave={(v) => updateFooterSection(section.id, { title: v })}
          placeholder="Заголовок" className="font-display font-bold text-white uppercase text-sm tracking-wider" />
        <button onClick={() => deleteFooterSection(section.id)}
          className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-2">
        {section.links.map((link) => (
          <LinkRow key={link.id} link={link} sectionId={section.id} />
        ))}

        {addingLink ? (
          <div className="px-3 py-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input autoFocus value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Название"
                className="bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyber-neon/50" />
              <input value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="/путь или https://..."
                onKeyDown={(e) => { if (e.key === "Enter") submitLink(); if (e.key === "Escape") setAddingLink(false); }}
                className="bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-cyber-neon/50" />
            </div>
            <div className="flex gap-2">
              <button onClick={submitLink} className="px-3 py-1 bg-cyber-neon/20 border border-cyber-neon/40 rounded-lg text-cyber-neon text-xs font-mono hover:bg-cyber-neon/30 transition-all">Добавить</button>
              <button onClick={() => setAddingLink(false)} className="px-3 py-1 text-gray-500 hover:text-white text-xs transition-colors">Отмена</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingLink(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-cyber-neon hover:bg-cyber-neon/5 rounded-lg text-xs font-mono transition-all">
            <Plus className="w-3 h-3" /> Добавить ссылку
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Social row ──────────────────────────────────────────────

function SocialRow({ social }: { social: FooterSocial }) {
  const { updateFooterSocial, deleteFooterSocial } = useContentStore();
  const platform = getSocialPlatform(social.iconId);
  const Icon = platform.Icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-cyber-glass-border rounded-xl overflow-hidden mb-2">
      <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-white/5 group">
        <div className={cn("w-8 h-8 rounded-lg glass-card flex items-center justify-center flex-shrink-0 text-gray-400", platform.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold">{social.label}</div>
          <div className="text-gray-500 text-xs font-mono truncate">{social.href}</div>
        </div>
        <button onClick={() => setExpanded((v) => !v)}
          className="p-1.5 text-gray-500 hover:text-cyber-neon rounded-lg transition-colors">
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => deleteFooterSocial(social.id)}
          className="p-1.5 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 rounded-lg transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-cyber-glass-border pt-3 bg-cyber-purple/5">
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase mb-2">Платформа</p>
            <PlatformPicker value={social.iconId} onChange={(id) => {
              const p = SOCIAL_PLATFORMS.find((pl) => pl.id === id);
              updateFooterSocial(social.id, { iconId: id, label: p?.label ?? social.label });
            }} />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase mb-1.5">Название</p>
            <input value={social.label} onChange={(e) => updateFooterSocial(social.id, { label: e.target.value })}
              className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-cyber-neon/50" />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase mb-1.5">Ссылка</p>
            <input value={social.href} onChange={(e) => updateFooterSocial(social.id, { href: e.target.value })}
              className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-cyber-neon/50" />
          </div>
          <button onClick={() => setExpanded(false)} className="text-xs text-gray-500 hover:text-white transition-colors font-mono">Свернуть</button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────

export default function AdminFooterPage() {
  const { footerSettings, updateFooterSettings, addFooterSection, addFooterSocial } = useContentStore();

  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSocial, setAddingSocial] = useState(false);
  const [newSocial, setNewSocial] = useState({ iconId: "youtube", label: "YouTube", href: "" });
  const [toast, setToast] = useState({ show: false, message: "" });

  function showToast(msg: string) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  }

  function submitSection() {
    if (!newSectionTitle.trim()) return;
    addFooterSection({ title: newSectionTitle.trim(), links: [] });
    setNewSectionTitle(""); setAddingSection(false);
    showToast("✓ Раздел добавлен");
  }

  function submitSocial() {
    if (!newSocial.href.trim()) return;
    addFooterSocial({ iconId: newSocial.iconId, label: newSocial.label, href: newSocial.href.trim() });
    setNewSocial({ iconId: "youtube", label: "YouTube", href: "" });
    setAddingSocial(false);
    showToast("✓ Соцсеть добавлена");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-black text-2xl text-white">Управление футером</h1>
        <p className="text-gray-500 text-sm mt-1">Изменения применяются немедленно</p>
      </div>

      {/* Description & Copyright */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-bold text-white flex items-center gap-2 mb-4">
          <span className="w-1.5 h-5 bg-cyber-neon rounded-full" />
          Основное
        </h2>
        <FormField label="Описание">
          <textarea value={footerSettings.description} onChange={(e) => updateFooterSettings({ description: e.target.value })} rows={2}
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono resize-none" />
        </FormField>
        <FormField label="Копирайт">
          <Input value={footerSettings.copyright} onChange={(e) => updateFooterSettings({ copyright: e.target.value })} placeholder="© 2026 CyberQELN..." />
        </FormField>
      </div>

      {/* Link sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyber-neon" />
            Разделы ссылок
          </h2>
          <button onClick={() => setAddingSection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl text-sm hover:shadow-neon transition-all">
            <Plus className="w-4 h-4" /> Добавить раздел
          </button>
        </div>

        {addingSection && (
          <div className="glass-card rounded-xl p-4 mb-4 flex items-center gap-3">
            <input autoFocus value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="Название раздела"
              onKeyDown={(e) => { if (e.key === "Enter") submitSection(); if (e.key === "Escape") setAddingSection(false); }}
              className="flex-1 bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-cyber-neon/50" />
            <button onClick={submitSection} className="px-4 py-2 bg-cyber-neon/20 border border-cyber-neon/40 rounded-lg text-cyber-neon text-sm font-mono hover:bg-cyber-neon/30 transition-all">Создать</button>
            <button onClick={() => setAddingSection(false)} className="p-2 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {footerSettings.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>

      {/* Social links */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-glass-border">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyber-neon" />
            Социальные сети
          </h2>
          <button onClick={() => setAddingSocial((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 glass-card rounded-lg text-gray-400 hover:text-cyber-neon text-sm transition-all">
            <Plus className="w-3.5 h-3.5" /> Добавить
          </button>
        </div>

        <div className="p-4">
          {footerSettings.socials.map((social) => (
            <SocialRow key={social.id} social={social} />
          ))}

          {addingSocial && (
            <div className="border border-cyber-glass-border rounded-xl p-4 space-y-4 mt-2 bg-cyber-purple/5">
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase mb-2">Платформа</p>
                <PlatformPicker value={newSocial.iconId} onChange={(id) => {
                  const p = SOCIAL_PLATFORMS.find((pl) => pl.id === id);
                  setNewSocial((s) => ({ ...s, iconId: id, label: p?.label ?? s.label }));
                }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-1.5">Название</p>
                  <input value={newSocial.label} onChange={(e) => setNewSocial((s) => ({ ...s, label: e.target.value }))}
                    className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-cyber-neon/50" />
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase mb-1.5">Ссылка</p>
                  <input value={newSocial.href} onChange={(e) => setNewSocial((s) => ({ ...s, href: e.target.value }))}
                    placeholder="https://..."
                    onKeyDown={(e) => { if (e.key === "Enter") submitSocial(); }}
                    className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-lg px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-cyber-neon/50" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={submitSocial} disabled={!newSocial.href.trim()}
                  className="px-4 py-1.5 bg-cyber-neon/20 border border-cyber-neon/40 rounded-lg text-cyber-neon text-xs font-mono hover:bg-cyber-neon/30 transition-all disabled:opacity-40">
                  Добавить
                </button>
                <button onClick={() => setAddingSocial(false)} className="px-4 py-1.5 text-gray-500 hover:text-white text-xs transition-colors">Отмена</button>
              </div>
            </div>
          )}

          {footerSettings.socials.length === 0 && !addingSocial && (
            <p className="text-center text-gray-600 font-mono text-sm py-4">Нет соцсетей</p>
          )}
        </div>
      </div>

      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
