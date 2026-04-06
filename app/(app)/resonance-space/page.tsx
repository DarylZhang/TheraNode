"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  Send,
  MoreVertical,
  Square,
  Trash2,
  RefreshCw,
  Share2,
  Download,
  Copy,
  Check,
  Heart,
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

const GUIDED_TOPICS_ZH = ["焦虑与控制感", "失去与悲伤", "自我接纳", "关系与边界"];
const GUIDED_TOPICS_EN = ["Anxiety & Control", "Loss & Grief", "Self-Acceptance", "Relationships & Boundaries"];

export default function ResonanceSpacePage() {
  const { t, lang } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const guidedTopics = lang === "zh" ? GUIDED_TOPICS_ZH : GUIDED_TOPICS_EN;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getSessions()
      .then(async (page) => {
        const list = page.content;
        setSessions(list);
        if (list.length > 0) {
          const latest = list[0];
          setCurrentSession(latest);
          setLoadingMsgs(true);
          try {
            const msgs = await getMessages(latest.id);
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
        } else {
          try {
            const session = await createSession(lang === "zh" ? "共振空间会话" : "Resonance Session");
            setSessions([session]);
            setCurrentSession(session);
            setTimeout(() => inputRef.current?.focus(), 100);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {})
      .finally(() => setInitializing(false));
  }, [lang]);

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
      const session = await createSession(lang === "zh" ? "共振空间会话" : "Resonance Session");
      setSessions((prev) => [session, ...prev]);
      setCurrentSession(session);
      setMessages([]);
      setShowSessionList(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      // ignore
    }
  };

  const handleTopicClick = (topic: string) => {
    setInputValue(lang === "zh" ? `我想探讨：${topic}` : `I want to explore: ${topic}`);
    inputRef.current?.focus();
  };

  const handleShareSession = async () => {
    setShowMoreMenu(false);
    const text = messages
      .map((m) => `${m.role === "user" ? (lang === "zh" ? "我" : "Me") : "AI"}: ${m.content}`)
      .join("\n\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: currentSession?.title ?? (lang === "zh" ? "共振空间对话" : "Resonance Session"), text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    setShowMoreMenu(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleExportSession = () => {
    setShowMoreMenu(false);
    if (!messages.length) return;
    const content = messages
      .map((m) => `[${m.role === "user" ? (lang === "zh" ? "我" : "Me") : "AI"}]\n${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSession?.title ?? (lang === "zh" ? "共振记录" : "resonance-record")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        const sseError = (err as Error & { sseError?: string }).sseError;
        const status = (err as Error & { status?: number }).status;
        const isNetwork = err instanceof TypeError && err.message.includes("fetch");
        const msg =
          sseError === "RATE_LIMITED"
            ? (lang === "zh" ? "⚠️ AI 请求太频繁，请稍等片刻再试。" : "⚠️ Too many requests. Please wait a moment and try again.")
            : isNetwork
            ? (lang === "zh" ? "⚠️ 网络连接失败，请检查网络后重试。" : "⚠️ Network error. Please check your connection.")
            : status === 429
            ? (lang === "zh" ? "⚠️ AI 请求太频繁，请稍等片刻再试。" : "⚠️ Too many requests. Please wait a moment and try again.")
            : status === 401
            ? (lang === "zh" ? "⚠️ 登录已过期，请重新登录。" : "⚠️ Session expired. Please log in again.")
            : (lang === "zh" ? "⚠️ 服务暂时不可用，请稍后重试。如问题持续，请联系我们。" : "⚠️ Service temporarily unavailable. Please try again later.");
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: msg };
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
          <div>
            <h2 className="font-bold text-zinc-900">{t("resonanceSpace.sessionList") ?? "共振记录"}</h2>
          </div>
          <button
            onClick={handleNewSession}
            className="p-2 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
            title={t("resonanceSpace.newSession") ?? "开启新共振"}
          >
            <Plus className="w-4 h-4 text-purple-500" />
          </button>
        </div>

        {/* Guided Topics */}
        <div className="p-4 border-b border-zinc-100">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("resonanceSpace.guidedTopics") ?? "引导主题"}
          </p>
          <div className="flex flex-wrap gap-2">
            {guidedTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-40">
              <Heart className="w-8 h-8 mb-2 text-purple-400" />
              <p className="text-xs">{t("resonanceSpace.noSessions") ?? "还没有共振记录"}</p>
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
                      ? "bg-purple-900 text-white shadow-md"
                      : "hover:bg-purple-50 text-zinc-600"
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
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className={cn(
                      "absolute right-3 top-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                      currentSession?.id === session.id
                        ? "hover:bg-white/20 text-white/60"
                        : "hover:bg-purple-100 text-zinc-400"
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
        <div className="p-4 md:p-5 border-b border-zinc-100 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowSessionList(true)}
              className="md:hidden p-2 hover:bg-purple-100 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-purple-500" />
            </button>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-zinc-900 truncate text-sm md:text-base">
                {currentSession ? currentSession.title : (t("resonanceSpace.title") ?? "共振空间")}
              </h2>
              <p className="text-[10px] text-purple-500 flex items-center gap-1 uppercase tracking-widest leading-none mt-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                {t("resonanceSpace.activeCopilot") ?? "共振模式 · 在线"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {copied && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />{lang === "zh" ? "已复制" : "Copied"}
              </span>
            )}
            <button
              onClick={handleNewSession}
              className="p-2 hover:bg-purple-50 rounded-xl transition-colors"
              title={t("resonanceSpace.newSession") ?? "开启新共振"}
            >
              <Plus className="w-4 h-4 text-purple-500" />
            </button>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu((v) => !v)}
                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                <MoreVertical className="w-5 h-5 text-zinc-400" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-zinc-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={handleShareSession}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    {lang === "zh" ? "分享对话" : "Share"}
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-zinc-400" />
                    {lang === "zh" ? "复制链接" : "Copy Link"}
                  </button>
                  <div className="h-px bg-zinc-100 mx-2" />
                  <button
                    onClick={handleExportSession}
                    disabled={!messages.length}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 text-zinc-400" />
                    {lang === "zh" ? "导出记录" : "Export"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
          {initializing && !currentSession && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
              <RefreshCw className="w-8 h-8 mb-3 animate-spin text-purple-400" />
              <p className="text-sm">{lang === "zh" ? "正在准备共振空间..." : "Preparing resonance space..."}</p>
            </div>
          )}
          {!initializing && !currentSession && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
              <Heart className="w-12 h-12 mb-4 text-purple-400" />
              <p className="text-sm italic">
                {t("resonanceSpace.startPrompt") ?? "在这里，你可以深度探索内心的声音..."}
              </p>
            </div>
          )}
          {loadingMsgs && (
            <div className="flex-1 flex items-center justify-center opacity-40">
              <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            </div>
          )}
          {!loadingMsgs && messages.length === 0 && currentSession && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 px-4">
              <Heart className="w-10 h-10 mb-3 text-purple-400" />
              <p className="text-sm italic leading-relaxed">
                {lang === "zh"
                  ? "在这里，没有评判，只有陪伴。\n说说你此刻的感受吧。"
                  : "Here, no judgment — only presence.\nShare how you feel right now."}
              </p>
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
                      ? "bg-purple-900 text-white rounded-br-none shadow-md"
                      : "bg-purple-50 text-zinc-800 rounded-bl-none border border-purple-100 shadow-sm"
                  )}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center">
                      <Heart className="w-3.5 h-3.5 text-purple-400 animate-pulse mr-1" />
                      <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 mt-2 px-1">
                  {msg.role === "assistant" ? "共振 AI" : (lang === "zh" ? "你" : "You")} · Just now
                </span>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-6 border-t border-purple-100 bg-purple-50/30">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentSession
                  ? (t("resonanceSpace.inputPlaceholder") ?? "说出你此刻内心深处的感受...")
                  : (t("resonanceSpace.selectSessionPrompt") ?? "请先新建一个共振会话")
              }
              disabled={!currentSession || loadingMsgs}
              className="w-full bg-white border border-purple-200 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="absolute right-2 p-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!currentSession || !inputValue.trim() || loadingMsgs}
                className="absolute right-2 p-2 bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
