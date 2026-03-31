"use client";

import Link from "next/link";
import { Sparkles, Mail, MessageCircle, Github, ArrowLeft } from "lucide-react";

export default function ContactPage() {
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

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-zinc-900 mb-3">联系我们</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              有任何问题、反馈或合作意向，欢迎随时联系我们。<br />
              我们通常在 1-2 个工作日内回复。
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:hello@theranode.com"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-900 transition-colors">
                <Mail className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">邮件联系</p>
                <p className="text-sm text-zinc-400">hello@theranode.com</p>
              </div>
            </a>

            <a
              href="https://github.com/theranode"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-900 transition-colors">
                <Github className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">GitHub</p>
                <p className="text-sm text-zinc-400">github.com/theranode</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-200">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">用户反馈</p>
                <p className="text-sm text-zinc-400">功能建议与问题反馈，请发送至邮件</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-10">
            © 2026 TheraNode · 让艺术成为你心灵的避风港
          </p>
        </div>
      </main>
    </div>
  );
}
