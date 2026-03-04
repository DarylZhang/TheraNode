"use client";

import Link from "next/link";
import {
    Smile,
    TrendingUp,
    MessageSquare,
    PenTool,
    Clock,
    ArrowRight,
    Sparkles,
    Book
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/I18nContext";

export default function DashboardPage() {
    const { t } = useI18n();
    const user = { name: "Daryl" };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{t('dashboard.greeting')}, {user.name}</h1>
                <p className="text-zinc-500 mt-1 italic italic">"{t('dashboard.subtitle')}"</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood State Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">{t('dashboard.moodState')}</h3>
                            <div className="flex items-center gap-2">
                                <Smile className="w-6 h-6 text-yellow-500" />
                                <span className="text-2xl font-bold text-zinc-900">{t('dashboard.moodIndex')}: 72 / 100</span>
                            </div>
                        </div>
                        <div className="bg-green-50 px-3 py-1 rounded-full text-xs font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {t('dashboard.weeklyTrend')}
                        </div>
                    </div>

                    <div className="h-24 bg-zinc-50 rounded-2xl flex items-end justify-between p-4 mb-6">
                        <div className="w-8 bg-zinc-200 h-12 rounded-t-lg"></div>
                        <div className="w-8 bg-zinc-200 h-16 rounded-t-lg"></div>
                        <div className="w-8 bg-zinc-300 h-20 rounded-t-lg"></div>
                        <div className="w-8 bg-zinc-200 h-14 rounded-t-lg"></div>
                        <div className="w-8 bg-zinc-900 h-22 rounded-t-lg animate-pulse"></div>
                    </div>

                    <Link href="/resonance">
                        <button className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]">
                            {t('dashboard.startDialogue')} <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* AI Recommendation Card */}
                <div className="bg-zinc-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-32 h-32" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-white/60">{t('dashboard.aiRecTitle')}</span>
                        </div>

                        <p className="text-xl font-medium leading-relaxed mb-8 flex-1">
                            "{t('dashboard.aiRecText')}"
                        </p>

                        <Link href="/resonance">
                            <button className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-100 transition-colors w-fit">
                                {t('dashboard.enterResonance')}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Creation Reminder Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                            <PenTool className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900">{t('dashboard.creationReminder')}</h3>
                            <p className="text-zinc-500">{t('dashboard.reminderText', { days: 3 })}</p>
                        </div>
                    </div>
                    <Link href="/studio?tab=diary">
                        <button className="px-5 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors">
                            {t('dashboard.continueWriting')}
                        </button>
                    </Link>
                </div>

                {/* Recent Works Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-zinc-900">{t('dashboard.recentWorks')}</h3>
                        <Link href="/records" className="text-xs font-medium text-zinc-400 hover:text-zinc-900">{t('dashboard.viewAll')}</Link>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{t('dashboard.poetryTitle')}</p>
                                    <p className="text-xs text-zinc-400">2024.03.01</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100" />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                                    <Book className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">{t('dashboard.diaryTitle')}</p>
                                    <p className="text-xs text-zinc-400">2024.02.28</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
