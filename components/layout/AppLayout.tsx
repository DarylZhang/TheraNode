"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
            <div className="flex flex-1 relative">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <MobileBottomNav />
        </div>
    );
}
