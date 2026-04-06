"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    PenTool,
    Users,
    Crown,
    Mail,
    ChevronRight,
    X,
    Heart,
    RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useState } from "react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const INSPIRATION_QUOTES_ZH = [
    "万物皆有裂痕，那是光照进来的地方。",
    "你不需要修复自己，你只需要爱自己。",
    "每一次呼吸，都是一次重新开始的机会。",
    "内心的平静，是你随时可以回家的地方。",
    "慢下来，感受此刻。你已经做得够好了。",
    "痛苦不是终点，它是你变得更深刻的路途。",
    "允许自己感受，这本身就是一种勇气。",
];

const INSPIRATION_QUOTES_EN = [
    "There is a crack in everything, that's how the light gets in.",
    "You don't need to fix yourself. You just need to love yourself.",
    "Every breath is a chance to begin again.",
    "Inner peace is a home you can always return to.",
    "Slow down. Feel this moment. You are enough.",
    "Pain is not the end — it's the path to greater depth.",
    "Allowing yourself to feel is an act of courage.",
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { t, lang } = useI18n();
    const [quoteIndex, setQuoteIndex] = useState(0);

    const quotes = lang === "zh" ? INSPIRATION_QUOTES_ZH : INSPIRATION_QUOTES_EN;

    const handleRefreshQuote = () => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: t('common.dashboard'), href: "/dashboard" },
        { icon: MessageSquare, label: t('sidebar.aiDialogue'), href: "/resonance" },
        { icon: Heart, label: t('sidebar.resonanceSpace') ?? "共振空间", href: "/resonance-space" },
        { icon: PenTool, label: t('studio.title'), href: "/studio" },
        { icon: Users, label: t('sidebar.community'), href: "/community" },
        { icon: Crown, label: t('common.membership'), href: "/membership" },
    ];

    return (
        <>
            {/* 移动端遮罩层 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "w-64 border-r border-zinc-200 bg-white flex flex-col h-[calc(100vh-64px)]",
                "fixed md:sticky top-16 z-40 md:z-auto",
                "transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* 移动端关闭按钮 */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                    <span className="text-sm font-semibold text-zinc-700">导航菜单</span>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]) || (pathname.startsWith(item.href + "/") && item.href !== "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? item.href === "/resonance-space"
                                            ? "bg-purple-900 text-white shadow-sm"
                                            : "bg-zinc-900 text-white shadow-sm"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn(
                                        "w-4 h-4",
                                        isActive
                                            ? "text-white"
                                            : item.href === "/resonance-space"
                                                ? "text-purple-400 group-hover:text-purple-600"
                                                : "text-zinc-400 group-hover:text-zinc-900"
                                    )} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-2">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                {t('sidebar.inspiration')}
                            </p>
                            <button
                                onClick={handleRefreshQuote}
                                className="p-1 rounded-lg hover:bg-zinc-200 transition-colors text-zinc-400 hover:text-zinc-600"
                                title={t('sidebar.refreshInspiration') ?? "换一句"}
                            >
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-600 italic leading-relaxed">
                            &ldquo;{quotes[quoteIndex]}&rdquo;
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                    >
                        <Mail className="w-4 h-4 text-zinc-400" />
                        {t('common.contact')}
                    </Link>
                </div>
            </aside>
        </>
    );
}
