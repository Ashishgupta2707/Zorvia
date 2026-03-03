import { useState } from "react";

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const POSTS = [
  {
    id: 1,
    title:
      "GPT-5 and Beyond: What the Next Generation of Language Models Will Look Like",
    category: "AI & ML",
    author: "Sarah Mitchell",
    date: "28 Feb 2026",
    readTime: "8 min",
    status: "Published",
    views: 4821,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&q=80",
  },
  {
    id: 2,
    title: "Why Rust Is Eating C++ for Breakfast in Systems Programming",
    category: "Programming",
    author: "Daniel Okafor",
    date: "27 Feb 2026",
    readTime: "6 min",
    status: "Published",
    views: 3102,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&q=80",
  },
  {
    id: 3,
    title: "Zero Trust Architecture: Stop Assuming Your Network Is Safe",
    category: "Cybersecurity",
    author: "Elena Kovacs",
    date: "26 Feb 2026",
    readTime: "7 min",
    status: "Draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&q=80",
  },
  {
    id: 4,
    title: "Feature Engineering Is Still the Most Underrated Skill in ML",
    category: "Data Science",
    author: "Rahul Sharma",
    date: "25 Feb 2026",
    readTime: "9 min",
    status: "Published",
    views: 2789,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&q=80",
  },
  {
    id: 5,
    title: "React Server Components in Production: Six Months Later",
    category: "Web Dev",
    author: "Aisha Patel",
    date: "23 Feb 2026",
    readTime: "5 min",
    status: "Published",
    views: 5634,
    image:
      "https://images.unsplash.com/photo-1587620962725-abab19836100?w=120&q=80",
  },
  {
    id: 6,
    title: "Vector Databases Explained: The Engine Behind Modern AI Search",
    category: "AI & ML",
    author: "Chris Nakamura",
    date: "22 Feb 2026",
    readTime: "11 min",
    status: "Draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&q=80",
  },
  {
    id: 7,
    title:
      "What I Learned From 200 Technical Interviews on Both Sides of the Table",
    category: "Career",
    author: "Laura Brennan",
    date: "21 Feb 2026",
    readTime: "6 min",
    status: "Published",
    views: 7213,
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=120&q=80",
  },
  {
    id: 8,
    title: "Clean Code Is a Myth — Write Honest Code Instead",
    category: "Programming",
    author: "Tom Eriksson",
    date: "19 Feb 2026",
    readTime: "8 min",
    status: "Published",
    views: 3987,
    image:
      "https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=120&q=80",
  },
  {
    id: 9,
    title: "Quantum Computing in 2026: Hype vs. What's Actually Shipping",
    category: "Science",
    author: "Nina Johansson",
    date: "17 Feb 2026",
    readTime: "10 min",
    status: "Draft",
    views: 0,
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&q=80",
  },
  {
    id: 10,
    title: "How Large Language Models Are Reshaping the Way We Build Software",
    category: "AI & ML",
    author: "James Thornton",
    date: "24 Feb 2026",
    readTime: "10 min",
    status: "Published",
    views: 9104,
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=120&q=80",
  },
  {
    id: 11,
    title: "System Design Principles Every Senior Engineer Should Know",
    category: "Programming",
    author: "Priya Nair",
    date: "20 Feb 2026",
    readTime: "12 min",
    status: "Published",
    views: 6450,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&q=80",
  },
  {
    id: 12,
    title: "The Rise of Real-Time ML: Serving Models at Millisecond Latency",
    category: "Data Science",
    author: "Marcus Webb",
    date: "16 Feb 2026",
    readTime: "9 min",
    status: "Published",
    views: 2341,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&q=80",
  },
];

const CATEGORIES = [
  "All",
  "AI & ML",
  "Programming",
  "Data Science",
  "Web Dev",
  "Cybersecurity",
  "Career",
  "Science",
];
const STATUSES = ["All", "Published", "Draft"];
const STATUS_STYLE = {
  Published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Draft: "bg-amber-500/15  text-amber-400  border-amber-500/25",
};

/* ─── Delete Modal ───────────────────────────────────────────────────────── */
function DeleteModal({ post, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-7 max-w-sm w-full shadow-[0_32px_80px_rgba(0,0,0,0.6)] au1">
        <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-bold text-center mb-2">
          Delete Post?
        </h3>
        <p className="text-white/45 text-sm text-center leading-relaxed mb-6">
          "<span className="text-white/70">{post?.title?.slice(0, 50)}…</span>"
          will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:border-white/25 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AllPosts Page ──────────────────────────────────────────────────────── */
export default function AllPosts() {
  const [posts, setPosts] = useState(POSTS);
  const [activeCategory, setActiveCat] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const filtered = posts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeStatus === "All" || p.status === activeStatus)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "popular"
        ? b.views - a.views
        : sortBy === "oldest"
          ? a.id - b.id
          : b.id - a.id,
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "Published").length,
    draft: posts.filter((p) => p.status === "Draft").length,
    views: posts.reduce((s, p) => s + p.views, 0),
  };

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">

      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={() => {
            setPosts((p) => p.filter((x) => x.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-20">
        {/* ── Page heading ── */}
        <div className="au1 flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-1.5">
              Manage Content
            </p>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              All Posts
            </h1>
          </div>
          <a
            href="/add-post"
            className="flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,191,0.4)] transition-all duration-200 no-underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Post
          </a>
        </div>

        {/* ── Stats strip ── */}
        <div className="au2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              label: "Total Posts",
              value: stats.total,
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "text-blue-400",
              bg: "bg-blue-500/10 border-blue-500/20",
            },
            {
              label: "Published",
              value: stats.published,
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              label: "Drafts",
              value: stats.draft,
              icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
              color: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              label: "Total Views",
              value: stats.views.toLocaleString(),
              icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
              color: "text-[#c4a8f0]",
              bg: "bg-[#7c5cbf]/10 border-[#7c5cbf]/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-[#16162a] border rounded-2xl px-5 py-4 flex items-center gap-4 ${s.bg}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className={s.color}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={s.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-xl font-extrabold leading-none">
                  {s.value}
                </p>
                <p className="text-white/35 text-xs mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Sidebar + list ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="au3 space-y-7">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                width="14"
                height="14"
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
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#16162a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <p className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase mb-3">
                Category
              </p>
              <div className="space-y-0.5">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat === "All"
                      ? posts.length
                      : posts.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCat(cat);
                        setPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center justify-between ${
                        activeCategory === cat
                          ? "bg-[#7c5cbf]/20 text-[#c4a8f0] border border-[#7c5cbf]/30"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          activeCategory === cat
                            ? "bg-[#7c5cbf]/30 text-[#c4a8f0]"
                            : "bg-white/[0.06] text-white/25"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-white/30 text-[10px] font-bold tracking-[0.18em] uppercase mb-3">
                Status
              </p>
              <div className="space-y-0.5">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setActiveStatus(s);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 border ${
                      activeStatus === s
                        ? "bg-[#7c5cbf]/20 text-[#c4a8f0] border-[#7c5cbf]/30"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border-transparent"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* List */}
          <div>
            {/* Sort + count bar */}
            <div className="au4 flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-white/40 text-sm">
                Showing{" "}
                <span className="text-white font-semibold">
                  {filtered.length}
                </span>{" "}
                posts
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#16162a] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white/70 outline-none cursor-pointer focus:border-[#7c5cbf]/50 transition-colors"
              >
                <option value="newest" className="bg-[#1a1a2e]">
                  Newest first
                </option>
                <option value="oldest" className="bg-[#1a1a2e]">
                  Oldest first
                </option>
                <option value="popular" className="bg-[#1a1a2e]">
                  Most viewed
                </option>
              </select>
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              {visible.length === 0 ? (
                <div className="text-center py-20 text-white/25 text-sm">
                  No posts match your filters.
                </div>
              ) : (
                visible.map((post, i) => (
                  <div
                    key={post.id}
                    className={`group bg-[#16162a] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 hover:border-[#7c5cbf]/30 hover:bg-[#1c1c35] transition-all duration-200 card-r${Math.min(i + 1, 9)}`}
                  >
                    {/* Thumb */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-[60px] h-[60px] rounded-xl object-cover flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#c4a8f0] bg-[#7c5cbf]/20 border border-[#7c5cbf]/25 rounded-md px-2 py-0.5">
                          {post.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold border rounded-md px-2 py-0.5 ${STATUS_STYLE[post.status]}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <h3 className="text-white text-[14px] font-semibold leading-snug line-clamp-1 mb-1 group-hover:text-[#c4a8f0] transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-white/35 flex-wrap">
                        <span>{post.author}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span>{post.date}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                        <span>{post.readTime} read</span>
                        {post.status === "Published" && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <span className="flex items-center gap-1">
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              {post.views.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions — visible on hover */}
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <a
                        href={`/add-post?edit=${post.id}`}
                        className="w-8 h-8 rounded-lg bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 flex items-center justify-center text-[#c4a8f0] hover:bg-[#7c5cbf]/30 transition-all no-underline"
                        title="Edit"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                        title="Delete"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/40 hover:border-[#7c5cbf]/50 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        page === n
                          ? "bg-[#7c5cbf] border-[#7c5cbf] text-white"
                          : "bg-transparent border-white/10 text-white/45 hover:border-[#7c5cbf]/40 hover:text-white"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/40 hover:border-[#7c5cbf]/50 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
