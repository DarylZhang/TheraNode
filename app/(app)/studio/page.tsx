"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PenTool,
  Sparkles,
  Save,
  Wand2,
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getEntries, createEntry, updateEntry, deleteEntry } from "@/lib/api/studio";
import type { StudioEntry, StudioEntryType } from "@/lib/api/types";

export default function StudioPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<StudioEntryType>("DIARY");
  const [entries, setEntries] = useState<StudioEntry[]>([]);
  const [selected, setSelected] = useState<StudioEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const loadEntries = useCallback(async (type: StudioEntryType) => {
    setLoadingList(true);
    try {
      const page = await getEntries(type);
      setEntries(page.content);
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadEntries(activeTab);
  }, [activeTab, loadEntries]);

  function handleTabChange(tab: StudioEntryType) {
    setActiveTab(tab);
    setSelected(null);
    setTitle("");
    setContent("");
    setIsNew(false);
  }

  function handleSelectEntry(entry: StudioEntry) {
    setSelected(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsNew(false);
  }

  function handleNewEntry() {
    setSelected(null);
    setTitle("");
    setContent("");
    setIsNew(true);
  }

  async function handleSave() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      if (isNew || !selected) {
        const entry = await createEntry({
          type: activeTab,
          title: title.trim() || "无题",
          content,
        });
        setEntries((prev) => [entry, ...prev]);
        setSelected(entry);
        setIsNew(false);
      } else {
        const updated = await updateEntry(selected.id, {
          type: activeTab,
          title: title.trim() || "无题",
          content,
        });
        setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        setSelected(updated);
      }
      setSavedMsg(true);
      setShowToast(true);
      setTimeout(() => setSavedMsg(false), 2500);
      setTimeout(() => setShowToast(false), 4000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) {
        setSelected(null);
        setTitle("");
        setContent("");
        setIsNew(false);
      }
    } catch {
      // ignore
    }
  }

  const hasChanges =
    isNew
      ? title.trim() !== "" || content !== ""
      : title !== (selected?.title ?? "") || content !== (selected?.content ?? "");

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Save Success Toast */}
      <div
        className={cn(
          "fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-5 py-3 bg-zinc-900 text-white rounded-2xl shadow-xl transition-all duration-500",
          showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
        <span className="text-sm font-medium">保存成功！</span>
      </div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {t("studio.title")}
          </h1>
          <p className="text-zinc-500 mt-1 italic text-sm md:text-base">
            &ldquo;{t("studio.subtitle")}&rdquo;
          </p>
        </div>
        <div className="flex bg-white border border-zinc-200 p-1.5 rounded-2xl shadow-sm w-full sm:w-auto">
          <button
            onClick={() => handleTabChange("DIARY")}
            className={cn(
              "flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === "DIARY"
                ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <PenTool className="w-4 h-4" />
            {t("studio.tabs.diary")}
          </button>
          <button
            onClick={() => handleTabChange("POEM")}
            className={cn(
              "flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === "POEM"
                ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            <Sparkles className="w-4 h-4" />
            {t("studio.tabs.poetry")}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 min-h-[500px] md:min-h-[600px]">
        {/* Left: Entry List */}
        <aside className="lg:col-span-1 space-y-3 flex flex-col">
          <button
            onClick={handleNewEntry}
            className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-zinc-200 rounded-2xl text-sm font-medium text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建{activeTab === "DIARY" ? "日记" : "诗歌"}
          </button>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[520px]">
            {loadingList ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              ))
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 opacity-40">
                <BookOpen className="w-8 h-8 mb-2" />
                <p className="text-xs text-zinc-400">还没有作品</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => handleSelectEntry(entry)}
                  className={cn(
                    "p-3 rounded-2xl cursor-pointer transition-all group relative",
                    selected?.id === entry.id
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-sm"
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-semibold truncate pr-6",
                      selected?.id === entry.id ? "text-white" : "text-zinc-800"
                    )}
                  >
                    {entry.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs truncate mt-0.5",
                      selected?.id === entry.id ? "text-white/60" : "text-zinc-400"
                    )}
                  >
                    {new Date(entry.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className={cn(
                      "absolute right-2.5 top-2.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                      selected?.id === entry.id
                        ? "hover:bg-white/20 text-white/60"
                        : "hover:bg-zinc-100 text-zinc-400"
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Inspiration block */}
          <div className="bg-zinc-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                {t("studio.hintTitle")}
              </h3>
              <p className="text-sm font-medium leading-relaxed">
                &ldquo;{t("studio.hintText")}&rdquo;
              </p>
            </div>
          </div>
        </aside>

        {/* Right: Editor */}
        <main className="lg:col-span-3 flex flex-col bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("studio.titlePlaceholder")}
              className="bg-transparent border-none text-xl font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-300 w-full px-4"
            />
          </div>

          <div className="flex-1 p-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("studio.contentPlaceholder")}
              className="w-full h-full min-h-[400px] resize-none border-none focus:outline-none text-zinc-700 leading-loose text-lg placeholder:text-zinc-200"
            />
          </div>

          <div className="p-4 md:p-6 bg-zinc-50/80 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="px-4 md:px-5 py-2 md:py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md shadow-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : savedMsg ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "保存中..." : savedMsg ? "已保存" : t("common.save")}
              </button>
              <button className="px-4 md:px-5 py-2 md:py-2.5 bg-white border border-zinc-200 text-zinc-900 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 transition-all active:scale-[0.98]">
                <Wand2
                  className={cn(
                    "w-4 h-4",
                    activeTab === "POEM" ? "text-purple-500" : "text-zinc-400"
                  )}
                />
                <span className="hidden sm:inline">
                  {activeTab === "POEM"
                    ? t("studio.generatePoetry")
                    : t("studio.generatePolish")}
                </span>
                <span className="sm:hidden">{activeTab === "POEM" ? "生成" : "润色"}</span>
              </button>
            </div>

            {selected && (
              <p className="text-xs text-zinc-400">
                上次修改：{new Date(selected.updatedAt).toLocaleString("zh-CN")}
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
