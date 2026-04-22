"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search } from "lucide-react";
import { useContentStore, type NewsArticle } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Textarea, Select, Toggle, SaveButton, ImageField } from "@/components/admin/FormField";
import { cn } from "@/lib/utils";

const categories = ["Турниры", "Анонс", "Интервью", "Аналитика", "Команды", "Патч-ноты", "Общее"];

const emptyForm: Omit<NewsArticle, "id"> = {
  title: "",
  excerpt: "",
  content: "",
  category: "Общее",
  author: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  readTime: 3,
  featured: false,
  published: true,
  image: "",
};

export default function AdminNewsPage() {
  const { news, addNews, updateNews, deleteNews } = useContentStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<Omit<NewsArticle, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  function showToast(msg: string) { setToast({ show: true, message: msg }); setTimeout(() => setToast({ show: false, message: "" }), 3500); }

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(article: NewsArticle) {
    setEditing(article);
    setForm({ title: article.title, excerpt: article.excerpt, content: article.content, category: article.category, author: article.author, publishedAt: article.publishedAt, readTime: article.readTime, featured: article.featured, published: article.published, image: article.image });
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateNews(editing.id, form);
    } else {
      addNews({ ...form, publishedAt: new Date().toISOString() });
    }
    setModalOpen(false);
    showToast(editing ? "✓ Изменения сохранены" : "✓ Запись успешно создана");
  }

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление новостями</h1>
          <p className="text-gray-500 text-sm mt-1">{news.length} статей в базе</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Новая статья
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по заголовку или категории..."
          className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-glass-border">
                {["Заголовок", "Категория", "Автор", "Статус", "Главная", "Дата", "Действия"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-glass-border">
              {filtered.map((article, i) => (
                <motion.tr
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyber-purple/30 flex items-center justify-center text-sm flex-shrink-0">
                        {article.image ? (
                          <img src={article.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                        ) : "📰"}
                      </div>
                      <p className="text-white text-sm font-medium max-w-[200px] truncate">{article.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-400 bg-cyber-purple/20 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{article.author}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "flex items-center gap-1 text-xs font-mono w-fit",
                      article.published ? "text-green-400" : "text-gray-500"
                    )}>
                      {article.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {article.published ? "Опубл." : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateNews(article.id, { featured: !article.featured })}
                      className={cn("transition-colors", article.featured ? "text-yellow-400" : "text-gray-700 hover:text-yellow-400")}
                    >
                      <Star className="w-4 h-4" fill={article.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {new Date(article.publishedAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(article)}
                        className="p-1.5 text-gray-500 hover:text-cyber-neon transition-colors rounded-lg hover:bg-cyber-neon/10"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(article.id)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <p>Статьи не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Редактировать статью" : "Новая статья"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Заголовок" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Заголовок статьи" required />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Категория" required>
              <Select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                options={categories.map((c) => ({ value: c, label: c }))}
              />
            </FormField>
            <FormField label="Автор" required>
              <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Имя автора" required />
            </FormField>
          </div>

          <FormField label="Краткое описание" required>
            <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Краткое описание для превью..." rows={2} required />
          </FormField>

          <FormField label="Полный текст статьи" required>
            <Textarea value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Полный текст статьи..." rows={6} required />
          </FormField>

          <ImageField value={form.image} onChange={(v) => set("image", v)} label="Обложка статьи (URL изображения)" />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Время чтения (мин)">
              <Input type="number" value={form.readTime} onChange={(e) => set("readTime", Number(e.target.value))} min={1} max={60} />
            </FormField>
            <FormField label="Дата публикации">
              <Input type="datetime-local" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
            </FormField>
          </div>

          <div className="flex items-center gap-8">
            <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Опубликовать" />
            <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="⭐ Главная новость" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">
              Отмена
            </button>
            <SaveButton label={editing ? "Сохранить изменения" : "Опубликовать"} />
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить статью?" size="sm">
        <p className="text-gray-400 mb-6">Это действие нельзя отменить. Статья будет удалена навсегда.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">
            Отмена
          </button>
          <button
            onClick={() => { if (confirmDelete) { deleteNews(confirmDelete); setConfirmDelete(null); } }}
            className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold"
          >
            Удалить
          </button>
        </div>
      </Modal>
      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
