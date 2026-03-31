"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Send,
  MoreVertical,
  Sparkles,
  Square,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  getSessions,
  createSession,
  deleteSession,
  getMessages,
  sendMessageStream,
} from "@/lib/api/chat";
import type { ChatSession } from "@/lib/api/types";

interface LocalMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ResonancePage() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load session list on mount
  useEffect(() => {
    getSessions()
      .then((page) => setSessions(page.content))
      .catch(() => {});
  }, []);

  const loadSessionMessages = async (session: ChatSession) => {
    setCurrentSession(session);
    setShowSessionList(false);
    setMessages([]);
    setLoadingMsgs(true);
    try {
      const msgs = await getMessages(session.id);
      setMessages(
        msgs.map((m) => ({
          role: m.role === "USER" ? "user" : "assistant",
          content: m.content,
        }))
      );
    } catch {
      // ignore
    } finally {
      setLoadingMsgs(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewSession = async () => {
    try {
      const session = await createSession();
      setSessions((prev) => [session, ...prev]);
      setCurrentSession(session);
      setMessages([]);
      setShowSessionList(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      // ignore
    }
  };

  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (currentSession?.id === id) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch {
      // ignore
    }
  };

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession || !inputValue.trim() || isLoading) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await sendMessageStream(
        currentSession.id,
        content,
        (delta) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, content: last.content + delta };
            return updated;
          });
        },
        controller.signal
      );
    } catch (err: unknown) {
      const isAbort =
        err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
      if (!isAbort) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "⚠️ 连接出错，请稍后重试。",
          };
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="h-[calc(100dvh-128px)] md:h-[calc(100vh-128px)] flex flex-col md:flex-row gap-3 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-zinc-900">
      {/* Mobile session list overlay */}
      {showSessionList && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setShowSessionList(false)}
        />
      )}

      {/* Session List Sidebar */}
      <aside
        className={cn(
          "bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col shadow-sm",
          "md:w-72 md:flex md:static md:z-auto",
          "fixed bottom-24 left-4 right-4 z-40 max-h-[60vh] md:max-h-none",
          "transition-all duration-300 ease-in-out",
          showSessionList ? "flex opacity-100 translate-y-0" : "hidden md:flex"
        )}
      >
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">{t("resonance.sessionList")}</h2>
          <button
            onClick={handleNewSession}
            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
            title="新建会话"
          >
            <Plus className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-40">
              <Plus className="w-8 h-8 mb-2" />
              <p className="text-xs">{t("resonance.noSessions") ?? "暂无会话，点击 + 新建"}</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadSessionMessages(session)}
                  className={cn(
                    "p-4 rounded-2xl cursor-pointer transition-all group relative",
                    currentSession?.id === session.id
                      ? "bg-zinc-900 text-white shadow-md"
                      : "hover:bg-zinc-50 text-zinc-600"
                  )}
                >
                  <div className="flex justify-between items-start mb-1 pr-6">
                    <span className="font-medium text-sm truncate">{session.title}</span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate",
                      currentSession?.id === session.id ? "text-white/60" : "text-zinc-400"
                    )}
                  >
                    {new Date(session.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className={cn(
                      "absolute right-3 top-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                      currentSession?.id === session.id
                        ? "hover:bg-white/20 text-white/60"
                        : "hover:bg-zinc-100 text-zinc-400"
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 bg-white border border-zinc-200 rounded-3xl flex flex-col overflow-hidden shadow-sm min-h-0">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowSessionList(true)}
              className="md:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-zinc-500" />
            </button>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-zinc-900 truncate text-sm md:text-base">
                {currentSession ? currentSession.title : t("resonance.aiDialogue")}
              </h2>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase tracking-widest leading-none mt-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {t("resonance.activeCopilot")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNewSession}
              className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"
              title="新建会话"
            >
              <Plus className="w-4 h-4 text-zinc-500" />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer">
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
          {!currentSession && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="text-sm italic">
                {t("resonance.startPrompt") ?? "点击左侧 + 新建一个会话开始对话"}
              </p>
            </div>
          )}
          {loadingMsgs && (
            <div className="flex-1 flex items-center justify-center opacity-40">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
          )}
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "ml-auto items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "px-5 py-3.5 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-zinc-900 text-white rounded-br-none shadow-md"
                      : "bg-zinc-50 text-zinc-800 rounded-bl-none border border-zinc-100 shadow-sm"
                  )}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-pulse mr-1" />
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 mt-2 px-1">
                  {msg.role === "assistant" ? "AI Assistant" : "You"} · Just now
                </span>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-6 border-t border-zinc-100 bg-zinc-50/50">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentSession
                  ? (t("resonance.inputPlaceholder") ?? "分享你的感受...")
                  : (t("resonance.selectSessionPrompt") ?? "请先点击 + 新建会话")
              }
              disabled={!currentSession || loadingMsgs}
              className="w-full bg-white border border-zinc-200 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="absolute right-2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!currentSession || !inputValue.trim() || loadingMsgs}
                className="absolute right-2 p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
