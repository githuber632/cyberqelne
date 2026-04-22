"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Shield, Users } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface PublicProfile {
  uid?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  country?: string;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  ceo: { label: "CEO", color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/40" },
  admin: { label: "Администратор", color: "text-red-400 bg-red-500/20 border-red-500/40" },
  moderator: { label: "Модератор", color: "text-blue-400 bg-blue-500/20 border-blue-500/40" },
  user: { label: "Игрок", color: "text-gray-400 bg-gray-500/20 border-gray-500/40" },
};

export default function PlayerProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { users } = useContentStore();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "users"), where("name", "==", username));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setProfile(snap.docs[0].data() as PublicProfile);
          setLoading(false);
          return;
        }
        const q2 = query(collection(db, "users"), where("name", "==", decodeURIComponent(username)));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          setProfile(snap2.docs[0].data() as PublicProfile);
          setLoading(false);
          return;
        }
      } catch {}

      const local = users.find(
        (u) => u.nickname.toLowerCase() === decodeURIComponent(username).toLowerCase()
      );
      if (local) {
        setProfile({
          name: local.nickname,
          email: local.email,
          role: local.role,
          country: local.country,
        });
        setLoading(false);
        return;
      }

      setLoading(false);
    }
    load();
  }, [username, users]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <div className="w-8 h-8 border-2 border-cyber-neon/30 border-t-cyber-neon rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center">
        <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl text-white mb-4">Игрок не найден</h1>
        <Link href="/" className="text-cyber-neon hover:underline">← На главную</Link>
      </div>
    );
  }

  const role = roleConfig[profile.role] ?? roleConfig.user;
  const initials = profile.name?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm font-mono">
            <ArrowLeft className="w-4 h-4" />Назад
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-cyber-purple to-cyber-dark relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid-bg opacity-30" />
          </div>

          <div className="px-8 pb-8">
            <div className="-mt-12 mb-4 relative inline-block">
              {profile.avatar ? (
                <img src={profile.avatar} className="w-24 h-24 rounded-2xl object-cover border-4 border-cyber-dark shadow-neon" alt="" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyber-purple-bright to-cyber-neon flex items-center justify-center text-white font-display font-black text-3xl border-4 border-cyber-dark shadow-neon">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="font-display font-black text-3xl text-white">{profile.name}</h1>
                {profile.country && <span className="text-2xl mr-2">{profile.country}</span>}
                <span className={cn("inline-block border rounded-full px-3 py-0.5 text-xs font-mono font-bold mt-2", role.color)}>
                  {role.label}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="glass-card rounded-xl p-4 text-center inline-block min-w-[140px]">
                <Shield className="w-5 h-5 mx-auto mb-2 text-cyber-neon" />
                <div className={cn("font-display font-bold text-lg", role.color)}>{role.label}</div>
                <div className="text-gray-600 text-xs font-mono">Роль</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
