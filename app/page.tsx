"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, LayoutDashboard, MessageSquare, PenTool } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg md:text-xl tracking-tight text-zinc-900">TheraNode</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Language Switcher */}
          <div className="flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
            <button
              onClick={() => setLang("zh")}
              className={cn(
                "px-2.5 md:px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap",
                lang === "zh" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              中
            </button>
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-2.5 md:px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap",
                lang === "en" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              EN
            </button>
          </div>

          <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors whitespace-nowrap">
            {t('landing.enterApp')}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-5 md:px-6 pt-16 md:pt-24 pb-12 md:pb-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600 mb-5 md:mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Digital Mindfulness & Art Therapy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-5 md:mb-6 leading-tight">
            {t('landing.heroTitle')} <br />
            <span className="text-zinc-500 italic">{t('landing.heroTitleItalic')}</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all transform hover:scale-105">
                {t('landing.getStarted')} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="px-5 md:px-6 py-14 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {/* Dashboard */}
            <div className="space-y-4 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100 shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">{t('landing.features.dashboardTitle')}</h3>
              <p className="text-zinc-600 leading-relaxed">
                {t('landing.features.dashboardDesc')}
              </p>
            </div>

            {/* Resonance */}
            <div className="space-y-4 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100 shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">{t('landing.features.resonanceTitle')}</h3>
              <p className="text-zinc-600 leading-relaxed">
                {t('landing.features.resonanceDesc')}
              </p>
            </div>

            {/* Studio */}
            <div className="space-y-4 p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100 shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">{t('landing.features.studioTitle')}</h3>
              <p className="text-zinc-600 leading-relaxed">
                {t('landing.features.studioDesc')}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-zinc-200 bg-zinc-50 text-center">
        <p className="text-sm text-zinc-500">
          {t('landing.footer')}
        </p>
      </footer>
    </div>
  );
}
