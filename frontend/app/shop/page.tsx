"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Star, Package, Tag, ChevronRight, Heart, Send, CheckCircle, Loader2 } from "lucide-react";
import { type Product } from "@/store/contentStore";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/store/authStore";
import { useContentStore } from "@/store/contentStore";
import { cn } from "@/lib/utils";

const DONATION_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

function DonationSection() {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState(50000);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const finalAmount = custom ? Number(custom.replace(/\D/g, "")) : amount;

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1000) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "donations"), {
        amount: finalAmount,
        name: name.trim() || user?.nickname || "Аноним",
        message: message.trim(),
        userId: user?.id || null,
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
        <h3 className="font-display font-bold text-2xl text-white mb-2">Спасибо за поддержку! 💜</h3>
        <p className="text-gray-400 text-sm">Мы свяжемся с тобой для оплаты</p>
        <button onClick={() => setDone(false)} className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors">Ещё раз</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preset amounts */}
      <div>
        <p className="text-gray-400 text-sm mb-3 font-mono">Выбери сумму (UZS)</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DONATION_AMOUNTS.map((a) => (
            <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
              className={cn("py-2.5 rounded-xl text-sm font-mono font-bold border transition-all",
                amount === a && !custom
                  ? "bg-cyber-neon/20 border-cyber-neon/60 text-cyber-neon"
                  : "border-cyber-glass-border text-gray-400 hover:border-cyber-neon/30 hover:text-white"
              )}>
              {a.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <p className="text-gray-400 text-sm mb-1.5 font-mono">Или своя сумма</p>
        <div className="relative">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
            placeholder="Введи сумму..."
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">UZS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-gray-400 text-xs mb-1.5 font-mono uppercase">Имя (опционально)</p>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={user?.nickname || "Аноним"}
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1.5 font-mono uppercase">Сообщение (опционально)</p>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Так держать!"
            className="w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyber-neon/50 text-sm font-mono" />
        </div>
      </div>

      <button onClick={handleDonate} disabled={loading || !finalAmount || finalAmount < 1000}
        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-display font-bold text-lg rounded-xl transition-all hover:shadow-[0_0_24px_rgba(236,72,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-white" />}
        {loading ? "Отправка..." : `Поддержать ${finalAmount?.toLocaleString() || ""} UZS`}
      </button>
      <p className="text-center text-gray-600 text-xs font-mono">Мы свяжемся через Telegram для оплаты</p>
    </div>
  );
}

export default function ShopPage() {
  const { products } = useContentStore();
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selected, setSelected] = useState<(typeof products)[0] | null>(null);

  const available = products.filter((p) => p.inStock);
  const categories = ["Все", ...Array.from(new Set(available.map((p) => p.category)))];
  const filtered = selectedCategory === "Все"
    ? available
    : available.filter((p) => p.category === selectedCategory);

  const featured = available.filter((p) => p.featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-purple/20 to-transparent py-16">
        <div className="absolute inset-0 cyber-grid-bg opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-cyber-neon/10 border border-cyber-neon/30 rounded-full px-4 py-1.5 mb-4">
              <ShoppingBag className="w-3.5 h-3.5 text-cyber-neon" />
              <span className="text-xs font-mono font-bold text-cyber-neon uppercase tracking-widest">CyberQELN Merch</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3 neon-text">Магазин</h1>
            <p className="text-gray-400">Официальный мерч и товары CyberQELN</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Рекомендуемое
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onSelect={setSelected} featured />
              ))}
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={cn("px-4 py-1.5 rounded-full text-sm font-mono transition-all border",
                selectedCategory === cat
                  ? "bg-cyber-neon/20 border-cyber-neon/60 text-cyber-neon"
                  : "border-cyber-glass-border text-gray-400 hover:border-cyber-neon/30 hover:text-white")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl py-24 text-center text-gray-600">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-display font-bold text-lg text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Donation section */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        className="mt-20 relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-cyber-dark to-pink-900/40" />
        <div className="absolute inset-0 cyber-grid-bg opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />
        <div className="relative px-8 py-12 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-1.5 mb-4">
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
              <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">Поддержать нас</span>
            </div>
            <h2 className="font-display font-black text-3xl text-white mb-3">Помоги развитию CyberQELN</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
              Твой донат помогает нам проводить больше турниров, улучшать платформу и развивать киберспорт в СНГ. Каждый сум на счету!
            </p>
          </div>
          <DonationSection />
        </div>
      </motion.div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="glass-card rounded-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-cyber-purple to-cyber-dark overflow-hidden">
                  {selected.image ? (
                    <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl">{selected.icon}</span>
                    </div>
                  )}
                  {selected.badge && (
                    <span className={cn("absolute top-3 left-3 text-xs font-mono font-bold text-white px-2.5 py-1 rounded-full", selected.badgeColor ?? "bg-red-500")}>
                      {selected.badge}
                    </span>
                  )}
                  <button onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-mono text-gray-500 flex items-center gap-1 mb-1">
                        <Tag className="w-3 h-3" />{selected.category}
                      </span>
                      <h3 className="font-display font-bold text-xl text-white">{selected.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-black text-xl text-cyber-neon">{selected.price.toLocaleString()} UZS</div>
                      {selected.oldPrice && (
                        <div className="text-gray-600 text-sm line-through">{selected.oldPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  {selected.description && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{selected.description}</p>
                  )}

                  <div className="flex items-center gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < Math.floor(selected.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-700")} />
                    ))}
                    <span className="text-gray-500 text-xs font-mono ml-1">({selected.reviews} отзывов)</span>
                  </div>

                  <div className="glass-card rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm font-mono mb-1">Для заказа напишите нам</p>
                    <p className="text-cyber-neon font-mono font-bold text-sm">@cyberqeln</p>
                    <p className="text-gray-600 text-xs mt-1">в Telegram или Instagram</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product: p,
  index,
  onSelect,
  featured = false,
}: {
  product: Product;
  index: number;
  onSelect: (p: Product) => void;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
      onClick={() => onSelect(p)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-cyber-purple/60 to-cyber-dark overflow-hidden flex-shrink-0">
        {p.image ? (
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{p.icon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/60 to-transparent" />
        {p.badge && (
          <span className={cn("absolute top-3 left-3 text-xs font-mono font-bold text-white px-2.5 py-1 rounded-full", p.badgeColor ?? "bg-red-500")}>
            {p.badge}
          </span>
        )}
        {featured && (
          <span className="absolute top-3 right-3 w-6 h-6 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-xs font-mono text-gray-500 flex items-center gap-1 mb-1">
          <Tag className="w-3 h-3" />{p.category}
        </span>
        <h3 className="font-display font-bold text-white mb-1 group-hover:text-cyber-neon transition-colors">{p.name}</h3>
        {p.description && (
          <p className="text-gray-500 text-xs line-clamp-2 flex-1 mb-3">{p.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-cyber-glass-border/50">
          <div>
            <div className="font-display font-bold text-cyber-neon">{p.price.toLocaleString()} <span className="text-xs text-gray-500">UZS</span></div>
            {p.oldPrice && <div className="text-gray-600 text-xs line-through">{p.oldPrice.toLocaleString()}</div>}
          </div>
          <div className="flex items-center gap-1 p-2 rounded-lg bg-cyber-neon/10 text-cyber-neon group-hover:bg-cyber-neon/20 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
