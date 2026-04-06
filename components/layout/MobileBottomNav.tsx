"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    PenTool,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

export function MobileBottomNav() {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems = [
        { icon: LayoutDashboard, label: t('common.dashboard'), href: "/dashboard" },
        { icon: MessageSquare, label: t('sidebar.aiDialogue'), href: "/resonance" },
        { icon: PenTool, label: t('studio.title'), href: "/studio" },
        { icon: Users, label: t('sidebar.community'), href: "/community" },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-zinc-200 safe-area-pb">
            <div className="flex items-center justify-around px-1 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (!item.href.includes('?') && pathname.startsWith(item.href + "/") && item.href !== "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all flex-1",
                                isActive
                                    ? "text-zinc-900"
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                                isActive ? "bg-zinc-900" : ""
                            )}>
                                <item.icon className={cn(
                                    "w-4 h-4",
                                    isActive ? "text-white" : ""
                                )} />
                            </div>
                            <span className="text-[10px] font-medium leading-none truncate w-full text-center px-1">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
