import { Suspense } from "react";
import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex items-center justify-center text-gray-500">Загрузка...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
