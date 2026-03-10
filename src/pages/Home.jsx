import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import appwriteService from "../appwrite/post";

/* ─── Constants ─────────────────────────────────────────────────────────── */
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

const CAT_META = {
  "AI & ML": {
    color: "text-violet-300",
    bg: "bg-violet-500/20  border-violet-500/30",
  },
  Programming: {
    color: "text-blue-300",
    bg: "bg-blue-500/20    border-blue-500/30",
  },
  "Data Science": {
    color: "text-cyan-300",
    bg: "bg-cyan-500/20    border-cyan-500/30",
  },
  "Web Dev": {
    color: "text-emerald-300",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  Cybersecurity: {
    color: "text-red-300",
    bg: "bg-red-500/20     border-red-500/30",
  },
  Career: {
    color: "text-amber-300",
    bg: "bg-amber-500/20   border-amber-500/30",
  },
  Science: {
    color: "text-pink-300",
    bg: "bg-pink-500/20    border-pink-500/30",
  },
};

const FOOTER_COLS = [
  { title: "Explore", links: ["All Posts", "Add Post", "Writers"] },
  { title: "Company", links: ["About Us", "Careers", "Contact"] },
];
const SOCIALS = ["X", "In", "Gh", "Yt", "Dc"];

/* ─── Injected CSS ──────────────────────────────────────────────────────── */
const INJECTED_CSS = `
  @keyframes heroIn {
    from { opacity: 0; transform: scale(1.04); }
    to   { opacity: 1; transform: scale(1);    }
  }
  .hero-img-in { animation: heroIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards; }

  @keyframes heroSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .hero-t1 { animation: heroSlideUp 0.7s 0.20s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t2 { animation: heroSlideUp 0.7s 0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t3 { animation: heroSlideUp 0.7s 0.50s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t4 { animation: heroSlideUp 0.7s 0.65s cubic-bezier(0.22,1,0.36,1) both; }

  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                transform 0.55s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }
  .reveal-d1 { transition-delay: 0.05s; }
  .reveal-d2 { transition-delay: 0.12s; }
  .reveal-d3 { transition-delay: 0.19s; }
  .reveal-d4 { transition-delay: 0.26s; }
  .reveal-d5 { transition-delay: 0.33s; }
  .reveal-d6 { transition-delay: 0.40s; }
  .reveal-d7 { transition-delay: 0.47s; }
  .reveal-d8 { transition-delay: 0.54s; }
  .reveal-d9 { transition-delay: 0.61s; }

  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(124,92,191,.6)} 50%{box-shadow:0 0 0 6px rgba(124,92,191,0)} }
  .pulse-dot { animation: pulse 2s ease infinite; }

  @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.09) 50%, rgba(255,255,255,.04) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s ease infinite;
    border-radius: 8px;
  }

  .card-shine::after {
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.04) 50%,rgba(255,255,255,0) 60%);
    opacity:0;
    transition:opacity .4s;
    pointer-events:none;
  }
  .card-shine:hover::after { opacity:1; }
`;

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function readTime(html) {
  const words = (html || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(html, max = 120) {
  const text = (html || "").replace(/<[^>]+>/g, "").trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

/* ─── AuthorAvatar — shared component matching PostDetail's style ────────
   Shows a purple circle with the author's first initial, exactly like
   PostDetail does for the byline. Falls back gracefully if name is missing.
─────────────────────────────────────────────────────────────────────────── */
function AuthorAvatar({ name, size = "sm" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const sizeClass = size === "sm" ? "w-7 h-7 text-[11px]" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#7c5cbf]/25 border border-[#7c5cbf]/40 flex items-center justify-center font-bold text-[#c4a8f0] flex-shrink-0`}
    >
      {initial}
    </div>
  );
}

/* ─── useReveal ──────────────────────────────────────────────────────────── */
function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.06 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ─── CategoryBadge ─────────────────────────────────────────────────────── */
function CategoryBadge({ label, overlay = false }) {
  const meta = CAT_META[label];
  if (overlay)
    return (
      <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-white/20">
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        {label}
      </span>
    );
  return (
    <span
      className={`inline-block text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg border ${meta ? `${meta.color} ${meta.bg}` : "text-white/60 bg-white/10 border-white/15"}`}
    >
      {label}
    </span>
  );
}

/* ─── Skeleton components ────────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[635px] bg-[#0b0b18] overflow-hidden flex items-end pb-14 px-8">
      <div className="max-w-[1200px] w-full mx-auto space-y-5">
        <div className="skeleton h-6 w-36 rounded-full" />
        <div className="skeleton h-12 w-2/3 rounded-xl" />
        <div className="skeleton h-5 w-1/2" />
        <div className="skeleton h-5 w-2/5" />
        <div className="flex gap-3 mt-2">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="skeleton h-10 w-28 rounded-full" />
          <div className="skeleton h-10 w-32 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-[#13132a] rounded-2xl overflow-hidden border border-white/[0.06]">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
          <div className="skeleton w-7 h-7 rounded-full" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

/* ─── BlogCard ──────────────────────────────────────────────────────────── */
function BlogCard({ post, delay, navigate }) {
  const imgSrc = post.featuredImage
    ? appwriteService.getFilePreview(post.featuredImage)
    : null;
  const rt = readTime(post.content);
  const ex = excerpt(post.content);
  // Use authorName exactly as PostDetail does — fall back to "Anonymous"
  const authorName = post.authorName || "Anonymous";

  return (
    <article
      onClick={() => navigate(`/post/${post.$id}`)}
      className={`reveal reveal-d${delay} card-shine group relative bg-[#13132a] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#7c5cbf]/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(0,0,0,0.55)]`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 bg-[#0e0e1c]">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(124,92,191,0.3)"
              strokeWidth="1.2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13132a] via-[#13132a]/15 to-transparent" />
        {post.category && (
          <div className="absolute top-3 left-3">
            <CategoryBadge label={post.category} />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white/65 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
          {rt}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-3">
        <p className="text-white/25 text-[11px] font-medium mb-2.5 tracking-wide">
          {fmtDate(post.$createdAt)}
        </p>
        <h3 className="text-white/90 text-[14px] font-bold leading-snug mb-2 group-hover:text-[#c4a8f0] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        {ex && (
          <p className="text-white/35 text-[12.5px] leading-relaxed line-clamp-2 mb-4">
            {ex}
          </p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* ✅ Author row — matches PostDetail's byline: avatar initial + name */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
          <AuthorAvatar name={authorName} size="sm" />
          <span className="text-white/50 text-xs font-semibold flex-1 truncate">
            {authorName}
          </span>
          <div className="w-6 h-6 rounded-lg bg-[#7c5cbf]/0 group-hover:bg-[#7c5cbf]/20 border border-transparent group-hover:border-[#7c5cbf]/30 flex items-center justify-center transition-all duration-200">
            <svg
              className="text-[#7c5cbf]/0 group-hover:text-[#c4a8f0] transition-colors duration-200"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#7c5cbf]/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
    </article>
  );
}

/* ─── HeroSlide ─────────────────────────────────────────────────────────── */
function HeroSlide({ post, animKey, navigate }) {
  const imgSrc = post.featuredImage
    ? appwriteService.getFilePreview(post.featuredImage)
    : null;
  const rt = readTime(post.content);
  const ex = excerpt(post.content, 160);
  // ✅ Use authorName exactly like PostDetail — fall back to "Anonymous"
  const authorName = post.authorName || "Anonymous";

  return (
    <>
      {/* BG Image */}
      {imgSrc ? (
        <img
          key={`img-${animKey}`}
          src={imgSrc}
          alt={post.title}
          className="hero-img-in absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-[#0e0e1c] to-[#0b0b18]" />
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c] via-[#0e0e1c]/65 to-[#0e0e1c]/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e1c]/85 via-[#0e0e1c]/30 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[#7c5cbf]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Content — pb-28 reserves space so the author row never overlaps
          the nav dots/arrows which sit at absolute bottom-6            */}
      <div
        key={`content-${animKey}`}
        className="absolute inset-0 flex flex-col justify-end pb-28 px-8 max-w-[1200px] mx-auto left-0 right-0"
      >
        <div className="hero-t1 flex items-center gap-3 mb-5 flex-wrap">
          {post.category && <CategoryBadge label={post.category} overlay />}
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/40 text-xs font-medium">{rt}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/40 text-xs font-medium">
            {fmtDate(post.$createdAt)}
          </span>
        </div>

        <h1
          className="hero-t2 font-extrabold leading-[1.07] tracking-tight max-w-2xl mb-5"
          style={{
            fontSize: "clamp(26px,4.5vw,54px)",
            textShadow: "0 4px 32px rgba(0,0,0,0.5)",
          }}
        >
          {post.title}
        </h1>

        {ex && (
          <p className="hero-t3 text-white/50 text-base max-w-xl leading-relaxed mb-5">
            {ex}
          </p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="hero-t3 flex flex-wrap gap-1.5 mb-5">
            {post.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] text-[#c4a8f0]/60 bg-[#7c5cbf]/10 border border-[#7c5cbf]/15 rounded-full px-2.5 py-0.5"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Author row + CTA — sits above the nav controls with clear space */}
        <div className="hero-t4 flex items-center gap-4 flex-wrap">
          {/* Author block */}
          <div className="flex items-center gap-3">
            <AuthorAvatar name={authorName} size="lg" />
            <div>
              <p className="text-white text-sm font-bold leading-none">
                {authorName}
              </p>
              <p className="text-white/35 text-[11px] mt-0.5">Author</p>
            </div>
          </div>

          <div className="h-5 w-px bg-white/15 hidden sm:block" />

          {/* Read CTA */}
          <button
            onClick={() => navigate(`/post/${post.$id}`)}
            className="flex items-center gap-2.5 bg-white text-[#0e0e1c] text-sm font-bold px-6 py-3 rounded-full hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-200"
          >
            Read Article
            <svg
              width="13"
              height="13"
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
    </>
  );
}

/* ═══ HomePage ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const AUTO_DELAY = 6000;

  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  /* Inject styles once */
  useEffect(() => {
    const id = "zorvia-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = INJECTED_CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* Fetch posts */
  useEffect(() => {
    appwriteService
      .getAllPosts([
        Query.equal("status", "Active"),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ])
      .then((res) => {
        if (res?.documents) setPosts(res.documents);
      })
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  /* Auto-advance hero */
  const heroSlides = posts.slice(0, 5);
  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    const t = setInterval(() => {
      setAnimKey((k) => k + 1);
      setSlide((s) => (s + 1) % heroSlides.length);
    }, AUTO_DELAY);
    return () => clearInterval(t);
  }, [paused, heroSlides.length]);

  const changeSlide = (i) => {
    setAnimKey((k) => k + 1);
    setSlide(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 4000);
  };

  /* Reveal refs */
  const statsRef = useReveal([loading]);
  const articlesRef = useReveal([posts, activeTab, page]);
  const ctaRef = useReveal([loading]);
  const newsletterRef = useReveal([]);

  /* Filtered articles */
  const filtered =
    activeTab === "All" ? posts : posts.filter((p) => p.category === activeTab);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* Stats */
  const stats = [
    {
      value: posts.length > 0 ? `${posts.length}+` : "—",
      label: "Articles Published",
    },
    {
      value:
        [...new Set(posts.map((p) => p.category).filter(Boolean))].length ||
        "—",
      label: "Categories",
    },
    {
      value:
        posts.filter((p) => p.tags?.length > 0).length > 0
          ? `${posts.flatMap((p) => p.tags || []).length}+`
          : "—",
      label: "Topics Covered",
    },
    {
      value:
        [...new Set(posts.map((p) => p.userId).filter(Boolean))].length || "—",
      label: "Contributors",
    },
  ];

  const currentHero = heroSlides[slide];

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      {loading ? (
        <HeroSkeleton />
      ) : error ? (
        <section className="relative w-full min-h-[500px] bg-[#0b0b18] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/30 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#7c5cbf] text-white text-sm font-semibold rounded-xl"
            >
              Retry
            </button>
          </div>
        </section>
      ) : currentHero ? (
        <section
          className="relative w-full overflow-hidden min-h-[635px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <HeroSlide post={currentHero} animKey={animKey} navigate={navigate} />

          {/* Slide counter */}
          {heroSlides.length > 1 && (
            <div className="absolute top-28 right-10 hidden lg:flex flex-col items-end gap-1">
              <p className="text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase">
                Story
              </p>
              <p
                className="font-extrabold leading-none"
                style={{
                  fontSize: 42,
                  textShadow: "0 2px 20px rgba(0,0,0,.5)",
                }}
              >
                <span className="text-white">0{slide + 1}</span>
                <span className="text-white/20 text-2xl">
                  {" "}
                  / 0{heroSlides.length}
                </span>
              </p>
            </div>
          )}

          {/* Thumbnail strip */}
          {heroSlides.length > 1 && (
            <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
              {heroSlides.map((p, i) => {
                const thumb = p.featuredImage
                  ? appwriteService.getFilePreview(p.featuredImage)
                  : null;
                return (
                  <button
                    key={p.$id}
                    onClick={() => changeSlide(i)}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${i === slide ? "w-[108px] h-[68px] border-[#7c5cbf] shadow-[0_0_20px_rgba(124,92,191,.5)]" : "w-[88px] h-[56px] border-white/15 opacity-40 hover:opacity-70 hover:border-white/35"}`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#7c5cbf]/20 flex items-center justify-center text-[9px] text-[#c4a8f0]/60 font-bold">
                        {p.category || "Post"}
                      </div>
                    )}
                    {i !== slide && (
                      <div className="absolute inset-0 bg-black/30" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Nav dots + arrows — pinned at bottom-6, safely below author row */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-6 left-8 max-w-[1200px] mx-auto right-0 flex items-center gap-4 z-10 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => changeSlide(i)}
                    className={`rounded-full border-none cursor-pointer transition-all duration-300 ${i === slide ? "w-8 h-[6px] bg-white" : "w-[6px] h-[6px] bg-white/30 hover:bg-white/55"}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 ml-1 pointer-events-auto">
                <button
                  onClick={() =>
                    changeSlide(
                      (slide - 1 + heroSlides.length) % heroSlides.length,
                    )
                  }
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 flex items-center justify-center transition-all backdrop-blur-sm hover:border-white/30"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => changeSlide((slide + 1) % heroSlides.length)}
                  className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 flex items-center justify-center transition-all backdrop-blur-sm hover:border-white/30"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Empty state */
        <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-[#0e0e1c] to-[#0b0b18]" />
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative z-10 text-center px-8 max-w-lg">
            <div className="w-16 h-16 rounded-2xl bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 flex items-center justify-center mx-auto mb-6">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c4a8f0"
                strokeWidth="1.5"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h1 className="text-white text-3xl font-extrabold mb-3 tracking-tight">
              Welcome to Zorvia
            </h1>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              No articles published yet. Be the first to share your knowledge
              with the world.
            </p>
            <button
              onClick={() => navigate("/add-post")}
              className="inline-flex items-center gap-2 bg-white text-[#0e0e1c] text-sm font-bold px-6 py-3 rounded-full hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,.2)] transition-all duration-200"
            >
              Write the First Post
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* ═══ STATS BAR ═══════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="border-y border-white/[0.05] bg-[#0b0b18]">
        <div className="max-w-[1200px] mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal reveal-d${i + 1} text-center px-6 py-2`}
            >
              {loading ? (
                <>
                  <div className="skeleton h-6 w-16 mx-auto mb-1" />
                  <div className="skeleton h-3 w-24 mx-auto" />
                </>
              ) : (
                <>
                  <p className="text-white text-xl font-extrabold tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-white/30 text-[11px] mt-0.5">{s.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ARTICLES ════════════════════════════════════════════════════════ */}
      <div ref={articlesRef} className="max-w-[1200px] mx-auto px-8 py-20">
        <div className="reveal flex items-end justify-between mb-2 flex-wrap gap-4">
          <div>
            <p className="text-[#7c5cbf] text-[11px] font-bold tracking-[0.22em] uppercase mb-1.5">
              Zorvia
            </p>
            <h2 className="text-white text-3xl font-extrabold tracking-tight">
              Latest Articles
            </h2>
          </div>
          <button
            onClick={() => navigate("/all-posts")}
            className="reveal reveal-d2 flex items-center gap-2 text-white/40 text-sm font-semibold hover:text-[#c4a8f0] transition-colors group"
          >
            View all posts
            <svg
              className="group-hover:translate-x-0.5 transition-transform"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="reveal text-white/30 text-sm mb-10 max-w-lg leading-relaxed">
          In-depth articles on programming, AI, data science, system design, and
          the ideas shaping the future of technology.
        </p>

        {/* Filters */}
        <div className="reveal flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all duration-200 cursor-pointer ${activeTab === cat ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_4px_20px_rgba(124,92,191,.4)]" : "bg-transparent border-white/[0.1] text-white/45 hover:border-white/30 hover:text-white/75"}`}
              >
                {cat}
                {!loading && cat !== "All" && (
                  <span className="ml-1.5 text-[9px] font-bold opacity-60">
                    {posts.filter((p) => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {visible.map((post, i) => (
              <BlogCard
                key={post.$id}
                post={post}
                delay={Math.min(i + 1, 9)}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#7c5cbf]/10 border border-[#7c5cbf]/20 flex items-center justify-center mb-4">
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
              No posts in this category yet
            </p>
            <p className="text-white/20 text-xs">
              Try a different filter or be the first to write one
            </p>
            <button
              onClick={() => navigate("/add-post")}
              className="mt-5 px-5 py-2.5 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 text-[#c4a8f0] text-sm font-semibold rounded-xl hover:bg-[#7c5cbf]/25 transition-all"
            >
              Write a {activeTab} post
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/35 hover:border-[#7c5cbf]/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all cursor-pointer ${page === n ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_4px_16px_rgba(124,92,191,.35)]" : "bg-transparent border-white/10 text-white/40 hover:border-[#7c5cbf]/40 hover:text-white"}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/35 hover:border-[#7c5cbf]/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
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

      {/* ═══ BOTTOM CTA ══════════════════════════════════════════════════════ */}
      <div ref={ctaRef} className="max-w-[1200px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-5">
            <div className="reveal relative overflow-hidden bg-[#13132a] border border-white/[0.07] rounded-2xl p-8 hover:border-[#7c5cbf]/35 transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#7c5cbf]/12 rounded-full blur-3xl group-hover:bg-[#7c5cbf]/22 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4a2d8f]/15 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 flex items-center justify-center mb-6 group-hover:bg-[#7c5cbf]/30 transition-colors">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c4a8f0"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <p className="text-[#7c5cbf] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                  For Writers
                </p>
                <h3 className="text-white text-xl font-extrabold leading-tight mb-2.5">
                  Share your knowledge
                  <br />
                  with the world
                </h3>
                <p className="text-white/38 text-sm leading-relaxed mb-7">
                  Join our growing community of practitioners publishing on
                  tech, science, and ideas that matter.
                </p>
                <button
                  onClick={() => navigate("/add-post")}
                  className="inline-flex items-center gap-2 bg-white text-[#0e0e1c] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,.18)] transition-all duration-200"
                >
                  Start Writing
                  <svg
                    width="13"
                    height="13"
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

            {/* Live stats card */}
            <div className="reveal reveal-d2 relative overflow-hidden rounded-2xl min-h-[150px] group cursor-pointer bg-[#13132a] border border-white/[0.07] hover:border-[#7c5cbf]/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c5cbf]/8 to-transparent" />
              <div className="relative p-7 h-full flex items-center justify-between">
                <div>
                  <p className="text-white/30 text-xs mb-1">
                    Articles Published
                  </p>
                  <p
                    className="text-white font-extrabold tracking-tight leading-none"
                    style={{ fontSize: 48 }}
                  >
                    {loading ? "—" : posts.length}
                  </p>
                </div>
                <div className="w-px h-16 bg-white/[0.07]" />
                <div className="text-right">
                  <p className="text-white/30 text-xs mb-1">Categories</p>
                  <p className="text-white font-extrabold text-3xl tracking-tight">
                    {loading
                      ? "—"
                      : [
                          ...new Set(
                            posts.map((p) => p.category).filter(Boolean),
                          ),
                        ].length}
                  </p>
                </div>
                <div className="w-px h-16 bg-white/[0.07]" />
                <div className="text-right">
                  <p className="text-white/30 text-xs mb-1">Contributors</p>
                  <p className="text-white font-extrabold text-3xl tracking-tight">
                    {loading
                      ? "—"
                      : [...new Set(posts.map((p) => p.userId).filter(Boolean))]
                          .length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission card */}
          <div className="reveal reveal-d3 relative overflow-hidden rounded-2xl min-h-[420px] group cursor-pointer">
            {posts[0]?.featuredImage ? (
              <img
                src={appwriteService.getFilePreview(posts[0].featuredImage)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 opacity-60"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1035] to-[#0b0b18]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c]/95 via-[#0e0e1c]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e1c]/30 to-transparent" />
            <div className="absolute top-5 left-5">
              <span className="flex items-center gap-1.5 bg-[#7c5cbf]/70 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border border-[#7c5cbf]/50">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                OUR MISSION
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white text-xl font-extrabold leading-snug mb-3">
                Beyond tutorials —<br />
                deep understanding that lasts
              </p>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Every article is written by practitioners who have shipped real
                systems and learned hard lessons along the way.
              </p>
              <button
                onClick={() => navigate("/all-posts")}
                className="inline-flex items-center gap-2 text-[#c4a8f0] text-sm font-semibold hover:gap-3 transition-all"
              >
                Explore all articles
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#7c5cbf]/0 group-hover:ring-[#7c5cbf]/40 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* ═══ NEWSLETTER ══════════════════════════════════════════════════════ */}
      <div
        ref={newsletterRef}
        className="relative overflow-hidden border-t border-white/[0.05]"
      >
        <div className="absolute inset-0 bg-[#0b0b18]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c5cbf]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#3d2080]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="reveal max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cbf] pulse-dot" />
              <span className="text-[#c4a8f0] text-[10px] font-bold tracking-[0.22em] uppercase">
                Weekly Digest
              </span>
            </div>
            <h2
              className="text-white font-extrabold tracking-tight mb-3"
              style={{ fontSize: "clamp(22px,3vw,32px)" }}
            >
              The best tech writing,
              <br />
              in your inbox every Friday.
            </h2>
            <p className="text-white/30 text-sm leading-relaxed">
              No algorithm, no noise — just the articles that actually matter
              this week.
            </p>
          </div>
          <div className="reveal reveal-d2 w-full md:w-auto md:min-w-[340px] flex gap-2.5">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/[0.06] border border-white/[0.09] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors min-w-0"
            />
            <button className="bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-bold px-5 py-3.5 rounded-xl whitespace-nowrap hover:shadow-[0_6px_24px_rgba(124,92,191,.45)] hover:-translate-y-0.5 transition-all duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#080812] border-t border-white/[0.05]">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#7c5cbf] pulse-dot" />
                <span className="text-white font-extrabold text-xl tracking-widest">
                  ZORVIA
                </span>
              </div>
              <p className="text-white/25 text-[13px] leading-relaxed max-w-[220px]">
                A knowledge platform for developers, engineers, and curious
                minds exploring the frontiers of technology.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-white/25 text-sm no-underline mb-2.5 hover:text-white/65 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
            <div>
              <p className="text-white/50 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">
                Get Updates
              </p>
              <div className="flex gap-2 mb-5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7c5cbf]/50 transition-colors min-w-0"
                />
                <button className="bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors">
                  Go
                </button>
              </div>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 text-[10px] font-bold hover:bg-[#7c5cbf]/25 hover:border-[#7c5cbf]/35 hover:text-white/80 transition-all no-underline"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex items-center justify-between flex-wrap gap-3">
            <span className="text-white/18 text-xs">
              ©2026 Zorvia. All rights reserved.
            </span>
            <div className="flex gap-5">
              <a
                href="#"
                className="text-white/18 text-xs no-underline hover:text-white/50 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/18 text-xs no-underline hover:text-white/50 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
