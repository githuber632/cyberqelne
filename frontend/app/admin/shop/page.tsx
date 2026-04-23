"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, Search, ShoppingBag, Zap } from "lucide-react";
import { useContentStore, type Product } from "@/store/contentStore";
import { Modal } from "@/components/admin/Modal";
import { AdminToast } from "@/components/admin/Toast";
import { FormField, Input, Textarea, Select, Toggle, SaveButton } from "@/components/admin/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { cn } from "@/lib/utils";

const categoryOptions = [
  { value: "Одежда", label: "Одежда" },
  { value: "Периферия", label: "Периферия" },
  { value: "Аксессуары", label: "Аксессуары" },
  { value: "Цифровые", label: "Цифровые товары" },
  { value: "Игровые", label: "Игровые товары" },
];

const emptyForm: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  oldPrice: undefined,
  category: "Одежда",
  badge: "",
  badgeColor: "bg-red-500",
  icon: "📦",
  image: "",
  rating: 5,
  reviews: 0,
  inStock: true,
  featured: false,
};

export default function AdminShopPage() {
  const { products, addProduct, updateProduct, deleteProduct, shopPromo, updateShopPromo } = useContentStore();
  const [promoForm, setPromoForm] = useState({ ...shopPromo });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  function showToast(msg: string) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  }

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(p: Product) { setEditing(p); const { id, ...rest } = p; setForm(rest); setModalOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateProduct(editing.id, form);
    else addProduct(form);
    setModalOpen(false);
    showToast(editing ? "✓ Изменения сохранены" : "✓ Товар добавлен");
  }

  function setF<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function savePromo() {
    updateShopPromo(promoForm);
    showToast("✓ Промо-баннер сохранён");
  }

  return (
    <div className="space-y-8">
      {/* Промо-баннер */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-yellow-400/20 border border-yellow-400/40 rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-lg">Промо-баннер магазина</h2>
            <p className="text-gray-500 text-xs font-mono">Показывается внизу секции магазина на главной</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-400 text-sm">Активен</span>
            <button
              onClick={() => setPromoForm((f) => ({ ...f, enabled: !f.enabled }))}
              className={`w-10 h-5 rounded-full transition-colors ${promoForm.enabled ? "bg-cyber-neon" : "bg-gray-700"} relative`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${promoForm.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Заголовок">
            <Input value={promoForm.title} onChange={(e) => setPromoForm((f) => ({ ...f, title: e.target.value }))} placeholder="Первый заказ со скидкой 20%" />
          </FormField>
          <FormField label="Описание">
            <Input value={promoForm.description} onChange={(e) => setPromoForm((f) => ({ ...f, description: e.target.value }))} placeholder="Используй промокод при оформлении" />
          </FormField>
          <FormField label="Промокод">
            <Input value={promoForm.promoCode} onChange={(e) => setPromoForm((f) => ({ ...f, promoCode: e.target.value }))} placeholder="CYBER20" />
          </FormField>
          <FormField label="Текст кнопки">
            <Input value={promoForm.buttonText} onChange={(e) => setPromoForm((f) => ({ ...f, buttonText: e.target.value }))} placeholder="Открыть магазин" />
          </FormField>
          <FormField label="Ссылка кнопки">
            <Input value={promoForm.buttonHref} onChange={(e) => setPromoForm((f) => ({ ...f, buttonHref: e.target.value }))} placeholder="/shop" />
          </FormField>
        </div>
        <button onClick={savePromo} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-semibold text-sm hover:shadow-neon transition-all">
          Сохранить баннер
        </button>
      </div>

      {/* Список товаров */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Управление магазином</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} товаров</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all text-sm">
          <Plus className="w-4 h-4" />
          Добавить товар
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск товаров..."
          className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-glass-border">
                {["Товар", "Категория", "Цена", "Бейдж", "В наличии", "Featured", "Действия"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-mono uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-glass-border">
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-purple to-cyber-dark flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                        {p.image ? <img src={p.image} className="w-10 h-10 object-cover" alt="" /> : p.icon}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-gray-600 text-xs">⭐ {p.rating} ({p.reviews})</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-bold font-mono">{p.price.toLocaleString()} UZS</div>
                    {p.oldPrice && <div className="text-gray-600 text-xs line-through">{p.oldPrice.toLocaleString()}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {p.badge && (
                      <span className={cn("text-xs font-mono font-bold text-white px-2 py-0.5 rounded-full", p.badgeColor)}>{p.badge}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle checked={p.inStock} onChange={(v) => updateProduct(p.id, { inStock: v })} />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => updateProduct(p.id, { featured: !p.featured })}
                      className={cn("transition-colors", p.featured ? "text-yellow-400" : "text-gray-700 hover:text-yellow-400")}>
                      <Star className="w-4 h-4" fill={p.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-cyber-neon rounded-lg hover:bg-cyber-neon/10 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-mono text-sm">Товары не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Редактировать товар" : "Новый товар"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Название" required>
            <Input value={form.name} onChange={(e) => setF("name", e.target.value)} placeholder="Название товара" required />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Категория">
              <Select value={form.category} onChange={(e) => setF("category", e.target.value)} options={categoryOptions} />
            </FormField>
            <FormField label="Иконка (emoji)">
              <Input value={form.icon} onChange={(e) => setF("icon", e.target.value)} placeholder="👕" />
            </FormField>
          </div>

          <FormField label="Описание">
            <Textarea value={form.description} onChange={(e) => setF("description", e.target.value)} placeholder="Описание товара..." rows={3} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Цена (UZS)" required>
              <Input type="number" value={form.price} onChange={(e) => setF("price", Number(e.target.value))} min={0} required />
            </FormField>
            <FormField label="Старая цена (UZS)" hint="Оставьте пустым если нет скидки">
              <Input type="number" value={form.oldPrice || ""} onChange={(e) => setF("oldPrice", e.target.value ? Number(e.target.value) : undefined)} min={0} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Бейдж (текст)" hint="Например: HOT, NEW, SALE">
              <Input value={form.badge || ""} onChange={(e) => setF("badge", e.target.value)} placeholder="HOT" />
            </FormField>
            <FormField label="Цвет бейджа">
              <Select value={form.badgeColor || "bg-red-500"} onChange={(e) => setF("badgeColor", e.target.value)} options={[
                { value: "bg-red-500", label: "Красный" },
                { value: "bg-green-500", label: "Зелёный" },
                { value: "bg-yellow-500", label: "Жёлтый" },
                { value: "bg-purple-500", label: "Фиолетовый" },
                { value: "bg-cyber-neon", label: "Неоновый" },
              ]} />
            </FormField>
          </div>

          {/* Firebase Storage file upload */}
          <FormField label="Фото товара" hint={imageUploading ? "Загрузка... дождитесь завершения" : undefined}>
            <FileUpload
              onUpload={(url) => setF("image", url)}
              onUploadingChange={setImageUploading}
              currentUrl={form.image}
              storagePath="shop/products"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Рейтинг (1-5)">
              <Input type="number" value={form.rating} onChange={(e) => setF("rating", Number(e.target.value))} min={1} max={5} step={0.1} />
            </FormField>
            <FormField label="Кол-во отзывов">
              <Input type="number" value={form.reviews} onChange={(e) => setF("reviews", Number(e.target.value))} min={0} />
            </FormField>
          </div>

          <div className="flex items-center gap-8">
            <Toggle checked={form.inStock} onChange={(v) => setF("inStock", v)} label="В наличии" />
            <Toggle checked={form.featured} onChange={(v) => setF("featured", v)} label="⭐ Featured" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-glass-border">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
            <SaveButton label={imageUploading ? "Загрузка фото..." : editing ? "Сохранить" : "Добавить"} loading={imageUploading} />
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Удалить товар?" size="sm">
        <p className="text-gray-400 mb-6">Товар будет удалён из магазина навсегда.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors text-sm">Отмена</button>
          <button onClick={() => { if (confirmDelete) { deleteProduct(confirmDelete); setConfirmDelete(null); showToast("Товар удалён"); } }}
            className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">
            Удалить
          </button>
        </div>
      </Modal>

      <AdminToast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: "" })} />
    </div>
  );
}
