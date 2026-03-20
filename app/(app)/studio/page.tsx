"use client";

import { useState } from "react";
import {
    PenTool,
    Sparkles,
    Save,
    Download,
    Wand2,
    ChevronRight,
    Smile,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/I18nContext";

export default function StudioPage() {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState("diary");

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">{t('studio.title')}</h1>
                    <p className="text-zinc-500 mt-1 italic text-sm md:text-base">"{t('studio.subtitle')}"</p>
                </div>
                <div className="flex bg-white border border-zinc-200 p-1.5 rounded-2xl shadow-sm w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab("diary")}
                        className={cn(
                            "flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeTab === "diary" ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-500 hover:text-zinc-900"
                        )}
                    >
                        <PenTool className="w-4 h-4" />
                        {t('studio.tabs.diary')}
                    </button>
                    <button
                        onClick={() => setActiveTab("poetry")}
                        className={cn(
                            "flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                            activeTab === "poetry" ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-500 hover:text-zinc-900"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        {t('studio.tabs.poetry')}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 min-h-[500px] md:min-h-[600px]">
                {/* Left: AI Hints & Context */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-16 h-16" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">{t('studio.hintTitle')}</h3>
                            <p className="text-lg font-medium leading-relaxed mb-6">
                                "{t('studio.hintText')}"
                            </p>
                            <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Smile className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/60 leading-none mb-1 uppercase tracking-tighter">{t('studio.emotionTag')}</p>
                                    <p className="text-sm font-bold">😔 {t('studio.fatigue')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-zinc-400" />
                            {t('studio.inspirationRef')}
                        </h3>
                        <div className="space-y-4">
                            <p className="text-xs text-zinc-500 leading-relaxed italic border-l-2 border-zinc-100 pl-3">
                                {t('studio.quote1')}
                            </p>
                            <p className="text-xs text-zinc-500 leading-relaxed italic border-l-2 border-zinc-100 pl-3">
                                {t('studio.quote2')}
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Center: Editor Area */}
                <main className="lg:col-span-3 flex flex-col bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <input
                            type="text"
                            placeholder={t('studio.titlePlaceholder')}
                            className="bg-transparent border-none text-xl font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-300 w-full px-4"
                        />
                    </div>

                    <div className="flex-1 p-8">
                        <textarea
                            placeholder={t('studio.contentPlaceholder')}
                            className="w-full h-full min-h-[400px] resize-none border-none focus:outline-none text-zinc-700 leading-loose text-lg placeholder:text-zinc-200"
                        ></textarea>
                    </div>

                    <div className="p-4 md:p-6 bg-zinc-50/80 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button className="px-4 md:px-5 py-2 md:py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md shadow-zinc-200 active:scale-[0.98]">
                                <Save className="w-4 h-4" />
                                {t('common.save')}
                            </button>
                            {activeTab === "poetry" ? (
                                <button className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-[0.98]">
                                    <Wand2 className="w-4 h-4 text-purple-500" />
                                    <span className="hidden sm:inline">{t('studio.generatePoetry')}</span>
                                    <span className="sm:hidden">生成</span>
                                </button>
                            ) : (
                                <button className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-[0.98]">
                                    <Wand2 className="w-4 h-4 text-zinc-400" />
                                    <span className="hidden sm:inline">{t('studio.generatePolish')}</span>
                                    <span className="sm:hidden">润色</span>
                                </button>
                            )}
                        </div>

                        <button className="px-4 md:px-5 py-2 md:py-2.5 text-zinc-500 hover:text-zinc-900 text-sm font-medium flex items-center gap-2 transition-colors group">
                            <Download className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                            <span className="hidden sm:inline">{t('common.export')}</span>
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
