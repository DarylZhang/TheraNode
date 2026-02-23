"use client";

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { ChevronLeft, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function WhiteboardPage() {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "The whiteboard is a boundless space for your expressions. What's on your mind as you begin to draw?" }
    ]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: chatInput }]);
        setChatInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: "I'm following your strokes. Art is a direct line to the subconscious." }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden font-sans">
            {/* Top Bar */}
            <header className="px-6 py-3 bg-white border-b border-zinc-200 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-zinc-600" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-900 leading-tight">Healing Whiteboard</h1>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Free-form Expression</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Main: Tldraw Board */}
                <main className="flex-1 relative border-r border-zinc-200">
                    <Tldraw
                        inferDarkMode={false}
                        persistenceKey="theranode-whiteboard"
                    />
                </main>

                {/* Right: AI Copilot Sidebar */}
                <aside className="w-80 bg-white flex flex-col shadow-[-1px_0_10px_rgba(0,0,0,0.02)] z-20">
                    <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 text-sm">Artist Companion</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-bold">Observing...</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                        ? 'bg-zinc-900 text-white rounded-tr-none shadow-sm'
                                        : 'bg-white text-zinc-700 border border-zinc-100 rounded-tl-none shadow-sm'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-zinc-100">
                        <div className="relative">
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full px-4 py-2 bg-zinc-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all pr-12"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>
                </aside>
            </div>
        </div>
    );
}
