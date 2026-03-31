"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  PenSquare,
  Flame,
  Clock,
  Tag,
  X,
  ChevronUp,
  Bookmark,
  Share2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  getPosts,
  createPost,
  likePost,
  unlikePost,
  bookmarkPost,
  unbookmarkPost,
} from "@/lib/api/community";
import { ApiError } from "@/lib/api/client";
import type { CommunityPost, PostTag } from "@/lib/api/types";

type FilterTag = "ALL" | PostTag;
type SortMode = "popular" | "latest";

const TAG_COLORS: Record<PostTag, string> = {
  REFLECTION: "bg-emerald-50 text-emerald-600 border-emerald-100",
  POEM: "bg-purple-50 text-purple-600 border-purple-100",
  GRATITUDE: "bg-yellow-50 text-yellow-600 border-yellow-100",
  MILESTONE: "bg-blue-50 text-blue-600 border-blue-100",
  QUESTION: "bg-rose-50 text-rose-600 border-rose-100",
};

const TAG_LABELS: Record<PostTag, string> = {
  REFLECTION: "感悟",
  POEM: "诗歌",
  GRATITUDE: "感恩",
  MILESTONE: "里程碑",
  QUESTION: "提问",
};

export default function CommunityPage() {
  const { t } = useI18n();
  const [activeTag, setActiveTag] = useState<FilterTag>("ALL");
  const [sortBy, setSortBy] = useState<SortMode>("latest");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState<PostTag>("REFLECTION");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const page = await getPosts({
        tag: activeTag !== "ALL" ? activeTag : undefined,
        sort: sortBy === "popular" ? "popular" : "latest",
      });
      setPosts(page.content);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTag, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function toggleLike(post: CommunityPost) {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, likedByMe: !p.likedByMe, likesCount: p.likedByMe ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
    try {
      if (post.likedByMe) await unlikePost(post.id);
      else await likePost(post.id);
    } catch (err) {
      // Revert on error
      if (err instanceof ApiError && err.code === 409) return; // already liked
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, likedByMe: post.likedByMe, likesCount: post.likesCount }
            : p
        )
      );
    }
  }

  async function toggleBookmark(post: CommunityPost) {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p))
    );
    try {
      if (post.bookmarkedByMe) await unbookmarkPost(post.id);
      else await bookmarkPost(post.id);
    } catch (err) {
      if (err instanceof ApiError && err.code === 409) return;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, bookmarkedByMe: post.bookmarkedByMe } : p
        )
      );
    }
  }

  async function handleSubmit() {
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      const post = await createPost({
        tag: newTag,
        title: newTitle.trim() || "无题",
        content: newContent.trim(),
      });
      setPosts((prev) => [post, ...prev]);
      setNewTitle("");
      setNewContent("");
      setShowCompose(false);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  const filterTags: { key: FilterTag; label: string }[] = [
    { key: "ALL", label: t("community.allPosts") },
    ...Object.entries(TAG_LABELS).map(([k, v]) => ({ key: k as PostTag, label: v })),
  ];

  const topPosts = [...posts].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("community.title")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("community.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors"
        >
          <PenSquare className="w-4 h-4" />
          {t("community.newPost")}
        </button>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900">分享你的感受</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            {/* Tag selector */}
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(TAG_LABELS) as PostTag[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setNewTag(tag)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                    newTag === tag
                      ? TAG_COLORS[tag]
                      : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                  )}
                >
                  {TAG_LABELS[tag]}
                </button>
              ))}
            </div>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t("community.placeholderTitle")}
              className="w-full text-sm font-medium text-zinc-800 placeholder:text-zinc-300 border-0 border-b border-zinc-100 pb-2 focus:outline-none focus:border-zinc-300 transition-colors bg-transparent"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={t("community.placeholderContent")}
              rows={5}
              className="w-full text-sm text-zinc-700 placeholder:text-zinc-300 resize-none focus:outline-none bg-zinc-50 rounded-xl p-3 border border-zinc-100 focus:border-zinc-200 transition-colors"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                {t("community.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newContent.trim() || submitting}
                className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {t("community.submit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {filterTags.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTag(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                activeTag === key
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
              )}
            >
              {key !== "ALL" && <Tag className="w-3 h-3" />}
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
          <button
            onClick={() => setSortBy("popular")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
              sortBy === "popular"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Flame className="w-3 h-3" />
            {t("community.trending")}
          </button>
          <button
            onClick={() => setSortBy("latest")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
              sortBy === "latest"
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <Clock className="w-3 h-3" />
            {t("community.recent")}
          </button>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-zinc-100 animate-pulse" />
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm">暂无帖子</div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-zinc-200 transition-all hover:shadow-sm group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{post.authorName}</p>
                    <p className="text-xs text-zinc-400">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full border",
                    TAG_COLORS[post.tag]
                  )}
                >
                  {TAG_LABELS[post.tag]}
                </span>
              </div>

              <h3 className="font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line line-clamp-4">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium transition-colors",
                      post.likedByMe ? "text-rose-500" : "text-zinc-400 hover:text-rose-400"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", post.likedByMe && "fill-current")} />
                    <span>{post.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleBookmark(post)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      post.bookmarkedByMe
                        ? "text-amber-500"
                        : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50"
                    )}
                  >
                    <Bookmark className={cn("w-4 h-4", post.bookmarkedByMe && "fill-current")} />
                  </button>
                  <button className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Top posts hint */}
      {topPosts.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-50 to-white rounded-2xl border border-zinc-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ChevronUp className="w-4 h-4 text-zinc-400" />
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              今日共鸣最多
            </p>
          </div>
          {topPosts.map((post, i) => (
            <div key={post.id} className="flex items-center gap-3 py-2">
              <span
                className={cn(
                  "text-xs font-bold w-5 text-center",
                  i === 0 ? "text-amber-500" : "text-zinc-300"
                )}
              >
                {i + 1}
              </span>
              <p className="text-sm text-zinc-700 truncate flex-1">{post.title}</p>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Heart className="w-3 h-3" /> {post.likesCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
