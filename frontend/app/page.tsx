"use client";

import { HeroSection } from "@/components/features/home/HeroSection";
import { TournamentsPreview } from "@/components/features/home/TournamentsPreview";
import { LeaderboardSection } from "@/components/features/home/LeaderboardSection";
import { LatestVideos } from "@/components/features/home/LatestVideos";
import { NewsSection } from "@/components/features/home/NewsSection";
import { ShopPreview } from "@/components/features/home/ShopPreview";
import { StatsSection } from "@/components/features/home/StatsSection";
import { PartnersSection } from "@/components/features/home/PartnersSection";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero — главный баннер с featured турниром */}
      <HeroSection />

      {/* Глобальная статистика платформы */}
      <StatsSection />

      {/* Ближайшие турниры */}
      <TournamentsPreview />

      {/* Топ команд и игроков */}
      <LeaderboardSection />

      {/* Последние видео / хайлайты */}
      <LatestVideos />

      {/* Новости */}
      <NewsSection />

      {/* Превью магазина */}
      <ShopPreview />

      {/* Партнёры */}
      <PartnersSection />
    </div>
  );
}
