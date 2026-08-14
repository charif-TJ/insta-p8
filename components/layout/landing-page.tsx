"use client"

import { useRouter } from "next/navigation"
import {
  Zap, MessageCircle, Sparkles, ArrowUpRight,
  AtSign, Brain, Inbox, Lock, Terminal, Shield, CheckCircle2,
} from "lucide-react"

export function LandingPage() {
  const router = useRouter()

  const handleLogin = () => {
    // Instagram Business Login (Instagram API with Instagram Login)
    window.location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments`
  }

  const handleTestLogin = () => {
    localStorage.setItem("ig_user_id", "9999999999")
    localStorage.setItem("ig_username", "test_creator")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#070708] text-[#ededed] selection:bg-[#ffe14d] selection:text-black overflow-x-hidden antialiased relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-serif-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-mono-ui { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 30s linear infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up .7s cubic-bezier(.2,.7,.2,1) both; }
        .grain::before {
          content: ""; position: fixed; inset: 0; z-index: 5; pointer-events: none; opacity: .04;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="grain" />

      {/* Decorative Glow Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#ffe14d]/15 via-rose-500/10 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Hero Content (Header removed as requested) */}
      <main className="relative z-10">
        <section className="px-5 md:px-10 pt-16 md:pt-24 pb-16 max-w-6xl mx-auto">
          {/* Top Brand Tag replacing former navbar header */}
          <div className="fade-up flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.06]" style={{ animationDelay: "0ms" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ffe14d] to-amber-500 text-black flex items-center justify-center rounded-lg shadow-lg shadow-[#ffe14d]/10">
                <Zap className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="font-mono-ui text-base font-bold tracking-tight text-white">Instagram Automation</span>
              <span className="hidden sm:inline-flex items-center gap-1 font-mono-ui text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay: "60ms" }}>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.25em] text-neutral-500 mb-6">
              Instagram automation // privacy-focused // dedicated platform
            </p>
          </div>

          <h1 className="fade-up font-serif-display text-[15vw] md:text-[7.5rem] leading-[0.95] tracking-tight" style={{ animationDelay: "120ms" }}>
            Your DMs,
            <br />
            <span className="italic bg-gradient-to-r from-[#ffe14d] via-amber-300 to-amber-500 bg-clip-text text-transparent">on autopilot.</span>
          </h1>

          <div className="fade-up mt-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-16" style={{ animationDelay: "180ms" }}>
            <p className="text-neutral-400 text-base md:text-lg max-w-md leading-relaxed">
              Comment-to-DM funnels, keyword triggers, story reactions, AI replies, a live inbox,
              and Reels scheduling. Powerful automation with total data control.
            </p>
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleLogin}
                className="group flex items-center gap-2.5 bg-[#ffe14d] text-black font-mono-ui text-sm font-bold px-8 py-4 rounded-full hover:bg-white hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-[#ffe14d]/10"
              >
                Connect Instagram
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={handleTestLogin}
                  className="group flex items-center gap-2 font-mono-ui text-sm font-bold text-[#ffe14d] border border-[#ffe14d]/30 px-7 py-4 rounded-full hover:bg-[#ffe14d]/10 active:scale-[0.98] transition-all"
                >
                  <Terminal className="w-4 h-4" />
                  Dev Login
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="border-y border-white/[0.08] py-3.5 bg-white/[0.01] overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap font-mono-ui text-xs uppercase tracking-[0.2em] text-neutral-500 gap-8 w-max">
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} className="flex gap-8">
                {["comment → DM", "keyword triggers", "story reactions", "AI auto-reply", "live inbox", "ice breakers", "follow gate", "quick replies", "media attachments", "public + private replies"].map((t) => (
                  <span key={t} className="flex items-center gap-8">
                    {t} <span className="text-[#ffe14d]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <section className="px-5 md:px-10 py-20 max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif-display text-4xl md:text-5xl text-white">Everything your workflow needs.</h2>
            <span className="hidden md:block font-mono-ui text-xs text-neutral-500">Instagram Automation</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Feature icon={<MessageCircle className="w-4 h-4" />} title="Comment → DM funnels"
              desc="Keyword or reply-all triggers on any post. Choose DM only, public reply only, or both — with your own rotating public replies." />
            <Feature icon={<Zap className="w-4 h-4" />} title="DM keyword automation"
              desc="Auto-respond to DMs with text, media, or rich cards with buttons. Quick-reply chips guide people through your funnel." />
            <Feature icon={<AtSign className="w-4 h-4" />} title="Story triggers"
              desc="React to story mentions, emoji reactions, and story replies. Filter by emoji or keyword." />
            <Feature icon={<Brain className="w-4 h-4" />} title="AI auto-reply"
              desc="Feed it your account context — niche, products, tone — and let AI handle unmatched DMs like a human." />
            <Feature icon={<Inbox className="w-4 h-4" />} title="Live inbox"
              desc="Every conversation in one dashboard. Jump in manually anytime, fire quick responses from your saved automations." />
            <Feature icon={<Lock className="w-4 h-4" />} title="Follow gate"
              desc="Lock content behind a follow. Non-followers get a follow prompt; one tap later they unlock the goods." />
            <Feature icon={<Sparkles className="w-4 h-4" />} title="Human-like sending"
              desc="Optional typing indicators and randomized delays so replies land natural, not botty." />
            <Feature icon={<Shield className="w-4 h-4" />} title="Private & secure"
              desc="Full ownership over your data and tokens. Dedicated deployment tailored to your workflow." />
            <Feature icon={<CheckCircle2 className="w-4 h-4" />} title="Analytics & logs"
              desc="Track trigger hits, response rates, and active conversations in real-time." />
          </div>
        </section>

        {/* Action strip */}
        <section className="px-5 md:px-10 pb-24 max-w-6xl mx-auto">
          <div className="border border-white/[0.08] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent">
            <div>
              <h3 className="font-serif-display text-3xl md:text-4xl mb-2 text-white">Built for professional creators.</h3>
              <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
                Seamless Instagram integration, powerful customizable triggers, and full control over your audience interaction.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-[#ffe14d] text-black font-mono-ui text-xs font-bold px-6 py-3.5 rounded-full hover:bg-white transition-all"
              >
                Connect Instagram Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-5 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono-ui text-[11px] text-neutral-500">
          Instagram Automation — Dedicated Instagram Automation Platform.
        </span>
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-[#0f0f11]/80 border border-white/[0.06] rounded-xl p-7 group hover:bg-[#151518] hover:border-white/15 transition-all">
      <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-neutral-400 group-hover:text-[#ffe14d] group-hover:border-[#ffe14d]/30 transition-colors mb-5">
        {icon}
      </div>
      <h3 className="font-mono-ui text-sm font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-neutral-400 leading-relaxed">{desc}</p>
    </div>
  )
}
