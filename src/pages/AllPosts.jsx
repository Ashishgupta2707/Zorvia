import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/post";

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
const STATUSES = ["All", "Active", "Inactive"];

const STATUS_STYLE = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Inactive: "bg-red-500/15    text-red-400    border-red-500/25",
};

const CAT_COLOR = {
  "AI & ML": "bg-violet-500/15  text-violet-400  border-violet-500/25",
  Programming: "bg-blue-500/15    text-blue-400    border-blue-500/25",
  "Data Science": "bg-cyan-500/15    text-cyan-400    border-cyan-500/25",
  "Web Dev": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Cybersecurity: "bg-red-500/15     text-red-400     border-red-500/25",
  Career: "bg-amber-500/15   text-amber-400   border-amber-500/25",
  Science: "bg-pink-500/15    text-pink-400    border-pink-500/25",
};

/* ─── Delete Modal ───────────────────────────────────────────────────────── */
function DeleteModal({ post, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-7 max-w-sm w-full shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
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
          "
          <span className="text-white/70">
            {post?.title?.slice(0, 50)}
            {post?.title?.length > 50 ? "…" : ""}
          </span>
          " will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:border-white/25 hover:text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="bg-[#16162a] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 animate-pulse">
      <div className="w-[60px] h-[60px] rounded-xl bg-white/[0.06] flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-md bg-white/[0.06]" />
          <div className="h-4 w-12 rounded-md bg-white/[0.06]" />
        </div>
        <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* ─── AllPosts Page ──────────────────────────────────────────────────────── */
export default function AllPosts() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCat] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    appwriteService
      .getAllPosts([])
      .then((res) => {
        if (res?.documents) setPosts(res.documents);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load posts. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await appwriteService.deletePost(deleteTarget.$id);
      if (deleteTarget.featuredImage)
        await appwriteService.deleteFile(deleteTarget.featuredImage);
      setPosts((prev) => prev.filter((p) => p.$id !== deleteTarget.$id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = posts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => activeStatus === "All" || p.status === activeStatus)
    .filter(
      (p) =>
        (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.authorName || "").toLowerCase().includes(search.toLowerCase()), // ✅ search by author name
    )
    .sort((a, b) =>
      sortBy === "oldest"
        ? new Date(a.$createdAt) - new Date(b.$createdAt)
        : new Date(b.$createdAt) - new Date(a.$createdAt),
    );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = {
    total: posts.length,
    active: posts.filter((p) => p.status === "Active").length,
    inactive: posts.filter((p) => p.status === "Inactive").length,
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-20">
        {/* Page heading */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-1.5">
              Manage Content
            </p>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              All Posts
            </h1>
          </div>
          <button
            onClick={() => navigate("/add-post")}
            className="flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,191,0.4)] transition-all duration-200"
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
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/15 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Total Posts",
              value: stats.total,
              icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              color: "text-[#c4a8f0]",
              bg: "bg-[#7c5cbf]/10 border-[#7c5cbf]/20",
            },
            {
              label: "Active",
              value: stats.active,
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-red-400",
              bg: "bg-red-500/10 border-red-500/20",
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

        {/* Sidebar + list */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-7">
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
                placeholder="Search title or author..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#16162a] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors"
              />
            </div>

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
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center justify-between border ${
                        activeCategory === cat
                          ? "bg-[#7c5cbf]/20 text-[#c4a8f0] border-[#7c5cbf]/30"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.04] border-transparent"
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

          {/* Post list */}
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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
              </select>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : visible.length === 0 ? (
                <div className="text-center py-20 text-white/25 text-sm">
                  No posts match your filters.
                </div>
              ) : (
                visible.map((post) => (
                  <div
                    key={post.$id}
                    className="group bg-[#16162a] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4 hover:border-[#7c5cbf]/30 hover:bg-[#1c1c35] transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/post/${post.$id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="w-[60px] h-[60px] rounded-xl overflow-hidden flex-shrink-0 bg-[#0e0e1c]">
                      {post.featuredImage ? (
                        <img
                          src={appwriteService.getFilePreview(
                            post.featuredImage,
                          )}
                          alt={post.title}
                          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1.5"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {post.category && (
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase border rounded-md px-2 py-0.5 ${CAT_COLOR[post.category] || "bg-white/10 text-white/50 border-white/10"}`}
                          >
                            {post.category}
                          </span>
                        )}
                        {post.status && (
                          <span
                            className={`text-[10px] font-semibold border rounded-md px-2 py-0.5 ${STATUS_STYLE[post.status] || ""}`}
                          >
                            {post.status}
                          </span>
                        )}
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-white/30 bg-white/[0.05] border border-white/[0.07] rounded-md px-1.5 py-0.5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-white text-[14px] font-semibold leading-snug line-clamp-1 mb-1 group-hover:text-[#c4a8f0] transition-colors">
                        {post.title}
                      </h3>
                      {/* ✅ Author name + date row */}
                      <div className="flex items-center gap-2 text-[11px] text-white/35 flex-wrap">
                        {post.authorName && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-[#7c5cbf]/30 border border-[#7c5cbf]/40 flex items-center justify-center text-[8px] font-bold text-[#c4a8f0]">
                                {post.authorName.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white/50 font-medium">
                                {post.authorName}
                              </span>
                            </div>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                          </>
                        )}
                        <span>{formatDate(post.$createdAt)}</span>
                        {post.$updatedAt !== post.$createdAt && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                            <span>Updated {formatDate(post.$updatedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions — author only */}
                    {userData && post.userId === userData.$id && (
                      <div
                        className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/edit-post/${post.$id}`)}
                          className="w-8 h-8 rounded-lg bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 flex items-center justify-center text-[#c4a8f0] hover:bg-[#7c5cbf]/30 transition-all"
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
                        </button>
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
                    )}
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
                      className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
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
