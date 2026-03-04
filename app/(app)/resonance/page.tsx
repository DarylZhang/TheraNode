"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Plus,
    Send,
    MoreVertical,
    Sparkles,
    Square
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

interface Session {
    id: string;
    title: string;
    time: string;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function ResonancePage() {
    const { t } = useI18n();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const createNewSession = () => {
        const id = Math.random().toString(36).substring(7);
        const newSession: Session = {
            id,
            title: t('resonance.newSession') || "新会话",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(id);
        setMessages([]);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const stopGeneration = useCallback(() => {
        abortControllerRef.current?.abort();
        setIsLoading(false);
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentSessionId || !inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: "user", content: inputValue.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        // Add placeholder for assistant response
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            let fullContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullContent += chunk;

                // Update the last assistant message in real time
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: fullContent };
                    return updated;
                });
            }

            // Update session title from first response
            if (fullContent && sessions.find(s => s.id === currentSessionId)?.title === (t('resonance.newSession') || "新会话")) {
                setSessions(prev => prev.map(s =>
                    s.id === currentSessionId
                        ? { ...s, title: fullContent.slice(0, 15) + (fullContent.length > 15 ? "..." : "") }
                        : s
                ));
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: "⚠️ 连接出错，请稍后重试。" };
                    return updated;
                });
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <div className="h-[calc(100vh-128px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-zinc-900">
            {/* Session List */}
            <aside className="w-72 bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                    <h2 className="font-bold text-zinc-900">{t('resonance.sessionList')}</h2>
                    <button
                        onClick={createNewSession}
                        className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-40">
                            <Plus className="w-8 h-8 mb-2" />
                            <p className="text-xs">{t('resonance.noSessions') || "暂无会话"}</p>
                        </div>
                    ) : (
                        <div className="p-3 space-y-1">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => {
                                        setCurrentSessionId(session.id);
                                        setMessages([]);
                                    }}
                                    className={cn(
                                        "p-4 rounded-2xl cursor-pointer transition-all",
                                        currentSessionId === session.id
                                            ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                                            : "hover:bg-zinc-50 text-zinc-600"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm truncate">{session.title}</span>
                                        <span className={cn("text-[10px] shrink-0 ml-2", currentSessionId === session.id ? "text-white/50" : "text-zinc-400")}>
                                            {session.time}
                                        </span>
                                    </div>
                                    <p className={cn("text-xs truncate", currentSessionId === session.id ? "text-white/60" : "text-zinc-400")}>
                                        {t('resonance.sessionTitle')} #{session.id.slice(0, 4)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 bg-white border border-zinc-200 rounded-3xl flex flex-col overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-zinc-900">
                                {currentSessionId
                                    ? sessions.find(s => s.id === currentSessionId)?.title
                                    : t('resonance.aiDialogue')}
                            </h2>
                            <p className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase tracking-widest leading-none mt-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                {t('resonance.activeCopilot')}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer">
                        <MoreVertical className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                            <Sparkles className="w-12 h-12 mb-4" />
                            <p className="text-sm italic">{t('resonance.startPrompt') || "分享你此刻的感受..."}</p>
                        </div>
                    )}
                    <div className="space-y-6">
                        {messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === "user" ? "ml-auto items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "px-5 py-3.5 rounded-2xl text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-zinc-900 text-white rounded-br-none shadow-md"
                                        : "bg-zinc-50 text-zinc-800 rounded-bl-none border border-zinc-100 shadow-sm"
                                )}>
                                    {msg.content || (
                                        /* Thinking indicator when content is empty (streaming start) */
                                        <span className="flex gap-1 items-center">
                                            <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-pulse mr-1" />
                                            <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-zinc-400 mt-2 px-1">
                                    {msg.role === "assistant" ? "AI Assistant" : "You"} • Just now
                                </span>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer / Input Area */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
                    <form onSubmit={handleFormSubmit} className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={currentSessionId
                                ? (t('resonance.inputPlaceholder') || "分享你的感受...")
                                : (t('resonance.selectSessionPrompt') || "请先点击左侧 + 新建会话")}
                            disabled={!currentSessionId}
                            className="w-full bg-white border border-zinc-200 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        {isLoading ? (
                            <button
                                type="button"
                                onClick={stopGeneration}
                                className="absolute right-2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!currentSessionId || !inputValue.trim()}
                                className="absolute right-2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
