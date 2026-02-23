import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-zinc-900">TheraNode</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard#playspace" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Playspace
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="text-sm font-medium hover:text-zinc-600 transition-colors">
              Enter App
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 pt-24 pb-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600 mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Digital Mindfulness & Art Therapy</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-6 leading-tight">
            A safe space for <br />
            <span className="text-zinc-500 italic">your creative mind.</span>
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience therapeutic art creation in a digital playspace designed for mindfulness,
            reflection, and emotional processing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-zinc-900 text-white rounded-full font-medium flex items-center gap-2 hover:bg-zinc-800 transition-all transform hover:scale-105">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">Private & Secure</h3>
              <p className="text-zinc-600 leading-relaxed">
                Your therapeutic journey is yours alone. We prioritize your privacy and data security.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">Interactive Therapy</h3>
              <p className="text-zinc-600 leading-relaxed">
                Move abstract stones and emotions in our 2D playspace to visualize your thoughts.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">AI Copilot</h3>
              <p className="text-zinc-600 leading-relaxed">
                A gentle companion to guide you through your art therapy exercises.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-zinc-200 bg-zinc-50 text-center">
        <p className="text-sm text-zinc-500">
          © 2024 TheraNode. Built for mindfulness.
        </p>
      </footer>
    </div>
  );
}
