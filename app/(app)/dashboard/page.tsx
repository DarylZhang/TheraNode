"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Smile,
  TrendingUp,
  MessageSquare,
  PenTool,
  ArrowRight,
  Sparkles,
  Book,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useAuthStore } from "@/store/useAuthStore";
import { getDashboard } from "@/lib/api/dashboard";
import type { DashboardData } from "@/lib/api/types";

export default function DashboardPage() {
  const { t } = useI18n();
  const { user, hydrate } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
    getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hydrate]);

  const scoreDisplay = data ? `${Math.round(data.emotionScore * 10)} / 100` : "--";
  const trend = data?.emotionTrend ?? [];
  const recentWorks = data?.recentWorks ?? [];
  const maxScore = Math.max(...trend.map((d) => d.score), 1);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
          {t("dashboard.greeting")}, {user?.name ?? "..."}
        </h1>
        <p className="text-zinc-500 mt-1 italic text-sm md:text-base">
          &ldquo;{t("dashboard.subtitle")}&rdquo;
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Mood State Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-5 md:mb-6 gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                {t("dashboard.moodState")}
              </h3>
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 shrink-0" />
                <span className="text-lg md:text-2xl font-bold text-zinc-900 truncate">
                  {loading ? "加载中..." : `${t("dashboard.moodIndex")}: ${scoreDisplay}`}
                </span>
              </div>
            </div>
            <div className="bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium text-green-600 flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">{t("dashboard.weeklyTrend")}</span>
              <span className="sm:hidden">↑</span>
            </div>
          </div>

          {/* Emotion Trend Bar Chart */}
          <div className="h-24 bg-zinc-50 rounded-2xl flex items-end justify-around px-4 py-3 mb-6 gap-1">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-zinc-100 rounded-t-lg animate-pulse"
                    style={{ height: `${30 + i * 8}px` }}
                  />
                ))
              : trend.length > 0
              ? trend.slice(-7).map((d, i, arr) => (
                  <div
                    key={i}
                    title={`${d.date}: ${d.score}`}
                    className={`flex-1 rounded-t-lg transition-all ${
                      i === arr.length - 1 ? "bg-zinc-900 animate-pulse" : "bg-zinc-300"
                    }`}
                    style={{ height: `${Math.max(8, (d.score / maxScore) * 72)}px` }}
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-zinc-100 rounded-t-lg"
                    style={{ height: `${20 + i * 10}px` }}
                  />
                ))}
          </div>

          <Link href="/resonance">
            <button className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]">
              {t("dashboard.startDialogue")} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* AI Recommendation Card */}
        <div className="bg-zinc-900 rounded-3xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/60">{t("dashboard.aiRecTitle")}</span>
            </div>
            <p className="text-xl font-medium leading-relaxed mb-8 flex-1">
              &ldquo;{t("dashboard.aiRecText")}&rdquo;
            </p>
            <Link href="/resonance">
              <button className="px-6 py-2.5 bg-white text-zinc-900 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-100 transition-colors w-fit">
                {t("dashboard.enterResonance")}
              </button>
            </Link>
          </div>
        </div>

        {/* Community Activity Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-5 md:p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
              <PenTool className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-bold text-zinc-900 truncate">
                {t("dashboard.creationReminder")}
              </h3>
              <p className="text-zinc-500 text-sm truncate">
                {data
                  ? `共发布 ${data.communityActivity.postsCount} 篇 · 获赞 ${data.communityActivity.likesReceived}`
                  : t("dashboard.reminderText", { days: 3 })}
              </p>
            </div>
          </div>
          <Link href="/studio?tab=diary" className="shrink-0">
            <button className="px-3 md:px-5 py-2 md:py-2.5 border border-zinc-200 rounded-xl text-sm font-medium hover:bg-zinc-50 transition-colors whitespace-nowrap">
              {t("dashboard.continueWriting")}
            </button>
          </Link>
        </div>

        {/* Recent Works Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-900">{t("dashboard.recentWorks")}</h3>
            <Link href="/studio" className="text-xs font-medium text-zinc-400 hover:text-zinc-900">
              {t("dashboard.viewAll")}
            </Link>
          </div>
          <div className="space-y-3 flex-1">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-50 rounded-2xl animate-pulse" />
              ))
            ) : recentWorks.length > 0 ? (
              recentWorks.slice(0, 3).map((work) => (
                <Link key={work.id} href="/studio">
                  <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          work.type === "POEM" ? "bg-blue-50" : "bg-green-50"
                        }`}
                      >
                        {work.type === "POEM" ? (
                          <Sparkles className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Book className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{work.title}</p>
                        <p className="text-xs text-zinc-400">
                          {new Date(work.updatedAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-20 opacity-40">
                <p className="text-xs text-zinc-400">还没有作品，快去创作吧</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
