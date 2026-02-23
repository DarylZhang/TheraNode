import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Palette, Calendar, MessageSquare, LogOut, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    const user = session?.user || {
        name: "Therapy Guest",
        email: "guest@example.com",
        image: null,
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar (Simple for Dashboard) */}
            <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col p-6 hidden md:flex">
                <div className="flex items-center gap-2 mb-12">
                    <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold">T</div>
                    <span className="font-semibold text-lg">TheraNode</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-zinc-100 text-zinc-900 rounded-lg font-medium">
                        <Calendar className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <Link href="/playspace" className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-50 rounded-lg">
                        <Palette className="w-4 h-4" />
                        Playspace
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                            {user.image ? (
                                <Image src={user.image} alt={user.name || ""} width={40} height={40} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-medium">
                                    {user.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate">{user.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:text-red-600 transition-colors text-sm">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome back, {user.name?.split(' ')[0]}</h1>
                        <p className="text-zinc-500 italic">"Creativity is intelligence having fun." — Albert Einstein</p>
                    </header>

                    <div id="modules" className="space-y-8">
                        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Interactive Therapy Modules
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Module 1: Sandplay */}
                            <Link href="/playspace" className="group">
                                <div className="p-6 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-400 transition-all shadow-sm group-hover:shadow-md h-full flex flex-col">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                        <Palette className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                        Digital Sandplay
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-zinc-600 mb-6 flex-1">
                                        Visualise your thoughts using abstract 2D shapes and stones in a responsive interactive stage.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                                        <span>Enter Stage</span>
                                        <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Module 2: Whiteboard */}
                            <Link href="/whiteboard" className="group">
                                <div className="p-6 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-400 transition-all shadow-sm group-hover:shadow-md h-full flex flex-col">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                        Healing Whiteboard
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-zinc-600 mb-6 flex-1">
                                        Express your emotions through free-form drawing and sketching in a boundless digital canvas.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                                        <span>Start Drawing</span>
                                        <div className="w-5 h-5 bg-zinc-100 rounded-full flex items-center justify-center">
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Other Modules (Placeholders) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-zinc-100/50 border border-zinc-200 border-dashed rounded-2xl">
                                <h3 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-zinc-400" />
                                    AI Guided Journaling
                                </h3>
                                <p className="text-zinc-500 text-sm mb-4">
                                    Reflect on your day with our gentle AI companion. Coming soon.
                                </p>
                                <div className="px-3 py-1 bg-zinc-100 text-zinc-400 text-xs font-medium rounded-full inline-block">
                                    LOCKED
                                </div>
                            </div>

                            <div className="p-6 bg-white border border-zinc-200 rounded-2xl h-fit">
                                <h3 className="text-lg font-semibold text-zinc-900 mb-2">Daily Intention</h3>
                                <p className="text-zinc-600 text-sm italic">
                                    "I will be kind to myself today and allow my emotions to flow through my art."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
