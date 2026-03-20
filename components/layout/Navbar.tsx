"use client";

import Link from "next/link";
import { Sparkles, User, Bell, Languages, Menu } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface NavbarProps {
    onMenuToggle?: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
    const { lang, setLang, t } = useI18n();

    return (
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-8">
                {/* 移动端汉堡菜单按钮 */}
                <button
                    onClick={onMenuToggle}
                    className="md:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors"
                    aria-label="打开菜单"
                >
                    <Menu className="w-5 h-5 text-zinc-600" />
                </button>

                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg md:text-xl tracking-tight text-zinc-900">TheraNode</span>
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

            <div className="flex items-center gap-2 md:gap-4">
                {/* Language Switcher */}
                <button
                    onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-100 rounded-xl transition-colors text-xs font-medium text-zinc-600"
                >
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang === 'zh' ? 'EN' : '中文'}</span>
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
