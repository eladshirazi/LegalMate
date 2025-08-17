"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useLanguage } from "./LanguageContext";
export default function HeaderWithLanguage() {
  const { lang, toggleLang } = useLanguage();

  return (
    <header className="w-full border-b border-gray-800 bg-[#14141c] text-white shadow-sm">
      <div
        className={`max-w-6xl mx-auto px-6 py-4 flex items-center justify-between ${
          lang === "he" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <h1 className="text-2xl font-bold tracking-tight">LegalMate</h1>

        <nav className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            {lang === "he" ? "English" : "עברית"}
          </button>

          <a
            href="#"
            className="text-sm text-gray-300 hover:text-white transition"
          >
            {lang === "he" ? "סיכומים קודמים" : "Past Summaries"}
          </a>

          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] hover:bg-[#5a3ce5] text-white rounded-full font-medium text-sm h-9 px-4 transition">
                {lang === "he" ? "התחברות" : "Sign Up"}
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
