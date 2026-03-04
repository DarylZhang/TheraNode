"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Circle, Rect, Text } from "react-konva";
import { usePlayspaceStore, PlayspaceItem } from "@/store/usePlayspaceStore";
import {
    Plus,
    Trash2,
    Palette,
    ChevronLeft,
    Send,
    Sparkles,
    Eraser,
    Download,
    Share2
} from "lucide-react";
import Link from "next/link";

// Mock AI thoughts
const MOCK_AI_RESPONSES = [
    "I notice you're placing many circles today. Do they represent consistency or perhaps a cycle you're feeling?",
    "The color blue often relates to calm. How does it feel to look at this arrangement?",
    "That's an interesting placement. There's a lot of space between these two items. What does that space say to you?",
    "Try adding a square to represent a foundation or a boundary if you feel like you need one right now.",
];

export default function PlayspaceClient() {
    const { items, addItem, updateItem, removeItem, clearItems } = usePlayspaceStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: "Welcome to your digital playspace. I'm here to support your creative process. How are you feeling today?" }
    ]);
    const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

    useEffect(() => {
        // Handle responsive canvas
        const handleResize = () => {
            const container = document.getElementById('canvas-container');
            if (container) {
                setWindowSize({
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAddShape = (type: PlayspaceItem['type']) => {
        const colors = ['#e4e4e7', '#f1f5f9', '#dcfce7', '#dbeafe', '#fef3c7'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        addItem({
            type,
            x: windowSize.width / 2 + (Math.random() * 100 - 50),
            y: windowSize.height / 2 + (Math.random() * 100 - 50),
            color: randomColor,
            label: type === 'stone' ? 'Calm' : type === 'emotion' ? 'Joy' : 'Idea'
        });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
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
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900 leading-tight">Digital Sandplay</h1>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Session: Mindfulness</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600" title="Export">
                        <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-[1px] bg-zinc-200 mx-2" />
                    <button
                        onClick={clearItems}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                        <Eraser className="w-3.5 h-3.5" />
                        Clear Stage
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Tool Palette */}
                <aside className="w-64 bg-white border-r border-zinc-200 p-6 flex flex-col gap-8 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Therapy Items</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleAddShape('stone')}
                                className="flex items-center justify-between p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-300 group-hover:scale-110 transition-transform shadow-sm" />
                                    <span className="text-sm font-medium text-zinc-700">Stone</span>
                                </div>
                                <Plus className="w-4 h-4 text-zinc-400" />
                            </button>

                            <button
                                onClick={() => handleAddShape('emotion')}
                                className="flex items-center justify-between p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-300 group-hover:rotate-12 transition-transform shadow-sm" />
                                    <span className="text-sm font-medium text-zinc-700">Emotion</span>
                                </div>
                                <Plus className="w-4 h-4 text-zinc-400" />
                            </button>

                            <button
                                onClick={() => handleAddShape('abstract')}
                                className="flex items-center justify-between p-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-300 group-hover:scale-x-125 transition-transform shadow-sm" />
                                    <span className="text-sm font-medium text-zinc-700">Abstract</span>
                                </div>
                                <Plus className="w-4 h-4 text-zinc-400" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Properties</h3>
                        {selectedId ? (
                            <div className="p-4 bg-zinc-900 rounded-2xl text-white space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-zinc-400">Selected Item</span>
                                    <button onClick={() => removeItem(selectedId)}>
                                        <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-400" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    {['#f97316', '#3b82f6', '#10b981', '#ef4444', '#f59e0b'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => updateItem(selectedId, { color: c })}
                                            className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-500 italic mt-2">Drag the item to reposition it in your mind.</p>
                            </div>
                        ) : (
                            <div className="p-6 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center opacity-60">
                                <Palette className="w-8 h-8 text-zinc-300 mb-2" />
                                <p className="text-xs text-zinc-400">Select an item to view options</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto p-4 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl border border-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-bold text-zinc-900">Mindful Tip</span>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed italic">
                            "Try closing your eyes for 5 seconds before placing your next item. What shape appeared in your mind?"
                        </p>
                    </div>
                </aside>

                {/* Center: Canvas Area */}
                <main id="canvas-container" className="flex-1 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
                    <Stage
                        width={windowSize.width}
                        height={windowSize.height}
                        onClick={() => setSelectedId(null)}
                    >
                        <Layer>
                            {items.map((item) => (
                                <Item
                                    key={item.id}
                                    data={item}
                                    isSelected={item.id === selectedId}
                                    onSelect={(e) => {
                                        e.cancelBubble = true;
                                        setSelectedId(item.id);
                                    }}
                                    onDragEnd={(e) => {
                                        updateItem(item.id, {
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        });
                                    }}
                                />
                            ))}
                        </Layer>
                    </Stage>

                    {/* Canvas Labels */}
                    <div className="absolute bottom-6 left-6 flex gap-4 pointer-events-none">
                        <div className="px-3 py-1 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest font-bold shadow-sm">
                            2D Interactive Stage
                        </div>
                        <div className="px-3 py-1 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest font-bold shadow-sm">
                            {items.length} Reflection Elements
                        </div>
                    </div>
                </main>

                {/* Right: AI Copilot Sidebar */}
                <aside className="w-80 bg-white border-l border-zinc-200 flex flex-col shadow-[-1px_0_10px_rgba(0,0,0,0.02)]">
                    <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 text-sm">Therapy Copilot</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-bold">Listening...</span>
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
                                placeholder="Talk to your companion..."
                                className="w-full px-4 py-2 bg-zinc-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-zinc-900 transition-all pr-12"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-3 text-center px-4 leading-tight italic">
                            AI companion is here to listen and guide, not to diagnose or provide medical advice.
                        </p>
                    </form>
                </aside>
            </div>
        </div>
    );
}

// Konva Component for individual items
const Item = ({ data, isSelected, onSelect, onDragEnd }: {
    data: PlayspaceItem,
    isSelected: boolean,
    onSelect: (e: any) => void,
    onDragEnd: (e: any) => void
}) => {
    const commonProps = {
        x: data.x,
        y: data.y,
        draggable: true,
        onClick: onSelect,
        onTap: onSelect,
        onDragEnd: onDragEnd,
        shadowColor: "black",
        shadowBlur: isSelected ? 15 : 5,
        shadowOpacity: 0.1,
        shadowOffset: { x: 2, y: 2 },
    };

    if (data.type === 'stone') {
        return (
            <Circle
                {...commonProps}
                radius={30}
                fill={data.color}
                stroke={isSelected ? "#000" : "transparent"}
                strokeWidth={2}
            />
        );
    }

    if (data.type === 'emotion') {
        return (
            <Rect
                {...commonProps}
                width={50}
                height={50}
                cornerRadius={12}
                fill={data.color}
                stroke={isSelected ? "#000" : "transparent"}
                strokeWidth={2}
                rotation={45} // Diamonds!
            />
        );
    }

    return (
        <Rect
            {...commonProps}
            width={70}
            height={30}
            cornerRadius={20}
            fill={data.color}
            stroke={isSelected ? "#000" : "transparent"}
            strokeWidth={2}
        />
    );
};
