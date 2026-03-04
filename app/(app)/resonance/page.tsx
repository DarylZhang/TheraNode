"use client";

import { useState } from "react";
import {
    MessageSquare,
    Send,
    Mic,
    Smile,
    MoreVertical,
    ChevronRight,
    Sparkles,
    PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

const sessions = [
    { id: 1, title: "焦虑主题", time: "10:30 AM", active: true },
    { id: 2, title: "关系问题", time: "昨天", active: false },
    { id: 3, title: "自我价值", time: "2天前", active: false },
];

import { useI18n } from "@/lib/i18n/I18nContext";

export default function ResonancePage() {
    const { t } = useI18n();
    const [messages, setMessages] = useState([
        { role: "ai", content: "你今天感觉如何？" },
        { role: "user", content: "我有点疲惫" },
        { role: "ai", content: "疲惫是身体的提醒。或许我们可以聊聊这种感觉的来源，或者试着在纸上画出这种‘疲惫’的形状？" },
    ]);

    return (
        <div className="h-[calc(100vh-128px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Session List */}
            <aside className="w-72 bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                    <h2 className="font-bold text-zinc-900">{t('resonance.sessionList')}</h2>
                    <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={cn(
                                "p-4 rounded-2xl cursor-pointer transition-all group",
                                session.active
                                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                                    : "hover:bg-zinc-50 text-zinc-600"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm truncate">{session.title}</span>
                                <span className={cn("text-[10px]", session.active ? "text-white/50" : "text-zinc-400")}>
                                    {session.time}
                                </span>
                            </div>
                            <p className={cn("text-xs truncate", session.active ? "text-white/60" : "text-zinc-400")}>
                                {t('resonance.sessionTitle')} #{session.id + 11}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 bg-white border border-zinc-200 rounded-3xl flex flex-col overflow-hidden shadow-sm relative">
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900">{t('resonance.sessionTitle')} #12</h2>
                            <p className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase tracking-widest leading-none mt-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                {t('resonance.activeCopilot')}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                        <MoreVertical className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex flex-col max-w-[80%]",
                            msg.role === "user" ? "ml-auto items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "px-5 py-3.5 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-zinc-900 text-white rounded-br-none"
                                    : "bg-zinc-50 text-zinc-800 rounded-bl-none border border-zinc-100 shadow-sm"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-zinc-400 mt-2 px-1">
                                {msg.role === "ai" ? "AI Copilot" : "You"} • Just now
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer / Input Area */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
                    {/* Emotion Insight Footer */}
                    <div className="mb-6 p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm flex items-center justify-between animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500">
                                <Smile className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900">{t('resonance.emotionDetection')}：{t('resonance.lowEnergy')}</p>
                                <p className="text-xs text-zinc-500">{t('resonance.suggestion')}</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition-all">
                            <PenTool className="w-3.5 h-3.5" />
                            {t('resonance.toStudio')} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="relative flex items-center gap-3">
                        <button className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm">
                            <Mic className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder={t('resonance.inputPlaceholder')}
                                className="w-full bg-white border border-zinc-200 rounded-2xl py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
                            />
                            <button className="absolute right-2 top-1.5 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
