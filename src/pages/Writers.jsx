import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import appwriteService from "../appwrite/post";

/* ─── Constants ─────────────────────────────────────────────────────────── */
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

/* ─── Derive writers from posts ──────────────────────────────────────────
   Groups all active posts by userId, then builds a writer profile for each
   unique author using data already present on post documents.
─────────────────────────────────────────────────────────────────────────── */
function deriveWriters(posts) {
  const map = {};

  posts.forEach((post) => {
    const uid = post.userId;
    if (!uid) return;

    if (!map[uid]) {
      map[uid] = {
        userId: uid,
        name: post.authorName || "Anonymous",
        // Most-used category across their posts (computed below)
        specialty: null,
        posts: [],
        tags: new Set(),
        categories: {},
        latestPost: null,
      };
    }

    const w = map[uid];
    w.posts.push(post);

    // Track latest post for cover image
    if (
      !w.latestPost ||
      new Date(post.$createdAt) > new Date(w.latestPost.$createdAt)
    ) {
      w.latestPost = post;
    }

    // Accumulate category counts
    if (post.category) {
      w.categories[post.category] = (w.categories[post.category] || 0) + 1;
    }

    // Accumulate tags (unique)
    (post.tags || []).forEach((t) => w.tags.add(t));
  });

  // Finalise each writer
  return Object.values(map).map((w) => {
    // Primary specialty = most-posted category
    const topCategory = Object.entries(w.categories).sort(
      (a, b) => b[1] - a[1],
    )[0];
    w.specialty = topCategory ? topCategory[0] : "Programming";

    // Top 3 tags by frequency across posts
    const tagFreq = {};
    w.posts.forEach((p) =>
      (p.tags || []).forEach((t) => {
        tagFreq[t] = (tagFreq[t] || 0) + 1;
      }),
    );
    w.topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);

    // Cover image from most recent post with an image
    const postWithImage = [...w.posts]
      .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
      .find((p) => p.featuredImage);
    w.coverImageId = postWithImage?.featuredImage || null;

    // Joined = oldest post date
    const oldest = w.posts.reduce(
      (acc, p) =>
        !acc || new Date(p.$createdAt) < new Date(acc.$createdAt) ? p : acc,
      null,
    );
    w.joined = oldest
      ? new Date(oldest.$createdAt).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })
      : "—";

    // Post count
    w.postCount = w.posts.length;

    // Featured = has 3+ posts
    w.featured = w.postCount >= 3;

    return w;
  });
}

/* ─── Avatar circle (initial-based, consistent with rest of app) ─────────── */
function AuthorAvatar({ name, size = "md" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
    lg: "w-20 h-20 text-2xl",
  };
  return (
    <div
      className={`${sizes[size]} rounded-2xl bg-[#7c5cbf]/25 border-2 border-[#16162a] ring-2 ring-[#7c5cbf]/40 flex items-center justify-center font-extrabold text-[#c4a8f0] flex-shrink-0`}
    >
      {initial}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="bg-[#16162a] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="h-24 bg-white/[0.04]" />
      <div className="px-5 -mt-8 mb-3 flex items-end justify-between">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.07]" />
        <div className="w-20 h-7 rounded-full bg-white/[0.07] mb-1" />
      </div>
      <div className="px-5 pb-5 space-y-2.5">
        <div className="h-4 w-32 bg-white/[0.06] rounded" />
        <div className="h-3 w-20 bg-white/[0.04] rounded" />
        <div className="h-3 w-full bg-white/[0.04] rounded" />
        <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
        <div className="flex gap-1.5 mt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 bg-white/[0.04] rounded-md" />
          ))}
        </div>
        <div className="flex pt-3 border-t border-white/[0.06]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="h-4 w-8 bg-white/[0.06] rounded" />
              <div className="h-2.5 w-12 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Writer Card ────────────────────────────────────────────────────────── */
function WriterCard({ writer, index, navigate }) {
  const [followed, setFollowed] = useState(false);
  const coverSrc = writer.coverImageId
    ? appwriteService.getFilePreview(writer.coverImageId)
    : null;

  return (
    <div
      className="group bg-[#16162a] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#7c5cbf]/35 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/all-posts?author=${writer.userId}`)}
    >
      {/* Cover strip */}
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#1a1035] to-[#0b0b18]">
        {coverSrc && (
          <img
            src={coverSrc}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-50"
          />
        )}
        {/* Always-present purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c5cbf]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#16162a]" />
        {writer.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#7c5cbf]/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            FEATURED
          </div>
        )}
      </div>

      {/* Avatar overlapping cover */}
      <div className="relative z-999 px-5 -mt-8 mb-3 flex items-end justify-between">
        <AuthorAvatar name={writer.name} size="md" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFollowed((f) => !f);
          }}
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
        <p className="text-white/30 text-xs mb-2">
          {writer.joined} · {writer.postCount}{" "}
          {writer.postCount === 1 ? "post" : "posts"}
        </p>

        {/* Specialty badge */}
        <span
          className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border mb-3 ${SPECIALTY_COLORS[writer.specialty] || "text-white/50 bg-white/5 border-white/10"}`}
        >
          {writer.specialty}
        </span>

        {/* Bio placeholder — derived from top category + tags since posts don't store bios */}
        <p className="text-white/45 text-[12.5px] leading-relaxed mb-4 line-clamp-2">
          Writing about {writer.specialty.toLowerCase()} and related topics.
          {writer.topTags.length > 0 && ` Covers ${writer.topTags.join(", ")}.`}
        </p>

        {/* Tags */}
        {writer.topTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {writer.topTags.map((t) => (
              <span
                key={t}
                className="text-[10px] text-white/35 bg-white/[0.05] border border-white/[0.08] rounded-md px-2 py-0.5 font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-0 border-t border-white/[0.07] pt-4">
          {[
            { label: "Posts", value: writer.postCount },
            {
              label: "Categories",
              value: Object.keys(writer.categories).length,
            },
            { label: "Tags", value: writer.tags.size },
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
  const navigate = useNavigate();
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("posts");

  /* ── Fetch all active posts, derive writers ── */
  useEffect(() => {
    appwriteService
      .getAllPosts([
        Query.equal("status", "Active"),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ])
      .then((res) => {
        if (res?.documents) {
          setWriters(deriveWriters(res.documents));
        }
      })
      .catch(() => setError("Failed to load writers."))
      .finally(() => setLoading(false));
  }, []);

  /* ── Filter + sort ── */
  const filtered = writers
    .filter((w) => activeSpecialty === "All" || w.specialty === activeSpecialty)
    .filter(
      (w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.specialty.toLowerCase().includes(search.toLowerCase()) ||
        w.topTags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === "posts") return b.postCount - a.postCount;
      if (sortBy === "tags") return b.tags.size - a.tags.size;
      if (sortBy === "newest")
        return (
          new Date(b.latestPost?.$createdAt) -
          new Date(a.latestPost?.$createdAt)
        );
      return 0;
    });

  const featured = writers.filter((w) => w.featured);

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden pt-28 pb-16 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7c5cbf]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cbf] animate-pulse" />
            <span className="text-[#c4a8f0] text-xs font-semibold tracking-wider">
              {loading
                ? "LOADING…"
                : `${writers.length} CONTRIBUTOR${writers.length !== 1 ? "S" : ""}`}
            </span>
          </div>
          <h1
            className="text-white font-extrabold tracking-tight mb-4"
            style={{ fontSize: "clamp(32px,5vw,56px)" }}
          >
            Meet the Writers
          </h1>
          <p className="text-white/45 text-base max-w-xl mx-auto leading-relaxed mb-10">
            Practitioners and engineers sharing hard-won knowledge from the
            frontlines of technology.
          </p>

          {/* Search + sort */}
          <div className="flex items-center gap-3 max-w-xl mx-auto flex-wrap justify-center">
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
              <option value="posts" className="bg-[#1a1a2e]">
                Most posts
              </option>
              <option value="newest" className="bg-[#1a1a2e]">
                Most recent
              </option>
              <option value="tags" className="bg-[#1a1a2e]">
                Most topics
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Featured writers strip ── */}
      {!loading && featured.length > 0 && (
        <div className="border-y border-white/[0.05] bg-[#0b0b18] py-10 mb-14">
          <div className="max-w-[1200px] mx-auto px-8">
            <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              Featured Writers
            </p>
            <div
              className="flex gap-5 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {featured.map((w) => (
                <div
                  key={w.userId}
                  onClick={() => navigate(`/all-posts?author=${w.userId}`)}
                  className="flex-shrink-0 flex items-center gap-3 bg-[#16162a] border border-white/[0.07] rounded-2xl px-4 py-3 hover:border-[#7c5cbf]/35 transition-all cursor-pointer group min-w-[220px]"
                >
                  {/* Small avatar circle for the strip */}
                  <div className="w-10 h-10 rounded-xl bg-[#7c5cbf]/25 border border-[#7c5cbf]/40 flex items-center justify-center text-[#c4a8f0] font-extrabold text-sm ring-1 ring-[#7c5cbf]/30 flex-shrink-0">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-[#c4a8f0] transition-colors">
                      {w.name}
                    </p>
                    <p className="text-white/35 text-[11px] truncate">
                      {w.specialty} · {w.postCount} posts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24">
        {/* Specialty filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
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
              {s !== "All" && !loading && (
                <span className="ml-1.5 opacity-60">
                  {writers.filter((w) => w.specialty === s).length}
                </span>
              )}
            </button>
          ))}
          {!loading && (
            <span className="ml-auto text-white/30 text-sm">
              <span className="text-white font-semibold">
                {filtered.length}
              </span>{" "}
              writers
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#7c5cbf] text-white text-sm font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading &&
          !error &&
          (filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-2xl bg-[#7c5cbf]/10 border border-[#7c5cbf]/20 flex items-center justify-center mb-4 mx-auto">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c5cbf"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="text-white/40 text-sm font-medium mb-1">
                No writers found
              </p>
              <p className="text-white/20 text-xs">
                Try a different filter or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((writer, i) => (
                <WriterCard
                  key={writer.userId}
                  writer={writer}
                  index={i}
                  navigate={navigate}
                />
              ))}
            </div>
          ))}

        {/* No posts at all — empty state */}
        {!loading && !error && writers.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm">
              No posts published yet — writers will appear here once they
              publish.
            </p>
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
              the Zorvia community
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join our community of practitioners writing about real engineering
              challenges, cutting-edge research, and hard-won lessons.
            </p>
            <button
              onClick={() => navigate("/add-post")}
              className="inline-flex items-center gap-2 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-bold text-sm px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(124,92,191,0.45)] transition-all duration-200"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
