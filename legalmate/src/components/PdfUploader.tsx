"use client";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
export default function PdfUploader() {
  const { lang } = useLanguage();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");

  const t = {
    upload: lang === "he" ? "📄 העלה חוזה לסיכום" : "📄 Upload a contract for summary",
    reading: lang === "he" ? "📥 קורא את הקובץ..." : "📥 Reading the file...",
    contractText: lang === "he" ? "📑 תוכן החוזה:" : "📑 Contract text:",
    summarize: lang === "he" ? "✨ סכם חוזה" : "✨ Summarize contract",
    summarizing: lang === "he" ? "🔄 מסכם..." : "🔄 Summarizing...",
    summaryTitle: lang === "he" ? "✅ סיכום החוזה:" : "✅ Contract Summary:",
    uploadError: lang === "he" ? "שגיאה בעת העלאת הקובץ או עיבודו." : "Error uploading or parsing file.",
    summarizeError: lang === "he" ? "שגיאה בעת הסיכום." : "Error while summarizing.",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setText("");
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.uploadError);
      } else {
        setText(data.text);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(t.uploadError);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!text) return;

    setSummarizing(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text , lang}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.summarizeError);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error("Summarize error:", err);
      setError(t.summarizeError);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#16161e] p-6 rounded-2xl shadow-2xl border border-[#2c2c3a]">
      <label
        htmlFor="file-upload"
        className="block w-full text-center py-3 bg-gradient-to-r from-purple-700 to-indigo-600 rounded-lg cursor-pointer text-white font-semibold text-lg hover:from-purple-600 hover:to-indigo-500 transition"
      >
        {t.upload}
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {loading && <p className="mt-4 text-indigo-300">{t.reading}</p>}
      {error && <p className="text-red-400 font-semibold mt-2">{error}</p>}

      {text && (
        <>
          <h2 className="text-xl font-semibold mt-6 text-white">{t.contractText}</h2>
          <pre className="mt-2 bg-[#1f1f2e] text-gray-200 p-4 rounded-lg whitespace-pre-wrap max-h-64 overflow-y-auto border border-gray-700">
            {text}
          </pre>
          <button
            onClick={handleSummarize}
            disabled={summarizing}
            className="mt-4 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold transition"
          >
            {summarizing ? t.summarizing : t.summarize}
          </button>
        </>
      )}

      {summary && (
        <div className="mt-8 p-6 bg-[#202030] border border-[#2f2f3f] rounded-xl shadow-inner">
          <h2 className="text-lg font-bold text-green-400 mb-2">{t.summaryTitle}</h2>
          <p className="whitespace-pre-wrap text-gray-100">{summary}</p>
        </div>
      )}
    </div>
  );
}
