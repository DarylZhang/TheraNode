"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

type Step = "request" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [account, setAccount] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!account.trim()) return;
    setError("");
    setLoading(true);
    try {
      await forgotPassword(account.trim());
      setStep("reset");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("发送失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (newPassword.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(account.trim(), code.trim(), newPassword);
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("重置失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 rounded-2xl mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {step === "done" ? "密码已重置" : "找回密码"}
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {step === "request" && "输入你的账号，我们将发送重置验证码"}
            {step === "reset" && `验证码已发送至 ${account}`}
            {step === "done" && "你可以使用新密码登录了"}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "request" && (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  邮箱 / 手机号
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "发送中..." : "发送验证码"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  验证码
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6 位验证码"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  新密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="至少 6 位"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  确认新密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "重置中..." : "重置密码"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("request"); setError(""); }}
                className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                重新发送验证码
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>密码重置成功！</span>
              </div>
              <button
                onClick={() => router.replace("/login")}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all"
              >
                去登录
              </button>
            </div>
          )}

          <p className="text-center text-sm text-zinc-500">
            想起密码了？{" "}
            <Link href="/login" className="text-zinc-900 font-medium hover:underline">
              返回登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
