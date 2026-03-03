/* ─── Data ───────────────────────────────────────────────────────────────── */
const STATS = [
  {
    value: "120K+",
    label: "Monthly Readers",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    value: "1,400+",
    label: "Articles Published",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  },
  {
    value: "340+",
    label: "Expert Contributors",
    icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  },
  { value: "48", label: "Topic Categories", icon: "M4 6h16M4 12h16M4 18h7" },
];

const VALUES = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Depth Over Volume",
    desc: "We publish fewer, better articles. Every piece goes through rigorous editorial review to ensure it delivers real value — not just keyword filler.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    glow: "bg-violet-500/10",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "Practitioner-First",
    desc: "Our writers aren't commentators — they're engineers, researchers, and founders. Every article comes from someone who has actually built the thing they're writing about.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    glow: "bg-blue-500/10",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Open & Free",
    desc: "Knowledge should be accessible to everyone. Our core content will always be free — no paywalls for the insights that matter most.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "bg-amber-500/10",
  },
  {
    icon: "M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    title: "Community Driven",
    desc: "The Quill is shaped by its readers and writers. We listen, iterate, and build features that serve the community — not just engagement metrics.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-500/10",
  },
];

const TEAM = [
  {
    name: "Alex Rivera",
    role: "Founder & Editor-in-Chief",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    bio: "Former engineer at Google. Started The Quill after getting tired of shallow tech content.",
    x: "@alexrivera",
    links: ["twitter", "linkedin"],
  },
  {
    name: "Maya Chen",
    role: "Head of Content",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    bio: "Ex-staff engineer turned editor. Obsessed with making complex ideas readable.",
    x: "@mayachen",
    links: ["twitter", "linkedin"],
  },
  {
    name: "Jordan Osei",
    role: "Community & Growth",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    bio: "Grew two developer communities to 50K+ before joining The Quill.",
    x: "@jordanosei",
    links: ["twitter", "linkedin"],
  },
  {
    name: "Priya Das",
    role: "Lead Engineer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    bio: "Full-stack engineer building the platform. TypeScript, Rust, and clean code advocate.",
    x: "@priyadev",
    links: ["github", "linkedin"],
  },
];

const TIMELINE = [
  {
    year: "2022",
    month: "January",
    title: "The Quill is Founded",
    desc: "Alex Rivera publishes the first article from a kitchen table. It hits the front page of Hacker News.",
    icon: "✦",
  },
  {
    year: "2022",
    month: "August",
    title: "First 10,000 Readers",
    desc: "Word of mouth drives the first 10K monthly readers. The waitlist for writers opens.",
    icon: "◈",
  },
  {
    year: "2023",
    month: "March",
    title: "50 Writers Onboarded",
    desc: "The contributor program launches. Engineers from Apple, Meta, and top startups join the roster.",
    icon: "⬡",
  },
  {
    year: "2023",
    month: "October",
    title: "100K Monthly Readers",
    desc: "A viral post on AI debugging techniques pushes The Quill past the six-figure reader milestone.",
    icon: "★",
  },
  {
    year: "2024",
    month: "June",
    title: "Community Platform Launch",
    desc: "Readers can now follow writers, save posts, and join topic-based discussions.",
    icon: "◎",
  },
  {
    year: "2026",
    month: "Now",
    title: "Still Just Getting Started",
    desc: "120K readers, 340+ writers, and a belief that the best technical writing is still ahead.",
    icon: "→",
    now: true,
  },
];

const TOPICS = [
  {
    label: "AI & ML",
    color: "from-violet-900/50  to-violet-800/20",
    border: "border-violet-500/20",
  },
  {
    label: "Programming",
    color: "from-blue-900/50    to-blue-800/20",
    border: "border-blue-500/20",
  },
  {
    label: "Data Science",
    color: "from-cyan-900/50    to-cyan-800/20",
    border: "border-cyan-500/20",
  },
  {
    label: "Web Dev",
    color: "from-emerald-900/50 to-emerald-800/20",
    border: "border-emerald-500/20",
  },
  {
    label: "Cybersecurity",
    color: "from-red-900/50     to-red-800/20",
    border: "border-red-500/20",
  },
  {
    label: "Career",
    color: "from-amber-900/50   to-amber-800/20",
    border: "border-amber-500/20",
  },
  {
    label: "Science",
    color: "from-pink-900/50    to-pink-800/20",
    border: "border-pink-500/20",
  },
  {
    label: "Open Source",
    color: "from-teal-900/50    to-teal-800/20",
    border: "border-teal-500/20",
  },
];

/* ─── About Page ─────────────────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-32 pb-24 px-8">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#7c5cbf]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3d2080]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1a0f40]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="au1 inline-flex items-center gap-2 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cbf] pulse-dot" />
              <span className="text-[#c4a8f0] text-xs font-semibold tracking-[0.15em]">
                OUR STORY
              </span>
            </div>

            <h1
              className="au2 text-white font-extrabold tracking-tight leading-[1.05] mb-6"
              style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }}
            >
              Built by engineers,
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #c4a8f0 0%, #7c5cbf 50%, #a78de0 100%)",
                }}
              >
                for engineers.
              </span>
            </h1>

            <p className="au3 text-white/50 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              The Quill started with a simple frustration: most tech content
              online is either too shallow to be useful or buried behind jargon
              that makes it inaccessible. We set out to fix that.
            </p>

            <div className="au4 flex items-center justify-center gap-4 flex-wrap">
              <a
                href="/all-posts"
                className="flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(124,92,191,0.45)] transition-all duration-200 no-underline"
              >
                Read our work
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/writers"
                className="flex items-center gap-2 bg-white/[0.06] border border-white/15 text-white/80 font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/[0.1] hover:border-white/25 transition-all duration-200 no-underline"
              >
                Meet the writers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <div className="border-y border-white/[0.06] bg-[#0b0b18]">
        <div className="max-w-[1200px] mx-auto px-8 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center px-6 py-3 card-r${i + 1}`}
            >
              <div className="flex items-center justify-center mb-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c5cbf"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={s.icon}
                  />
                </svg>
              </div>
              <p className="text-white text-2xl font-extrabold tracking-tight">
                {s.value}
              </p>
              <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MISSION SPLIT SECTION
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image collage */}
          <div className="au1 relative h-[420px] hidden lg:block">
            {/* Main image */}
            <div className="absolute top-0 left-0 w-[68%] h-[75%] rounded-2xl overflow-hidden border border-white/[0.08]">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=700&q=80"
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c5cbf]/20 to-transparent" />
            </div>
            {/* Accent image */}
            <div className="absolute bottom-0 right-0 w-[55%] h-[60%] rounded-2xl overflow-hidden border border-white/[0.08]">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-[#7c5cbf]/20 to-transparent" />
            </div>
            {/* Floating stat pill */}
            <div className="absolute bottom-[55%] left-[55%] transform -translate-x-1/2 bg-[#16162a] border border-[#7c5cbf]/35 rounded-2xl px-5 py-3.5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm z-10">
              <p className="text-white text-xl font-extrabold">Since 2022</p>
              <p className="text-white/40 text-xs">
                Independent & proudly funded
                <br />
                by our readers
              </p>
            </div>
          </div>

          {/* Right: text */}
          <div className="au2">
            <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Our Mission
            </p>
            <h2 className="text-white text-3xl font-extrabold leading-tight tracking-tight mb-6">
              Raise the bar for technical writing on the internet.
            </h2>

            <div className="space-y-5 text-white/50 text-[15px] leading-relaxed">
              <p>
                When we started The Quill, the problem wasn't a shortage of tech
                content — it was a shortage of{" "}
                <span className="text-white/80 font-medium">good</span> tech
                content. SEO-driven fluff, LLM-generated noise, and shallow
                tutorials that leave you more confused than when you started.
              </p>
              <p>
                We believe the best technical writing comes from people who have{" "}
                <span className="text-white/80 font-medium">
                  actually built things
                </span>{" "}
                — who have hit the wall at 2am debugging a race condition,
                shipped a feature that failed spectacularly, and learned
                something real in the process.
              </p>
              <p>
                Every article on The Quill is written, reviewed, and refined by
                practitioners. Not content farms. Not AI-generated summaries.{" "}
                <span className="text-white/80 font-medium">
                  Real people, real experience.
                </span>
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-white/20 text-xs">
                Founded in Bengaluru, built for the world
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUES
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0b0b18] border-y border-white/[0.05] py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="au1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="au2 text-white text-3xl font-extrabold tracking-tight">
              Our editorial values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className={`group relative overflow-hidden bg-[#16162a] border rounded-2xl p-6 hover:border-opacity-60 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all duration-300 card-r${i + 1} ${v.bg}`}
              >
                {/* Hover glow */}
                <div
                  className={`absolute -top-8 -right-8 w-24 h-24 ${v.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${v.bg}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={v.color}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={v.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-white text-[15px] font-bold mb-2.5">
                  {v.title}
                </h3>
                <p className="text-white/40 text-[13px] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TIMELINE
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="au1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            The Journey
          </p>
          <h2 className="au2 text-white text-3xl font-extrabold tracking-tight">
            How we got here
          </h2>
        </div>

        {/* Timeline — vertical center line on desktop */}
        <div className="relative max-w-3xl mx-auto">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7c5cbf]/40 via-[#7c5cbf]/20 to-transparent -translate-x-1/2" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-center gap-8 md:gap-0 card-r${Math.min(i + 1, 9)}`}
                >
                  {/* Left content (desktop) */}
                  <div
                    className={`hidden md:block w-[calc(50%-28px)] ${isLeft ? "text-right pr-8" : "order-last pl-8"}`}
                  >
                    {isLeft && (
                      <div
                        className={`inline-block bg-[#16162a] border rounded-2xl px-5 py-4 text-left ${item.now ? "border-[#7c5cbf]/40" : "border-white/[0.07]"}`}
                      >
                        <p
                          className={`text-xs font-bold mb-0.5 ${item.now ? "text-[#c4a8f0]" : "text-white/35"}`}
                        >
                          {item.month} {item.year}
                        </p>
                        <h3 className="text-white text-[15px] font-bold mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-white/40 text-[13px] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div
                    className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl items-center justify-center text-lg font-black border-2 z-10 transition-all duration-200 ${
                      item.now
                        ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_0_24px_rgba(124,92,191,0.5)]"
                        : "bg-[#16162a] border-[#7c5cbf]/30 text-[#7c5cbf]"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Right content (desktop) */}
                  <div
                    className={`hidden md:block w-[calc(50%-28px)] ${!isLeft ? "pl-8" : "order-last pr-8 text-right"}`}
                  >
                    {!isLeft && (
                      <div
                        className={`inline-block bg-[#16162a] border rounded-2xl px-5 py-4 text-left ${item.now ? "border-[#7c5cbf]/40" : "border-white/[0.07]"}`}
                      >
                        <p
                          className={`text-xs font-bold mb-0.5 ${item.now ? "text-[#c4a8f0]" : "text-white/35"}`}
                        >
                          {item.month} {item.year}
                        </p>
                        <h3 className="text-white text-[15px] font-bold mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-white/40 text-[13px] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mobile layout */}
                  <div className={`md:hidden flex items-start gap-4 w-full`}>
                    <div
                      className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center text-base font-black border-2 ${
                        item.now
                          ? "bg-[#7c5cbf] border-[#7c5cbf] text-white"
                          : "bg-[#16162a] border-[#7c5cbf]/30 text-[#7c5cbf]"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div
                      className={`flex-1 bg-[#16162a] border rounded-2xl px-4 py-3.5 ${item.now ? "border-[#7c5cbf]/40" : "border-white/[0.07]"}`}
                    >
                      <p
                        className={`text-xs font-bold mb-0.5 ${item.now ? "text-[#c4a8f0]" : "text-white/35"}`}
                      >
                        {item.month} {item.year}
                      </p>
                      <h3 className="text-white text-[14px] font-bold mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/40 text-[12.5px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0b0b18] border-y border-white/[0.05] py-24 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="au1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              The People
            </p>
            <h2 className="au2 text-white text-3xl font-extrabold tracking-tight">
              Who runs The Quill
            </h2>
            <p className="au3 text-white/40 text-sm mt-3 leading-relaxed">
              A small, opinionated team that cares deeply about writing,
              engineering, and making the internet a little more useful.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className={`group bg-[#16162a] border border-white/[0.07] rounded-2xl p-6 text-center hover:border-[#7c5cbf]/35 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 card-r${i + 1}`}
              >
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7c5cbf]/30 mx-auto"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c5cbf]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-white text-[15px] font-bold mb-0.5">
                  {member.name}
                </h3>
                <p className="text-[#c4a8f0] text-xs font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-white/40 text-[12.5px] leading-relaxed mb-4">
                  {member.bio}
                </p>

                {/* Handle */}
                <span className="inline-block text-white/30 text-xs bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1 font-medium">
                  {member.x}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TOPICS WE COVER
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="au1 text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            The Content
          </p>
          <h2 className="au2 text-white text-3xl font-extrabold tracking-tight">
            What we write about
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOPICS.map((t, i) => (
            <a
              key={t.label}
              href="/all-posts"
              className={`card-r${i + 1} group relative overflow-hidden bg-gradient-to-br ${t.color} border ${t.border} rounded-2xl p-5 no-underline hover:border-opacity-60 hover:-translate-y-0.5 transition-all duration-200`}
            >
              <p className="text-white font-semibold text-sm mb-1">{t.label}</p>
              <p className="text-white/35 text-xs">Explore →</p>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER CTA
      ═══════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=70"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#1a0f35] via-[#16133a] to-[#0d1028]"
            style={{ opacity: 0.93 }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c5cbf]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3d2080]/25 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 px-10 py-16 md:px-20 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 bg-[#7c5cbf]/25 border border-[#7c5cbf]/35 rounded-full px-4 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 bg-[#c4a8f0] rounded-full pulse-dot" />
                <span className="text-[#c4a8f0] text-xs font-semibold tracking-wider">
                  STAY IN THE LOOP
                </span>
              </div>
              <h2
                className="text-white font-extrabold leading-tight mb-4"
                style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
              >
                The best tech writing,
                <br />
                delivered weekly.
              </h2>
              <p className="text-white/45 text-sm leading-relaxed">
                No algorithm. No noise. Just the most thoughtful articles from
                The Quill, curated by our editors every Friday morning.
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[320px] flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/[0.08] border border-white/15 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#7c5cbf] transition-colors"
              />
              <button className="w-full bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm rounded-2xl py-4 hover:shadow-[0_10px_36px_rgba(124,92,191,0.5)] hover:-translate-y-0.5 transition-all duration-200">
                Subscribe Free →
              </button>
              <p className="text-center text-white/25 text-xs">
                Join 120,000+ readers. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#080812] border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-8 py-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#7c5cbf] pulse-dot" />
              <span className="text-white font-extrabold text-lg tracking-widest">
                THE QUILL
              </span>
            </div>
            <div className="flex gap-6">
              {["Home", "All Posts", "Writers", "About"].map((l) => (
                <a
                  key={l}
                  href={
                    l === "Home" ? "/" : `/${l.toLowerCase().replace(" ", "-")}`
                  }
                  className="text-white/30 text-sm no-underline hover:text-white transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
            <p className="text-white/20 text-xs">
              © 2026 The Quill. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
