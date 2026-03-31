"use client";

import "tldraw/tldraw.css";
import { ChevronLeft, Sparkles, Send, Save, RefreshCw, CheckCircle, Cloud } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  getWhiteboards,
  createWhiteboard,
  getWhiteboard,
  saveWhiteboard,
} from "@/lib/api/whiteboard";
import type { Whiteboard } from "@/lib/api/types";

const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-zinc-50">
      <div className="text-zinc-400 font-medium animate-pulse">Loading drawing board...</div>
    </div>
  ),
});

export default function WhiteboardPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "The whiteboard is a boundless space for your expressions. What's on your mind as you begin to draw?",
    },
  ]);
  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"idle" | "loading">("loading");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // Load or create whiteboard on mount
  useEffect(() => {
    async function init() {
      setCloudStatus("loading");
      try {
        const page = await getWhiteboards(0, 1);
        if (page.content.length > 0) {
          const wb = await getWhiteboard(page.content[0].id);
          setWhiteboard(wb);
        } else {
          const wb = await createWhiteboard("Healing Whiteboard");
          setWhiteboard(wb);
        }
      } catch {
        // Offline or API error — work locally
      } finally {
        setCloudStatus("idle");
      }
    }
    init();
  }, []);

  async function handleSaveToCloud() {
    if (!whiteboard || !editorRef.current) return;
    setSaving(true);
    try {
      const snapshot = editorRef.current.store.getSnapshot();
      const content = JSON.stringify(snapshot);
      const updated = await saveWhiteboard(whiteboard.id, content);
      setWhiteboard(updated);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm following your strokes. Art is a direct line to the subconscious." },
      ]);
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
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
              Free-form Expression
            </p>
          </div>
        </div>

        {/* Cloud Save Button */}
        <button
          onClick={handleSaveToCloud}
          disabled={saving || cloudStatus === "loading" || !whiteboard}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedMsg ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : cloudStatus === "loading" ? (
            <RefreshCw className="w-4 h-4 animate-spin opacity-60" />
          ) : (
            <Cloud className="w-4 h-4" />
          )}
          {saving ? "保存中..." : savedMsg ? "已保存" : "保存到云端"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main: Tldraw Board */}
        <main className="flex-1 relative border-r border-zinc-200">
          <Tldraw
            inferDarkMode={false}
            persistenceKey="theranode-whiteboard"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
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
                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter font-bold">
                  Observing...
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-zinc-900 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-zinc-700 border border-zinc-100 rounded-tl-none shadow-sm"
                  }`}
                >
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
