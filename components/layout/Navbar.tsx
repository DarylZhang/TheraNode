"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Bell, Languages, Menu, LogOut, UserCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useAuthStore } from "@/store/useAuthStore";
import { logout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { lang, setLang, t } = useI18n();
  const router = useRouter();
  const { user, hydrate } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  async function handleLogout() {
    setUserMenuOpen(false);
    try {
      await logout();
    } catch {
      // clear locally even if request fails
    }
    router.replace("/login");
  }

  const avatarChar = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-8">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5 text-zinc-600" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-zinc-900">
            TheraNode
          </span>
        </Link>

      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-100 rounded-xl transition-colors text-xs font-medium text-zinc-600"
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{lang === "zh" ? "EN" : "中文"}</span>
        </button>

        <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5 text-zinc-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold border border-zinc-700 hover:opacity-80 transition-opacity overflow-hidden"
            aria-label="用户菜单"
          >
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{avatarChar}</span>
            )}
          </button>

          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-50 w-52 bg-white rounded-2xl border border-zinc-200 shadow-lg py-1.5 overflow-hidden">
                {user && (
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email ?? user.phone}</p>
                  </div>
                )}
                <Link
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-zinc-400" />
                  个人设置
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
