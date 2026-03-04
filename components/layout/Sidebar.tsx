"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    PenTool,
    Music,
    History,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useI18n();

    const menuItems = [
        { icon: LayoutDashboard, label: t('common.dashboard'), href: "/dashboard" },
        { icon: MessageSquare, label: t('sidebar.aiDialogue'), href: "/resonance" },
        { icon: PenTool, label: t('sidebar.writingDiary'), href: "/studio?tab=diary" },
        { icon: Music, label: t('sidebar.poetryGen'), href: "/studio?tab=poetry" },
        { icon: History, label: t('common.records'), href: "/records" },
    ];

    return (
        <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col h-[calc(100vh-64px)] sticky top-16">
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    // Simplify isActive check for MVP
                    const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-zinc-900 text-white shadow-sm"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
                                {item.label}
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t('sidebar.inspiration')}</p>
                    <p className="text-sm text-zinc-600 italic">"{t('sidebar.inspirationQuote')}"</p>
                </div>
            </div>
        </aside>
    );
}
