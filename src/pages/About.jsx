import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import appwriteService from "../appwrite/post";

/* ═══════════════════════════════════════════════════════════
   INJECTED CSS — animations that were missing from this page
═══════════════════════════════════════════════════════════ */
const INJECTED_CSS = `
  @keyframes aboutFadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .au1 { animation: aboutFadeUp 0.65s 0.10s cubic-bezier(0.22,1,0.36,1) both; }
  .au2 { animation: aboutFadeUp 0.65s 0.22s cubic-bezier(0.22,1,0.36,1) both; }
  .au3 { animation: aboutFadeUp 0.65s 0.34s cubic-bezier(0.22,1,0.36,1) both; }
  .au4 { animation: aboutFadeUp 0.65s 0.46s cubic-bezier(0.22,1,0.36,1) both; }

  .reveal-about {
    opacity: 0;
    transform: translateY(26px);
    transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-about.visible { opacity: 1; transform: translateY(0); }

  .reveal-about.rd1 { transition-delay: 0.05s; }
  .reveal-about.rd2 { transition-delay: 0.12s; }
  .reveal-about.rd3 { transition-delay: 0.19s; }
  .reveal-about.rd4 { transition-delay: 0.26s; }
  .reveal-about.rd5 { transition-delay: 0.33s; }
  .reveal-about.rd6 { transition-delay: 0.40s; }
  .reveal-about.rd7 { transition-delay: 0.47s; }
  .reveal-about.rd8 { transition-delay: 0.54s; }

  @media (prefers-reduced-motion: reduce) {
    .au1,.au2,.au3,.au4 { animation: none; opacity:1; }
    .reveal-about { opacity:1; transform:none; transition:none; }
  }

  @keyframes pulse-about {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,92,191,0.6); }
    50%      { box-shadow: 0 0 0 6px rgba(124,92,191,0); }
  }
  .pulse-about { animation: pulse-about 2.2s ease infinite; }

  .timeline-line {
    background: linear-gradient(to bottom, rgba(124,92,191,0.5), rgba(124,92,191,0.1), transparent);
  }
  .value-card { transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
  .value-card:hover { transform: translateY(-5px); }
`;

/* ═══════════════════════════════════════════════════════════
   EDITORIAL CONSTANTS — team, values, timeline, topics
   (Change these to customise without touching the render logic)
═══════════════════════════════════════════════════════════ */
const VALUES = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Depth Over Volume",
    desc: "We publish fewer, better articles. Every piece goes through rigorous editorial review to ensure it delivers real value — not just keyword filler.",
    color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", glow: "bg-violet-500/10", bar: "#7c5cbf",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "Practitioner-First",
    desc: "Our writers aren't commentators — they're engineers, researchers, and founders who have actually built the thing they're writing about.",
    color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", glow: "bg-blue-500/10", bar: "#3b82f6",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Open & Free",
    desc: "Knowledge should be accessible to everyone. Our core content will always be free — no paywalls for the insights that matter most.",
    color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", glow: "bg-amber-500/10", bar: "#f59e0b",
  },
  {
    icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    title: "Community Driven",
    desc: "Zorvia is shaped by its readers and writers. We listen, iterate, and build features that serve the community — not just engagement metrics.",
    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", glow: "bg-emerald-500/10", bar: "#10b981",
  },
];

const TEAM = [
  { name: "Alex Rivera",  role: "Founder & Editor-in-Chief", initial: "A", bio: "Former engineer at Google. Started Zorvia after getting tired of shallow tech content.",           handle: "@alexrivera", color: "#7c5cbf" },
  { name: "Maya Chen",    role: "Head of Content",           initial: "M", bio: "Ex-staff engineer turned editor. Obsessed with making complex ideas readable.",                  handle: "@mayachen",   color: "#3b82f6" },
  { name: "Jordan Osei",  role: "Community & Growth",        initial: "J", bio: "Grew two developer communities to 50K+ before joining Zorvia.",                                   handle: "@jordanosei", color: "#10b981" },
  { name: "Priya Das",    role: "Lead Engineer",             initial: "P", bio: "Full-stack engineer building the platform. TypeScript, Rust, and clean code advocate.",            handle: "@priyadev",   color: "#f59e0b" },
];

const TIMELINE = [
  { year: "2022", month: "January",  title: "Zorvia is Founded",         desc: "Alex Rivera publishes the first article from a kitchen table. It hits the front page of Hacker News.", icon: "✦", now: false },
  { year: "2022", month: "August",   title: "First 10,000 Readers",      desc: "Word of mouth drives the first 10K monthly readers. The waitlist for writers opens.",                   icon: "◈", now: false },
  { year: "2023", month: "March",    title: "50 Writers Onboarded",       desc: "The contributor program launches. Engineers from Apple, Meta, and top startups join the roster.",        icon: "⬡", now: false },
  { year: "2023", month: "October",  title: "100K Monthly Readers",       desc: "A viral post on AI debugging techniques pushes Zorvia past the six-figure reader milestone.",           icon: "★", now: false },
  { year: "2024", month: "June",     title: "Community Platform Launch",  desc: "Readers can now follow writers, save posts, and join topic-based discussions.",                         icon: "◎", now: false },
  { year: "2026", month: "Now",      title: "Still Just Getting Started", desc: "120K+ readers, growing contributors, and a belief that the best technical writing is still ahead.",    icon: "→", now: true  },
];

const TOPICS = [
  { label: "AI & ML",       color: "from-violet-900/50  to-violet-800/20",  border: "border-violet-500/20",  path: "AI & ML"       },
  { label: "Programming",   color: "from-blue-900/50    to-blue-800/20",    border: "border-blue-500/20",    path: "Programming"   },
  { label: "Data Science",  color: "from-cyan-900/50    to-cyan-800/20",    border: "border-cyan-500/20",    path: "Data Science"  },
  { label: "Web Dev",       color: "from-emerald-900/50 to-emerald-800/20", border: "border-emerald-500/20", path: "Web Dev"       },
  { label: "Cybersecurity", color: "from-red-900/50     to-red-800/20",     border: "border-red-500/20",     path: "Cybersecurity" },
  { label: "Career",        color: "from-amber-900/50   to-amber-800/20",   border: "border-amber-500/20",   path: "Career"        },
  { label: "Science",       color: "from-pink-900/50    to-pink-800/20",    border: "border-pink-500/20",    path: "Science"       },
  { label: "Open Source",   color: "from-teal-900/50    to-teal-800/20",    border: "border-teal-500/20",    path: ""              },
];

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".reveal-about");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ═══════════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════════ */
export default function About() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, writers: 0, categories: 0, tags: 0 });
  const [loading, setLoading] = useState(true);

  /* ── Inject CSS once ── */
  useEffect(() => {
    const id = "zorvia-about-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style"); s.id = id; s.textContent = INJECTED_CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* ── Fetch live stats from Appwrite ── */
  useEffect(() => {
    appwriteService
      .getAllPosts([Query.equal("status", "Active"), Query.orderDesc("$createdAt"), Query.limit(100)])
      .then((res) => {
        if (!res?.documents) return;
        const docs = res.documents;
        const writers    = new Set(docs.map((p) => p.userId).filter(Boolean)).size;
        const categories = new Set(docs.map((p) => p.category).filter(Boolean)).size;
        const tags       = new Set(docs.flatMap((p) => p.tags || [])).size;
        setStats({ posts: docs.length, writers, categories, tags });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Reveal refs for each section ── */
  const statsRef     = useReveal([loading]);
  const missionRef   = useReveal([]);
  const valuesRef    = useReveal([]);
  const timelineRef  = useReveal([]);
  const teamRef      = useReveal([]);
  const topicsRef    = useReveal([]);

  /* ── Dynamic stats array ── */
  const STATS = [
    { value: loading ? "—" : `${stats.posts}+`,      label: "Articles Published",  icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
    { value: loading ? "—" : `${stats.writers}+`,    label: "Contributors",         icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" },
    { value: loading ? "—" : `${stats.categories}`,  label: "Topic Categories",     icon: "M4 6h16M4 12h16M4 18h7" },
    { value: loading ? "—" : `${stats.tags}+`,       label: "Tags Covered",         icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
  ];

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">

      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-24 px-8">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#7c5cbf]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3d2080]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1a0f40]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="au1 inline-flex items-center gap-2 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cbf] pulse-about" />
              <span className="text-[#c4a8f0] text-xs font-semibold tracking-[0.15em]">OUR STORY</span>
            </div>

            <h1 className="au2 text-white font-extrabold tracking-tight leading-[1.05] mb-6"
              style={{ fontSize: "clamp(36px,5.5vw,68px)" }}>
              Built by engineers,
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#c4a8f0 0%,#7c5cbf 50%,#a78de0 100%)" }}>
                for engineers.
              </span>
            </h1>

            <p className="au3 text-white/50 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Zorvia started with a simple frustration: most tech content online is either too shallow to be useful
              or buried behind jargon. We set out to fix that.
            </p>

            <div className="au4 flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => navigate("/all-posts")}
                className="flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(124,92,191,0.45)] transition-all duration-200">
                Read our work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button onClick={() => navigate("/writers")}
                className="flex items-center gap-2 bg-white/[0.06] border border-white/15 text-white/80 font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/[0.1] hover:border-white/25 transition-all duration-200">
                Meet the writers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE STATS BAR ══════════════════════════════════════════════════ */}
      <div ref={statsRef} className="border-y border-white/[0.06] bg-[#0b0b18]">
        <div className="max-w-[1200px] mx-auto px-8 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {STATS.map((s, i) => (
            <div key={s.label} className={`reveal-about rd${i + 1} text-center px-6 py-3`}>
              <div className="flex items-center justify-center mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c5cbf" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              {loading ? (
                <><div className="h-7 w-16 mx-auto bg-white/[0.06] rounded mb-1" /><div className="h-3 w-24 mx-auto bg-white/[0.04] rounded" /></>
              ) : (
                <><p className="text-white text-2xl font-extrabold tracking-tight">{s.value}</p><p className="text-white/35 text-xs mt-0.5">{s.label}</p></>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MISSION ═════════════════════════════════════════════════════════ */}
      <section ref={missionRef} className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: decorative stat collage */}
          <div className="reveal-about rd1 relative h-[420px] hidden lg:block">
            {/* Big number */}
            <div className="absolute top-0 left-0 w-[68%] h-[75%] rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#1a1035] to-[#0b0b18] flex flex-col items-center justify-center">
              <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: "radial-gradient(circle,rgba(124,92,191,1) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
              <p className="text-white font-extrabold relative z-10" style={{ fontSize: 96, lineHeight: 1, letterSpacing: "-0.04em" }}>
                {loading ? "—" : stats.posts}
              </p>
              <p className="text-white/30 text-sm font-semibold tracking-widest uppercase mt-2 relative z-10">Articles & counting</p>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0e0e1c] to-transparent" />
            </div>
            {/* Contributors tile */}
            <div className="absolute bottom-0 right-0 w-[55%] h-[60%] rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#1e1038] to-[#0e0e1c] flex flex-col items-center justify-center gap-1">
              <div className="flex -space-x-3 mb-3">
                {["A","M","J","P","R"].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0e0e1c] flex items-center justify-center text-xs font-black"
                    style={{ background: ["#7c5cbf","#3b82f6","#10b981","#f59e0b","#ef4444"][i], color: "#fff" }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-white font-extrabold text-3xl tracking-tight">{loading ? "—" : `${stats.writers}+`}</p>
              <p className="text-white/30 text-xs tracking-wider uppercase">Contributors</p>
            </div>
            {/* Floating pill */}
            <div className="absolute bottom-[55%] left-[55%] -translate-x-1/2 bg-[#16162a] border border-[#7c5cbf]/35 rounded-2xl px-5 py-3.5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm z-10">
              <p className="text-white text-xl font-extrabold">Since 2022</p>
              <p className="text-white/40 text-xs">Independent &amp; reader-funded</p>
            </div>
          </div>

          {/* Right: text */}
          <div className="reveal-about rd2">
            <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-4">Our Mission</p>
            <h2 className="text-white text-3xl font-extrabold leading-tight tracking-tight mb-6">
              Raise the bar for technical writing on the internet.
            </h2>
            <div className="space-y-5 text-white/50 text-[15px] leading-relaxed">
              <p>When we started Zorvia, the problem wasn't a shortage of tech content — it was a shortage of{" "}
                <span className="text-white/80 font-medium">good</span> tech content. SEO-driven fluff, LLM-generated noise,
                and shallow tutorials that leave you more confused than when you started.</p>
              <p>We believe the best technical writing comes from people who have{" "}
                <span className="text-white/80 font-medium">actually built things</span> — who hit the wall at 2am debugging
                a race condition, shipped a feature that failed spectacularly, and learned something real in the process.</p>
              <p>Every article on Zorvia is written, reviewed, and refined by practitioners. Not content farms.
                Not AI-generated summaries.{" "}<span className="text-white/80 font-medium">Real people, real experience.</span></p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-white/20 text-xs">Founded in Bengaluru, built for the world</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES ══════════════════════════════════════════════════════════ */}
      <section ref={valuesRef} className="bg-[#0b0b18] border-y border-white/[0.05] py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="reveal-about rd1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">What We Stand For</p>
            <h2 className="reveal-about rd2 text-white text-3xl font-extrabold tracking-tight">Our editorial values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div key={v.title}
                className={`reveal-about rd${i + 1} value-card group relative overflow-hidden bg-[#16162a] border rounded-2xl p-6 ${v.bg}`}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px ${v.bar}33`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)"}
              >
                <div className={`absolute -top-8 -right-8 w-24 h-24 ${v.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${v.bg}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={v.color}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-white text-[15px] font-bold mb-2.5">{v.title}</h3>
                <p className="text-white/40 text-[13px] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ════════════════════════════════════════════════════════ */}
      <section ref={timelineRef} className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="reveal-about rd1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">The Journey</p>
          <h2 className="reveal-about rd2 text-white text-3xl font-extrabold tracking-tight">How we got here</h2>
        </div>

        {/* ── Desktop: 3-col grid (left card | dot column | right card)
               The center column is exactly 56px — the dot's width.
               A pseudo-line runs through it via a border on the dot wrapper.
            ── Mobile: simple left-icon + card rows                       */}
        <div className="max-w-3xl mx-auto">

          {/* Vertical line visible only on md+ — sits behind the grid */}
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-7 bottom-7 w-px timeline-line pointer-events-none z-0" />

            <div className="space-y-6">
              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                const cardEl = (
                  <div className={`bg-[#16162a] border rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] ${
                    item.now ? "border-[#7c5cbf]/45 shadow-[0_0_0_1px_rgba(124,92,191,0.15)]" : "border-white/[0.08]"
                  }`}>
                    <p className={`text-[11px] font-bold tracking-wide mb-1 ${item.now ? "text-[#c4a8f0]" : "text-white/30"}`}>
                      {item.month} · {item.year}
                    </p>
                    <h3 className="text-white text-[14px] font-bold leading-snug mb-1.5">{item.title}</h3>
                    <p className="text-white/40 text-[12.5px] leading-relaxed">{item.desc}</p>
                  </div>
                );

                const dotEl = (
                  <div className="flex flex-col items-center justify-start pt-3 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-black border-2 flex-shrink-0 ${
                      item.now
                        ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_0_24px_rgba(124,92,191,0.6)]"
                        : "bg-[#16162a] border-[#7c5cbf]/35 text-[#7c5cbf]"
                    }`}>
                      {item.icon}
                    </div>
                  </div>
                );

                return (
                  <div key={i} className={`reveal-about rd${Math.min(i + 1, 8)}`}>

                    {/* ── Desktop 3-col grid ── */}
                    <div className="hidden md:grid grid-cols-[1fr_56px_1fr] items-start gap-0">
                      {/* Left slot */}
                      <div className="pr-6 flex justify-end">
                        {isLeft ? cardEl : <div />}
                      </div>

                      {/* Center dot */}
                      {dotEl}

                      {/* Right slot */}
                      <div className="pl-6 flex justify-start">
                        {!isLeft ? cardEl : <div />}
                      </div>
                    </div>

                    {/* ── Mobile: icon + card side by side ── */}
                    <div className="md:hidden flex items-start gap-4">
                      <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-black border-2 mt-0.5 ${
                        item.now ? "bg-[#7c5cbf] border-[#7c5cbf] text-white" : "bg-[#16162a] border-[#7c5cbf]/30 text-[#7c5cbf]"
                      }`}>{item.icon}</div>
                      <div className={`flex-1 bg-[#16162a] border rounded-2xl px-4 py-3.5 ${item.now ? "border-[#7c5cbf]/40" : "border-white/[0.07]"}`}>
                        <p className={`text-[11px] font-bold mb-0.5 ${item.now ? "text-[#c4a8f0]" : "text-white/35"}`}>{item.month} · {item.year}</p>
                        <h3 className="text-white text-[14px] font-bold mb-1">{item.title}</h3>
                        <p className="text-white/40 text-[12.5px] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM ════════════════════════════════════════════════════════════ */}
      <section ref={teamRef} className="bg-[#0b0b18] border-y border-white/[0.05] py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="reveal-about rd1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">The People</p>
            <h2 className="reveal-about rd2 text-white text-3xl font-extrabold tracking-tight">Who runs Zorvia</h2>
            <p className="reveal-about rd3 text-white/40 text-sm mt-3 leading-relaxed">A small, opinionated team that cares deeply about writing, engineering, and making the internet more useful.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={member.name}
                className={`reveal-about rd${i + 1} group bg-[#16162a] border border-white/[0.07] rounded-2xl p-6 text-center transition-all duration-300 cursor-default`}
                style={{ transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px ${member.color}44`; e.currentTarget.style.borderColor = member.color + "44"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = ""; }}
              >
                {/* Monogram avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black transition-all duration-300 group-hover:scale-105"
                    style={{ fontFamily: "Georgia,serif", background: `linear-gradient(135deg,${member.color}35,${member.color}12)`, border: `2px solid ${member.color}45`, color: member.color }}>
                    {member.initial}
                  </div>
                  <div className="absolute inset-0 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 50% 0%,${member.color}22,transparent 70%)` }} />
                </div>

                <h3 className="text-white text-[15px] font-bold mb-0.5">{member.name}</h3>
                <p className="text-[11px] font-semibold mb-3" style={{ color: member.color }}>{member.role}</p>
                <p className="text-white/40 text-[12.5px] leading-relaxed mb-4">{member.bio}</p>
                <span className="inline-block text-white/30 text-xs bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1 font-mono">
                  {member.handle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOPICS ══════════════════════════════════════════════════════════ */}
      <section ref={topicsRef} className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="reveal-about rd1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">The Content</p>
          <h2 className="reveal-about rd2 text-white text-3xl font-extrabold tracking-tight">What we write about</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOPICS.map((t, i) => (
            <button key={t.label} onClick={() => navigate("/all-posts")}
              className={`reveal-about rd${i + 1} group relative overflow-hidden bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-5 text-left hover:border-opacity-60 hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
              <p className="text-white font-semibold text-sm mb-1">{t.label}</p>
              <p className="text-white/35 text-xs group-hover:text-white/55 transition-colors">Explore →</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ NEWSLETTER CTA ══════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f35] via-[#16133a] to-[#0d1028]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c5cbf]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3d2080]/25 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle,rgba(124,92,191,1) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 px-10 py-16 md:px-20 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 bg-[#7c5cbf]/25 border border-[#7c5cbf]/35 rounded-full px-4 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 bg-[#c4a8f0] rounded-full pulse-about" />
                <span className="text-[#c4a8f0] text-xs font-semibold tracking-wider">STAY IN THE LOOP</span>
              </div>
              <h2 className="text-white font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(24px,3vw,38px)" }}>
                The best tech writing,<br />delivered weekly.
              </h2>
              <p className="text-white/45 text-sm leading-relaxed">
                No algorithm. No noise. Just the most thoughtful articles from Zorvia, curated by our editors every Friday.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[320px] flex flex-col gap-3">
              <input type="email" placeholder="your@email.com"
                className="w-full bg-white/[0.08] border border-white/15 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#7c5cbf] transition-colors" />
              <button className="w-full bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm rounded-2xl py-4 hover:shadow-[0_10px_36px_rgba(124,92,191,0.5)] hover:-translate-y-0.5 transition-all duration-200">
                Subscribe Free →
              </button>
              <p className="text-center text-white/25 text-xs">No spam, ever.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#080812] border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#7c5cbf] pulse-about" />
              <span className="text-white font-extrabold text-lg tracking-widest">ZORVIA</span>
            </div>
            <div className="flex gap-6">
              {[["Home","/"],["All Posts","/all-posts"],["Writers","/writers"],["About","/about"]].map(([l, p]) => (
                <button key={l} onClick={() => navigate(p)} className="text-white/30 text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer">{l}</button>
              ))}
            </div>
            <p className="text-white/20 text-xs">© 2026 Zorvia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}