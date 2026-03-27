"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    PenTool,
    // History,
    Users,
    ChevronRight,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { t } = useI18n();

    const menuItems = [
        { icon: LayoutDashboard, label: t('common.dashboard'), href: "/dashboard" },
        { icon: MessageSquare, label: t('sidebar.aiDialogue'), href: "/resonance" },
        { icon: PenTool, label: t('studio.title'), href: "/studio" },
        // { icon: History, label: t('common.records'), href: "/records" },
        { icon: Users, label: t('sidebar.community'), href: "/community" },
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

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
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
        </>
    );
}
