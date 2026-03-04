"use client";

import dynamic from 'next/dynamic';

// NextAuth check should happen in middleware, but session can be used here if needed
const PlayspaceClient = dynamic(() => import('./PlayspaceClient'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50">
            <div className="text-zinc-400 font-medium">Entering your playspace...</div>
        </div>
    )
});

export default function PlayspacePage() {
    return <PlayspaceClient />;
}
