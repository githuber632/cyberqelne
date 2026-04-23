"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Star, Zap, Package } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { useContentStore } from "@/store/contentStore";

const gradientMap: Record<string, string> = {
  "Одежда": "from-purple-900/60 to-cyber-dark",
  "Периферия": "from-cyan-900/60 to-cyber-dark",
  "Цифровые": "from-violet-900/60 to-cyber-dark",
  "Аксессуары": "from-indigo-900/60 to-cyber-dark",
  "Коллекции": "from-pink-900/60 to-cyber-dark",
};
const defaultGradient = "from-cyber-purple/60 to-cyber-dark";

export function ShopPreview() {
  const { products, shopPromo } = useContentStore();

  const visible = products
    .filter((p) => p.featured && p.inStock)
    .slice(0, 4);

  const fallback = visible.length < 4
    ? [...visible, ...products.filter((p) => p.inStock && !p.featured).slice(0, 4 - visible.length)]
    : visible;

  const display = fallback.slice(0, 4);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/5 via-transparent to-transparent" />
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-cyber-neon-blue/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Магазин"
          title="CyberQELN Shop"
          subtitle="Мерч, периферия и цифровые товары для настоящих киберспортсменов"
          link={{ href: "/shop", label: "Перейти в магазин" }}
        />

        {display.length === 0 ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {display.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop/${product.id}`}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col"
                  >
                    <div className={cn("relative h-48 bg-gradient-to-br overflow-hidden", gradientMap[product.category] ?? defaultGradient)}>
                      <div className="absolute inset-0 cyber-grid-bg opacity-20" />
                      {product.image ? (
                        <img src={product.image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
                        </div>
                      )}
                      {product.badge && (
                        <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold font-mono text-white", product.badgeColor || "bg-cyber-neon/80")}>
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <span className="text-xs text-gray-400 font-mono">{product.category}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-display font-bold text-white text-base mb-1 group-hover:text-cyber-neon transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 flex-1 leading-relaxed">{product.description}</p>

                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn("w-3.5 h-3.5", i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600")}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-mono">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display font-bold text-lg text-white">
                            {product.price.toLocaleString()} UZS
                          </div>
                          {product.oldPrice && (
                            <div className="text-xs text-gray-600 line-through font-mono">
                              {product.oldPrice.toLocaleString()} UZS
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 bg-gradient-to-br from-cyber-purple-bright to-cyber-neon rounded-xl flex items-center justify-center text-white hover:shadow-neon transition-all duration-300"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {shopPromo.enabled && shopPromo.title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 glass-card rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 cyber-grid-bg opacity-20" />
            <div className="absolute right-0 top-0 w-64 h-64 bg-cyber-neon/10 rounded-full blur-[80px]" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-mono text-sm font-bold">СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">{shopPromo.title}</h3>
                <p className="text-gray-400">
                  {shopPromo.description}
                  {shopPromo.promoCode && (
                    <> Промокод: <span className="text-cyber-neon font-mono font-bold">{shopPromo.promoCode}</span></>
                  )}
                </p>
              </div>
              <Link
                href={shopPromo.buttonHref || "/shop"}
                className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon rounded-xl text-white font-display font-semibold hover:shadow-neon transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <ShoppingCart className="w-5 h-5" />
                {shopPromo.buttonText || "Открыть магазин"}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
