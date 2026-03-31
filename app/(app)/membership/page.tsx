"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/client";

export default function MembershipPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("新密码至少需要 6 位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("两次输入的新密码不一致");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/users/me/password", {
        method: "PUT",
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });
      setSuccess("密码修改成功");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("修改失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-zinc-900 mb-1">账户设置</h1>
      <p className="text-zinc-500 text-sm mb-8">管理你的账户安全信息</p>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-zinc-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">修改密码</h2>
            <p className="text-xs text-zinc-400">建议定期更新密码以保证账户安全</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 mb-4">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "当前密码", value: currentPassword, setValue: setCurrentPassword, show: showCurrent, setShow: setShowCurrent },
            { label: "新密码", value: newPassword, setValue: setNewPassword, show: showNew, setShow: setShowNew },
            { label: "确认新密码", value: confirmPassword, setValue: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
          ].map(({ label, value, setValue, show, setShow }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "保存中..." : "保存修改"}
          </button>
        </form>
      </div>
    </div>
  );
}
