import { Suspense } from "react";
import MediaContent from "./MediaContent";

export default function MediaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 flex items-center justify-center text-gray-500">Загрузка...</div>}>
      <MediaContent />
    </Suspense>
  );
}
