"use client";

import Link from "next/link";
import { Sparkles, User, Bell, Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export function Navbar() {
    const { lang, setLang, t } = useI18n();

    return (
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-zinc-900">TheraNode</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-zinc-900 hover:text-zinc-500 transition-colors">
                        {t('common.dashboard')}
                    </Link>
                    <Link href="/resonance" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                        {t('common.resonance')}
                    </Link>
                    <Link href="/studio" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                        {t('common.studio')}
                    </Link>
                    <Link href="/reports" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                        {t('common.reports')}
                    </Link>
                    <Link href="/membership" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                        {t('common.membership')}
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <button
                    onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 rounded-xl transition-colors text-xs font-medium text-zinc-600"
                >
                    <Languages className="w-4 h-4" />
                    {lang === 'zh' ? 'EN' : '中文'}
                </button>

                <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5 text-zinc-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <User className="w-5 h-5 text-zinc-500" />
                </div>
            </div>
        </header>
    );
}
