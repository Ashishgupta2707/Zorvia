import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const WRITERS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    handle: "@sarahmitchell",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=60",
    specialty: "AI & ML",
    bio: "Machine learning researcher turned writer. I break down complex AI papers into actionable insights for developers.",
    posts: 42,
    followers: "18.2k",
    following: 134,
    joined: "Jan 2024",
    tags: ["LLMs", "PyTorch", "MLOps"],
    featured: true,
  },
  {
    id: 2,
    name: "Daniel Okafor",
    handle: "@danokafor",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=60",
    specialty: "Programming",
    bio: "Systems programmer obsessed with performance. Writing about Rust, C++, and the art of writing code that actually runs fast.",
    posts: 67,
    followers: "12.9k",
    following: 89,
    joined: "Mar 2023",
    tags: ["Rust", "C++", "Systems"],
    featured: true,
  },
  {
    id: 3,
    name: "Elena Kovacs",
    handle: "@elenakovacs",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=60",
    specialty: "Cybersecurity",
    bio: "Red team engineer. I write about real-world threat landscapes, penetration testing, and building systems adversaries can't break.",
    posts: 38,
    followers: "9.4k",
    following: 201,
    joined: "Jun 2023",
    tags: ["Pentesting", "Zero Trust", "CTF"],
    featured: false,
  },
  {
    id: 4,
    name: "Rahul Sharma",
    handle: "@rahulsharma",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=60",
    specialty: "Data Science",
    bio: "Data scientist at a fintech unicorn. I demystify feature engineering, model evaluation and the gap between Kaggle and production.",
    posts: 55,
    followers: "14.1k",
    following: 167,
    joined: "Nov 2022",
    tags: ["Python", "Pandas", "XGBoost"],
    featured: true,
  },
  {
    id: 5,
    name: "Aisha Patel",
    handle: "@aishapatel",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1587620962725-abab19836100?w=600&q=60",
    specialty: "Web Dev",
    bio: "Frontend engineer at a Series B startup. Writing about React, performance, and the craft of building things people love to use.",
    posts: 81,
    followers: "21.7k",
    following: 312,
    joined: "Aug 2022",
    tags: ["React", "TypeScript", "CSS"],
    featured: true,
  },
  {
    id: 6,
    name: "Chris Nakamura",
    handle: "@chrisnakamura",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=60",
    specialty: "AI & ML",
    bio: "Building RAG pipelines and vector search at scale. I write about the practical side of deploying AI in production.",
    posts: 29,
    followers: "7.8k",
    following: 95,
    joined: "Apr 2024",
    tags: ["RAG", "Embeddings", "LangChain"],
    featured: false,
  },
  {
    id: 7,
    name: "Laura Brennan",
    handle: "@laurabrennan",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&q=60",
    specialty: "Career",
    bio: "Engineering manager who's hired 200+ engineers. Honest takes on career growth, technical interviews, and leadership in tech.",
    posts: 44,
    followers: "31.5k",
    following: 78,
    joined: "May 2022",
    tags: ["Hiring", "Leadership", "Growth"],
    featured: false,
  },
  {
    id: 8,
    name: "Tom Eriksson",
    handle: "@tomeriksson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=600&q=60",
    specialty: "Programming",
    bio: "20 years shipping software. Writing about clean architecture, refactoring legacy code, and the philosophy of engineering craft.",
    posts: 96,
    followers: "16.3k",
    following: 241,
    joined: "Jan 2022",
    tags: ["Architecture", "Refactoring", "DDD"],
    featured: false,
  },
  {
    id: 9,
    name: "Nina Johansson",
    handle: "@ninajohansson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    cover:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=60",
    specialty: "Science",
    bio: "Quantum physicist making sense of where quantum computing is real and where the hype ends. PhD, MIT.",
    posts: 23,
    followers: "5.6k",
    following: 44,
    joined: "Sep 2024",
    tags: ["Quantum", "Physics", "Research"],
    featured: false,
  },
];

const SPECIALTIES = [
  "All",
  "AI & ML",
  "Programming",
  "Data Science",
  "Web Dev",
  "Cybersecurity",
  "Career",
  "Science",
];

const SPECIALTY_COLORS = {
  "AI & ML": "text-violet-400  bg-violet-500/15  border-violet-500/25",
  Programming: "text-blue-400    bg-blue-500/15    border-blue-500/25",
  "Data Science": "text-cyan-400    bg-cyan-500/15    border-cyan-500/25",
  "Web Dev": "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  Cybersecurity: "text-red-400     bg-red-500/15     border-red-500/25",
  Career: "text-amber-400   bg-amber-500/15   border-amber-500/25",
  Science: "text-pink-400    bg-pink-500/15    border-pink-500/25",
};

/* ─── Writer Card ────────────────────────────────────────────────────────── */
function WriterCard({ writer, index }) {
  const [followed, setFollowed] = useState(false);

  return (
    <div
      className={`group bg-[#16162a] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#7c5cbf]/35 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 card-r${Math.min(index + 1, 9)}`}
    >
      {/* Cover strip */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={writer.cover}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#16162a]" />
        {writer.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#7c5cbf]/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            FEATURED
          </div>
        )}
      </div>

      {/* Avatar — overlapping cover */}
      <div className="px-5 -mt-8 mb-3 flex items-end justify-between">
        <img
          src={writer.avatar}
          alt={writer.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16162a] ring-2 ring-[#7c5cbf]/40"
        />
        <button
          onClick={() => setFollowed((f) => !f)}
          className={`mb-1 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
            followed
              ? "bg-[#7c5cbf]/20 border-[#7c5cbf]/40 text-[#c4a8f0]"
              : "bg-[#7c5cbf] border-[#7c5cbf] text-white hover:bg-[#6a4caa] hover:shadow-[0_4px_16px_rgba(124,92,191,0.4)]"
          }`}
        >
          {followed ? "Following ✓" : "Follow"}
        </button>
      </div>

      {/* Info */}
      <div className="px-5 pb-5">
        <h3 className="text-white text-[15px] font-bold leading-tight mb-0.5">
          {writer.name}
        </h3>
        <p className="text-white/35 text-xs mb-2">{writer.handle}</p>

        {/* Specialty badge */}
        <span
          className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border mb-3 ${SPECIALTY_COLORS[writer.specialty] || "text-white/50 bg-white/5 border-white/10"}`}
        >
          {writer.specialty}
        </span>

        <p className="text-white/45 text-[12.5px] leading-relaxed mb-4 line-clamp-2">
          {writer.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {writer.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] text-white/35 bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-0.5 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-0 border-t border-white/[0.07] pt-4">
          {[
            { label: "Posts", value: writer.posts },
            { label: "Followers", value: writer.followers },
            { label: "Following", value: writer.following },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 text-center ${i > 0 ? "border-l border-white/[0.07]" : ""}`}
            >
              <p className="text-white text-sm font-bold">{s.value}</p>
              <p className="text-white/30 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Writers Page ───────────────────────────────────────────────────────── */
export default function Writers() {
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("followers");

  const filtered = WRITERS.filter(
    (w) => activeSpecialty === "All" || w.specialty === activeSpecialty,
  )
    .filter(
      (w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.bio.toLowerCase().includes(search.toLowerCase()) ||
        w.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "followers")
        return parseFloat(b.followers) - parseFloat(a.followers);
      if (sortBy === "posts") return b.posts - a.posts;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });

  const featured = WRITERS.filter((w) => w.featured);

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden pt-28 pb-16 px-8">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7c5cbf]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="au1 inline-flex items-center gap-2 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cbf] pulse-dot" />
            <span className="text-[#c4a8f0] text-xs font-semibold tracking-wider">
              {WRITERS.length} CONTRIBUTORS
            </span>
          </div>
          <h1
            className="au2 text-white font-extrabold tracking-tight mb-4"
            style={{ fontSize: "clamp(32px,5vw,56px)" }}
          >
            Meet the Writers
          </h1>
          <p className="au3 text-white/45 text-base max-w-xl mx-auto leading-relaxed mb-10">
            Practitioners, researchers, and engineers sharing hard-won knowledge
            from the frontlines of technology.
          </p>

          {/* Search + sort */}
          <div className="au4 flex items-center gap-3 max-w-xl mx-auto flex-wrap justify-center">
            <div className="relative flex-1 min-w-[220px]">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search writers, topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#16162a] border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#16162a] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white/70 outline-none cursor-pointer focus:border-[#7c5cbf]/50 transition-colors"
            >
              <option value="followers" className="bg-[#1a1a2e]">
                Most followed
              </option>
              <option value="posts" className="bg-[#1a1a2e]">
                Most posts
              </option>
              <option value="newest" className="bg-[#1a1a2e]">
                Newest
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Featured writers horizontal strip ── */}
      <div className="border-y border-white/[0.05] bg-[#0b0b18] py-10 mb-14">
        <div className="max-w-[1200px] mx-auto px-8">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
            Featured Writers
          </p>
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
            {featured.map((w) => (
              <div
                key={w.id}
                className="flex-shrink-0 flex items-center gap-3 bg-[#16162a] border border-white/[0.07] rounded-2xl px-4 py-3 hover:border-[#7c5cbf]/35 transition-all cursor-pointer group min-w-[220px]"
              >
                <img
                  src={w.avatar}
                  alt={w.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#7c5cbf]/30"
                />
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-[#c4a8f0] transition-colors">
                    {w.name}
                  </p>
                  <p className="text-white/35 text-[11px] truncate">
                    {w.specialty} · {w.followers} followers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24">
        {/* Specialty filter tabs */}
        <div className="au1 flex items-center gap-2 flex-wrap mb-8">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSpecialty(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                activeSpecialty === s
                  ? "bg-[#7c5cbf] border-[#7c5cbf] text-white"
                  : "bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 opacity-60">
                  {WRITERS.filter((w) => w.specialty === s).length}
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-white/30 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span>{" "}
            writers
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/25 text-sm">
            No writers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((writer, i) => (
              <WriterCard key={writer.id} writer={writer} index={i} />
            ))}
          </div>
        )}

        {/* Become a writer CTA */}
        <div className="mt-20 relative overflow-hidden bg-gradient-to-br from-[#1c1530] via-[#1a1535] to-[#0f102a] border border-[#7c5cbf]/20 rounded-3xl px-10 py-14 text-center">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#7c5cbf]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4a2d8f]/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 bg-[#c4a8f0] rounded-full" />
              <span className="text-[#c4a8f0] text-xs font-semibold tracking-wider">
                OPEN TO WRITERS
              </span>
            </div>
            <h2
              className="text-white font-extrabold mb-3"
              style={{ fontSize: "clamp(22px,3vw,36px)" }}
            >
              Share your expertise with
              <br />
              100K+ developers
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join our community of practitioners writing about real engineering
              challenges, cutting-edge research, and hard-won lessons.
            </p>
            <a
              href="/add-post"
              className="inline-flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(124,92,191,0.45)] transition-all duration-200 no-underline"
            >
              Start Writing Today
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
          </div>
        </div>
      </div>
    </div>
  );
}
