"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { saveTokens, BASE_URL } from "@/lib/api/client";
import { useAuthStore } from "@/store/useAuthStore";

function OAuth2RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    saveTokens(accessToken, refreshToken);

    fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json?.data) {
          setUser(json.data);
          localStorage.setItem("currentUser", JSON.stringify(json.data));
        }
      })
      .catch(() => {})
      .finally(() => router.replace("/dashboard"));
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-2xl animate-pulse">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <p className="text-zinc-500 text-sm">正在处理登录，请稍候...</p>
      </div>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-2xl animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      }
    >
      <OAuth2RedirectInner />
    </Suspense>
  );
}
