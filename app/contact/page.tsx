"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Mail, MessageCircle, Github, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const FEEDBACK_TOPICS = [
  { value: "layout", label: "页面布局问题" },
  { value: "healing", label: "疗愈项目建议" },
  { value: "feature", label: "功能建议" },
  { value: "other", label: "其它" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("feature");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);

    // Simulate submission (in production, call a real API)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      // Build mailto link as fallback for now
      const subject = `[TheraNode反馈] ${FEEDBACK_TOPICS.find(t => t.value === topic)?.label ?? topic}`;
      const body = `姓名: ${name || "匿名"}\n邮箱: ${email || "未填写"}\n\n${content}`;
      const mailtoUrl = `mailto:hello@theranode.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    } catch {
      // ignore
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">TheraNode</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </header>

      <main className="flex-1 px-4 py-12 md:py-16">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 mb-3">联系我们</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              有任何问题、反馈或合作意向，欢迎随时联系我们。<br />
              我们通常在 1-2 个工作日内回复。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <a
              href="mailto:hello@theranode.com"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-900 transition-colors">
                <Mail className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">邮件联系</p>
                <p className="text-xs text-zinc-400">hello@theranode.com</p>
              </div>
            </a>

            <a
              href="https://github.com/theranode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-900 transition-colors">
                <Github className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">GitHub</p>
                <p className="text-xs text-zinc-400">github.com/theranode</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-zinc-200">
              <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">用户反馈</p>
                <p className="text-xs text-zinc-400">功能建议与问题反馈</p>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6">发送反馈</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">感谢你的反馈！</h3>
                <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                  我们会认真阅读每一条建议，并在 1-2 个工作日内回复。
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setContent("");
                    setTopic("feature");
                  }}
                  className="mt-6 px-5 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  再次反馈
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                      你的名字 <span className="text-zinc-300">（选填）</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="你的名字"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                      你的邮箱 <span className="text-zinc-300">（选填）</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="方便我们回复你"
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">反馈类型</label>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_TOPICS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTopic(t.value)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-xl transition-all",
                          topic === t.value
                            ? "bg-zinc-900 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    详细描述 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="详细描述你的问题或建议..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      发送反馈
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-zinc-400 mt-8">
            © 2026 TheraNode · 让艺术成为你心灵的避风港
          </p>
        </div>
      </main>
    </div>
  );
}
