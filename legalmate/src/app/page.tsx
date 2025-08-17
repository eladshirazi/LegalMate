"use client";

import PdfUploader from "@/components/PdfUploader";
import { useLanguage } from "@/components/LanguageContext";

export default function Home() {
  const { lang } = useLanguage();

  const subtitle =
    lang === "he"
      ? "סיכום חוזים חכם, מדויק ומיידי לעורכי דין, סטארטאפים ופרילנסרים"
      : "Smart, precise and instant contract summaries for lawyers, startups and freelancers";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1f2e] to-[#0e0e13] text-white px-6 py-12 sm:px-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center text-white tracking-tight">
        LegalMate
      </h1>
      <p className="text-gray-300 text-center max-w-2xl mb-10 text-lg">
        {subtitle}
      </p>
      <PdfUploader />
    </div>
  );
}