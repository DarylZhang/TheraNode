"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nContext";

type PostTag = "all" | "poetry" | "diary" | "artwork" | "reflection";

interface Post {
    id: number;
    author: string;
    avatar: string;
    timeAgo: string;
    tag: Exclude<PostTag, "all">;
    title: string;
    content: string;
    likes: number;
    comments: number;
    liked: boolean;
    bookmarked: boolean;
}

const MOCK_POSTS: Post[] = [
    {
        id: 1,
        author: "深海的鱼",
        avatar: "深",
        timeAgo: "2小时前",
        tag: "poetry",
        title: "《今夜，我允许自己悲伤》",
        content:
            "今夜，我允许自己悲伤\n不解释，不辩白\n只是安静地坐在窗边\n看雨水如何温柔地抹去一切\n\n那些说不清楚的东西\n就让它们沉在心里吧\n像一块石头\n也像一粒种子",
        likes: 84,
        comments: 12,
        liked: false,
        bookmarked: false,
    },
    {
        id: 2,
        author: "晨间笔记",
        avatar: "晨",
        timeAgo: "5小时前",
        tag: "diary",
        title: "和焦虑共处的第 30 天",
        content:
            "今天是我开始练习「观察焦虑而不被卷走」的第30天。我发现，焦虑其实不是敌人，它只是一个非常紧张的信使。当我停止和它对抗，开始问它「你想告诉我什么」，一切都开始松动了……",
        likes: 156,
        comments: 34,
        liked: true,
        bookmarked: true,
    },
    {
        id: 3,
        author: "光的碎片",
        avatar: "光",
        timeAgo: "1天前",
        tag: "reflection",
        title: "关于「接受不完美」这件小事",
        content:
            "我花了很长时间才明白，不完美本身就是一种完整。那些裂缝，那些我一直想藏起来的部分，其实是光最容易照进来的地方。今天想把这句话分享给在这里的每一个人。",
        likes: 230,
        comments: 47,
        liked: false,
        bookmarked: false,
    },
    {
        id: 4,
        author: "蓝色星期三",
        avatar: "蓝",
        timeAgo: "2天前",
        tag: "artwork",
        title: "用线条画出「失眠的感觉」",
        content:
            "失眠的夜晚，我开始在纸上画线条。不规则的、互相缠绕的线条。画着画着，我发现那种混乱的感觉慢慢变成了一种有秩序的混乱。分享这幅作品，希望也能带给你一点点安慰。",
        likes: 98,
        comments: 21,
        liked: false,
        bookmarked: false,
    },
    {
        id: 5,
        author: "小小的松",
        avatar: "松",
        timeAgo: "3天前",
        tag: "poetry",
        title: "《给未来的自己》",
        content:
            "你好，未来的我\n不知道你现在是否还记得\n那个蜷缩在被子里的夜晚\n\n我想告诉你\n你撑过来了\n那就足够了",
        likes: 312,
        comments: 58,
        liked: false,
        bookmarked: false,
    },
];

const TAG_COLORS: Record<Exclude<PostTag, "all">, string> = {
    poetry: "bg-purple-50 text-purple-600 border-purple-100",
    diary: "bg-blue-50 text-blue-600 border-blue-100",
    artwork: "bg-amber-50 text-amber-600 border-amber-100",
    reflection: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const TAG_LABELS: Record<Exclude<PostTag, "all">, string> = {
    poetry: "诗歌",
    diary: "日记",
    artwork: "艺术",
    reflection: "感悟",
};

export default function CommunityPage() {
    const { t } = useI18n();
    const [activeTag, setActiveTag] = useState<PostTag>("all");
    const [sortBy, setSortBy] = useState<"trending" | "recent">("trending");
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [showCompose, setShowCompose] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newTag, setNewTag] = useState<Exclude<PostTag, "all">>("reflection");

    const tags: { key: PostTag; label: string }[] = [
        { key: "all", label: t('community.allPosts') },
        { key: "poetry", label: t('community.poetry') },
        { key: "diary", label: t('community.diary') },
        { key: "artwork", label: t('community.artwork') },
        { key: "reflection", label: t('community.reflection') },
    ];

    const filtered = posts.filter(p => activeTag === "all" || p.tag === activeTag);
    const sorted = [...filtered].sort((a, b) =>
        sortBy === "trending" ? b.likes - a.likes : b.id - a.id
    );

    function toggleLike(id: number) {
        setPosts(prev =>
            prev.map(p =>
                p.id === id
                    ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                    : p
            )
        );
    }

    function toggleBookmark(id: number) {
        setPosts(prev =>
            prev.map(p => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p))
        );
    }

    function handleSubmit() {
        if (!newContent.trim()) return;
        const post: Post = {
            id: Date.now(),
            author: "我",
            avatar: "我",
            timeAgo: "刚刚",
            tag: newTag,
            title: newTitle || "无题",
            content: newContent,
            likes: 0,
            comments: 0,
            liked: false,
            bookmarked: false,
        };
        setPosts(prev => [post, ...prev]);
        setNewTitle("");
        setNewContent("");
        setShowCompose(false);
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{t('community.title')}</h1>
                    <p className="text-sm text-zinc-500 mt-1">{t('community.subtitle')}</p>
                </div>
                <button
                    onClick={() => setShowCompose(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                >
                    <PenSquare className="w-4 h-4" />
                    {t('community.newPost')}
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
                            {(["poetry", "diary", "artwork", "reflection"] as const).map(tag => (
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
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder={t('community.placeholderTitle')}
                            className="w-full text-sm font-medium text-zinc-800 placeholder:text-zinc-300 border-0 border-b border-zinc-100 pb-2 focus:outline-none focus:border-zinc-300 transition-colors bg-transparent"
                        />
                        <textarea
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            placeholder={t('community.placeholderContent')}
                            rows={5}
                            className="w-full text-sm text-zinc-700 placeholder:text-zinc-300 resize-none focus:outline-none bg-zinc-50 rounded-xl p-3 border border-zinc-100 focus:border-zinc-200 transition-colors"
                        />

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowCompose(false)}
                                className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
                            >
                                {t('community.cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!newContent.trim()}
                                className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {t('community.submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {tags.map(({ key, label }) => (
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
                            {key !== "all" && <Tag className="w-3 h-3" />}
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1 bg-zinc-100 rounded-xl p-1">
                    <button
                        onClick={() => setSortBy("trending")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            sortBy === "trending"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Flame className="w-3 h-3" />
                        {t('community.trending')}
                    </button>
                    <button
                        onClick={() => setSortBy("recent")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                            sortBy === "recent"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Clock className="w-3 h-3" />
                        {t('community.recent')}
                    </button>
                </div>
            </div>

            {/* Post List */}
            <div className="space-y-4">
                {sorted.map(post => (
                    <article
                        key={post.id}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-zinc-200 transition-all hover:shadow-sm group"
                    >
                        {/* Post Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-600">
                                    {post.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-800">{post.author}</p>
                                    <p className="text-xs text-zinc-400">{post.timeAgo}</p>
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

                        {/* Post Content */}
                        <h3 className="font-semibold text-zinc-900 mb-2 group-hover:text-zinc-700 transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line line-clamp-4">
                            {post.content}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-50">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium transition-colors",
                                        post.liked
                                            ? "text-rose-500"
                                            : "text-zinc-400 hover:text-rose-400"
                                    )}
                                >
                                    <Heart
                                        className={cn("w-4 h-4", post.liked && "fill-current")}
                                    />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleBookmark(post.id)}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-colors",
                                        post.bookmarked
                                            ? "text-amber-500"
                                            : "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50"
                                    )}
                                >
                                    <Bookmark
                                        className={cn("w-4 h-4", post.bookmarked && "fill-current")}
                                    />
                                </button>
                                <button className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-500 hover:bg-zinc-50 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Trending sidebar hint */}
            <div className="bg-gradient-to-br from-zinc-50 to-white rounded-2xl border border-zinc-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        今日共鸣最多
                    </p>
                </div>
                {MOCK_POSTS.slice()
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map((post, i) => (
                        <div key={post.id} className="flex items-center gap-3 py-2">
                            <span className={cn(
                                "text-xs font-bold w-5 text-center",
                                i === 0 ? "text-amber-500" : "text-zinc-300"
                            )}>
                                {i + 1}
                            </span>
                            <p className="text-sm text-zinc-700 truncate flex-1">{post.title}</p>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {post.likes}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
