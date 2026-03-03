import { useState, useEffect, useRef } from "react";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85",
    category: "Data Science",
    title: "The Rise of Real-Time ML: Serving Models at Millisecond Latency",
    excerpt:
      "How modern data teams are moving from batch pipelines to streaming inference — and what it means for your architecture.",
    author: "Marcus Webb",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    date: "16 Feb 2026",
    readTime: "9 mins read",
  },
  {
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=85",
    category: "Programming",
    title: "System Design Principles Every Senior Engineer Should Know",
    excerpt:
      "Scalability, fault tolerance, and data consistency — a deep dive into the architectural decisions that separate good systems from great ones.",
    author: "Priya Nair",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    date: "20 Feb 2026",
    readTime: "12 mins read",
  },
  {
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1600&q=85",
    category: "Artificial Intelligence",
    title: "How Large Language Models Are Reshaping the Way We Build Software",
    excerpt:
      "From code generation to automated testing — AI is no longer a tool, it's becoming a core part of every developer's workflow.",
    author: "James Thornton",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    date: "24 Feb 2026",
    readTime: "10 mins read",
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

const ALL_BLOGS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    category: "AI & ML",
    date: "28 Feb 2026",
    readTime: "8 mins read",
    title:
      "GPT-5 and Beyond: What the Next Generation of Language Models Will Look Like",
    excerpt:
      "Researchers are pushing past token limits and context windows. Here's what the next frontier of foundation models actually means for developers.",
    author: "Sarah Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    category: "Programming",
    date: "27 Feb 2026",
    readTime: "6 mins read",
    title: "Why Rust Is Eating C++ for Breakfast in Systems Programming",
    excerpt:
      "Memory safety without garbage collection, fearless concurrency, and zero-cost abstractions — Rust is no longer a niche language.",
    author: "Daniel Okafor",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    category: "Cybersecurity",
    date: "26 Feb 2026",
    readTime: "7 mins read",
    title: "Zero Trust Architecture: Stop Assuming Your Network Is Safe",
    excerpt:
      "The perimeter-based security model is dead. Learn how leading companies are implementing Zero Trust to protect distributed systems.",
    author: "Elena Kovacs",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    category: "Data Science",
    date: "25 Feb 2026",
    readTime: "9 mins read",
    title:
      "Feature Engineering Is Still the Most Underrated Skill in Machine Learning",
    excerpt:
      "AutoML and neural architecture search are impressive, but thoughtful feature engineering remains what separates 80% accuracy from 95%.",
    author: "Rahul Sharma",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1587620962725-abab19836100?w=600&q=80",
    category: "Web Dev",
    date: "23 Feb 2026",
    readTime: "5 mins read",
    title: "React Server Components in Production: Six Months Later",
    excerpt:
      "We shipped RSC to 2 million users. Here's what worked, what didn't, and what we'd do differently if we started over today.",
    author: "Aisha Patel",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    category: "AI & ML",
    date: "22 Feb 2026",
    readTime: "11 mins read",
    title: "Vector Databases Explained: The Engine Behind Modern AI Search",
    excerpt:
      "Pinecone, Weaviate, Qdrant — what they are, how embeddings work, and when you actually need one in your stack.",
    author: "Chris Nakamura",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&q=80",
    category: "Career",
    date: "21 Feb 2026",
    readTime: "6 mins read",
    title:
      "What I Learned From 200 Technical Interviews on Both Sides of the Table",
    excerpt:
      "After interviewing hundreds of engineers and being interviewed myself, here's what actually predicts whether someone will succeed on the job.",
    author: "Laura Brennan",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1569396116180-210c182bedb8?w=600&q=80",
    category: "Programming",
    date: "19 Feb 2026",
    readTime: "8 mins read",
    title: "Clean Code Is a Myth — Write Honest Code Instead",
    excerpt:
      '"Clean" is subjective. "Honest" is not. Here\'s a pragmatic framework for writing code your teammates will actually thank you for.',
    author: "Tom Eriksson",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    category: "Science",
    date: "17 Feb 2026",
    readTime: "10 mins read",
    title: "Quantum Computing in 2026: Hype vs. What's Actually Shipping",
    excerpt:
      "IBM, Google, and startups are racing to hit fault-tolerant qubit milestones. We break down what's real progress and what's still marketing.",
    author: "Nina Johansson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80",
  },
];

const FOOTER_COLS = [
  { title: "About", links: ["About Us", "Blog", "Career"] },
  { title: "Support", links: ["Contact Us", "Return", "FAQ"] },
];
const SOCIALS = ["instagram", "twitter", "facebook", "discord", "tiktok"];

const CAT_META = {
  "AI & ML": {
    color: "text-violet-300",
    bg: "bg-violet-500/20 border-violet-500/30",
  },
  Programming: {
    color: "text-blue-300",
    bg: "bg-blue-500/20   border-blue-500/30",
  },
  "Data Science": {
    color: "text-cyan-300",
    bg: "bg-cyan-500/20   border-cyan-500/30",
  },
  "Web Dev": {
    color: "text-emerald-300",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  Cybersecurity: {
    color: "text-red-300",
    bg: "bg-red-500/20   border-red-500/30",
  },
  Career: {
    color: "text-amber-300",
    bg: "bg-amber-500/20 border-amber-500/30",
  },
  Science: { color: "text-pink-300", bg: "bg-pink-500/20  border-pink-500/30" },
  "Artificial Intelligence": {
    color: "text-violet-300",
    bg: "bg-violet-500/20 border-violet-500/30",
  },
};

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
  .hero-t1 { animation: heroSlideUp 0.7s 0.25s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t2 { animation: heroSlideUp 0.7s 0.40s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t3 { animation: heroSlideUp 0.7s 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .hero-t4 { animation: heroSlideUp 0.7s 0.70s cubic-bezier(0.22,1,0.36,1) both; }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1),
                transform 0.65s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .reveal-d1 { transition-delay: 0.05s; }
  .reveal-d2 { transition-delay: 0.12s; }
  .reveal-d3 { transition-delay: 0.19s; }
  .reveal-d4 { transition-delay: 0.26s; }
  .reveal-d5 { transition-delay: 0.33s; }
  .reveal-d6 { transition-delay: 0.40s; }
  .reveal-d7 { transition-delay: 0.47s; }
  .reveal-d8 { transition-delay: 0.54s; }
  .reveal-d9 { transition-delay: 0.61s; }

  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(124,92,191,0.6); }
    50%      { box-shadow: 0 0 0 6px rgba(124,92,191,0); }
  }
  .pulse-dot { animation: pulse 2s ease infinite; }

  @keyframes sliderProgress {
    from { width: 0%; }
    to   { width: 100%; }
  }
  .slider-progress {
    animation: sliderProgress var(--duration, 5s) linear forwards;
  }
`;

/* ─── useReveal hook ────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─── CategoryBadge ─────────────────────────────────────────────────────── */
function CategoryBadge({ label, overlay = false }) {
  const meta = CAT_META[label];
  if (overlay)
    return (
      <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full border border-white/20">
        <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
        {label}
      </span>
    );
  return (
    <span
      className={`inline-block text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-lg border backdrop-blur-sm ${meta ? `${meta.color} ${meta.bg}` : "text-white/70 bg-white/10 border-white/20"}`}
    >
      {label}
    </span>
  );
}

/* ─── BlogCard ──────────────────────────────────────────────────────────── */
function BlogCard({ post, delay }) {
  return (
    <article
      className={`reveal reveal-d${delay} group relative bg-[#13132a] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#7c5cbf]/50 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(0,0,0,0.55)]`}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13132a] via-[#13132a]/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <CategoryBadge label={post.category} />
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white/65 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
          {post.readTime}
        </div>
      </div>
      <div className="p-5 pt-3">
        <p className="text-white/25 text-[11px] font-medium mb-2.5 tracking-wide">
          {post.date}
        </p>
        <h3 className="text-white/90 text-[14px] font-bold leading-snug mb-2.5 group-hover:text-[#c4a8f0] transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-white/35 text-[12.5px] leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
          <img
            src={post.avatar}
            alt={post.author}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-[#7c5cbf]/40"
          />
          <span className="text-white/50 text-xs font-semibold flex-1">
            {post.author}
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
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#7c5cbf]/70 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
    </article>
  );
}

/* ─── HomePage ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [paused, setPaused] = useState(false);
  const AUTO_DELAY = 5000;
  const PER_PAGE = 9;

  /* Inject styles once */
  useEffect(() => {
    const id = "quill-styles";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = INJECTED_CSS;
      document.head.appendChild(s);
    }
  }, []);

  /* ── Auto-advance slider ── */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setAnimKey((k) => k + 1);
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, AUTO_DELAY);
    return () => clearInterval(t);
  }, [paused]);

  const changeSlide = (i) => {
    setAnimKey((k) => k + 1);
    setSlide(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 3000);
  };

  /* ── Scroll-reveal refs ── */
  const statsRef = useReveal();
  const articlesRef = useReveal();
  const ctaRef = useReveal();
  const newsletterRef = useReveal();

  const filtered =
    activeTab === "All"
      ? ALL_BLOGS
      : ALL_BLOGS.filter((b) => b.category === activeTab);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const handleTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };
  const current = HERO_SLIDES[slide];

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden h-full min-h-[635px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background — key forces re-mount → CSS anim re-fires */}
        <img
          key={`img-${animKey}`}
          src={current.image}
          alt={current.title}
          className="hero-img-in absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c] via-[#0e0e1c]/60 to-[#0e0e1c]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e1c]/80 via-[#0e0e1c]/25 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[#7c5cbf]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress bar at top */}
        {/* <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 z-20">
          <div
            key={`prog-${animKey}`}
            className="slider-progress h-full bg-gradient-to-r from-[#7c5cbf] to-[#c4a8f0]"
            style={{ "--duration": `${AUTO_DELAY}ms` }}
          />
        </div> */}

        {/* Slide counter */}
        <div className="absolute top-28 right-10 hidden lg:flex flex-col items-end gap-1">
          <p className="text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase">
            Story
          </p>
          <p
            className="font-extrabold leading-none"
            style={{ fontSize: 44, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            <span className="text-white">0{slide + 1}</span>
            <span className="text-white/20 text-2xl">
              {" "}
              / 0{HERO_SLIDES.length}
            </span>
          </p>
        </div>

        {/* Thumbnail strip */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-10">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${i === slide ? "w-[108px] h-[68px] border-[#7c5cbf] shadow-[0_0_20px_rgba(124,92,191,0.5)]" : "w-[88px] h-[56px] border-white/15 opacity-40 hover:opacity-70 hover:border-white/35"}`}
            >
              <img
                src={s.image}
                alt=""
                className="w-full h-full object-cover"
              />
              {i !== slide && <div className="absolute inset-0 bg-black/30" />}
            </button>
          ))}
        </div>

        {/* Hero text content — re-keyed so stagger animations replay */}
        <div
          key={`content-${animKey}`}
          className="absolute inset-0 flex flex-col justify-end pb-14 px-8 max-w-[1200px] mx-auto left-0 right-0"
        >
          <div className="hero-t1 flex items-center gap-3 mb-5">
            <CategoryBadge label={current.category} overlay />
            <span className="text-white/35 text-xs">·</span>
            <span className="text-white/40 text-xs font-medium">
              {current.readTime}
            </span>
            <span className="text-white/35 text-xs">·</span>
            <span className="text-white/40 text-xs font-medium">
              {current.date}
            </span>
          </div>

          <h1
            className="hero-t2 font-extrabold leading-[1.06] tracking-tight max-w-2xl mb-5"
            style={{
              fontSize: "clamp(28px, 4.5vw, 56px)",
              textShadow: "0 4px 32px rgba(0,0,0,0.4)",
            }}
          >
            {current.title}
          </h1>

          <p className="hero-t3 text-white/55 text-base max-w-xl leading-relaxed mb-8">
            {current.excerpt}
          </p>

          <div className="hero-t4 flex items-center gap-5 flex-wrap mb-8">
            <div className="flex items-center gap-3">
              <img
                src={current.avatar}
                alt={current.author}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7c5cbf]/60 shadow-[0_0_12px_rgba(124,92,191,0.4)]"
              />
              <div>
                <p className="text-white text-sm font-bold leading-none">
                  {current.author}
                </p>
                <p className="text-white/35 text-[11px] mt-0.5">Author</p>
              </div>
            </div>
            <div className="h-5 w-px bg-white/15 hidden sm:block" />
            <button className="flex items-center gap-2.5 bg-white text-[#0e0e1c] text-sm font-bold px-6 py-3 rounded-full hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-200">
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
            <button className="flex items-center gap-2.5 bg-[#7c5cbf]/20 border border-[#7c5cbf]/40 text-[#c4a8f0] text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#7c5cbf]/30 hover:-translate-y-0.5 transition-all duration-200">
              Save for later
            </button>
          </div>

          {/* Nav dots + arrows */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeSlide(i)}
                  className={`rounded-full border-none cursor-pointer transition-all duration-300 ${i === slide ? "w-8 h-[6px] bg-white" : "w-[6px] h-[6px] bg-white/30 hover:bg-white/55"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 ml-1">
              <button
                onClick={() =>
                  changeSlide(
                    (slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
                  )
                }
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:border-white/30"
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
                onClick={() => changeSlide((slide + 1) % HERO_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/15 flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:border-white/30"
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
        </div>
      </section>

      {/* ═══ STATS BAR ═══════════════════════════════════════════════════════ */}
      <div ref={statsRef} className="border-y border-white/[0.05] bg-[#0b0b18]">
        <div className="max-w-[1200px] mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {[
            { value: "120K+", label: "Monthly Readers" },
            { value: "1.4K+", label: "Articles Published" },
            { value: "340+", label: "Expert Writers" },
            { value: "8", label: "Topic Categories" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`reveal reveal-d${i + 1} text-center px-6 py-2`}
            >
              <p className="text-white text-xl font-extrabold tracking-tight">
                {s.value}
              </p>
              <p className="text-white/30 text-[11px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ARTICLES ════════════════════════════════════════════════════════ */}
      <div ref={articlesRef} className="max-w-[1200px] mx-auto px-8 py-20">
        <div className="reveal flex items-end justify-between mb-2 flex-wrap gap-4">
          <div>
            <p className="text-[#7c5cbf] text-[11px] font-bold tracking-[0.22em] uppercase mb-1.5">
              The Quill
            </p>
            <h2 className="text-white text-3xl font-extrabold tracking-tight">
              Latest Articles
            </h2>
          </div>
          <a
            href="/all-posts"
            className="reveal reveal-d2 flex items-center gap-2 text-white/40 text-sm font-semibold hover:text-[#c4a8f0] transition-colors no-underline pb-1 group"
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
          </a>
        </div>

        <p className="reveal text-white/35 text-sm mb-12 max-w-lg leading-relaxed">
          In-depth articles on programming, AI, data science, system design, and
          the ideas shaping the future of technology.
        </p>

        <div className="reveal flex items-center justify-between flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTab(cat)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all duration-200 cursor-pointer ${activeTab === cat ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_4px_20px_rgba(124,92,191,0.4)]" : "bg-transparent border-white/[0.1] text-white/45 hover:border-white/30 hover:text-white/75"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/25 text-xs">Sort:</span>
            <select className="bg-[#16162a] border border-white/[0.09] rounded-xl px-3.5 py-2 text-xs text-white/55 outline-none cursor-pointer focus:border-[#7c5cbf]/50 transition-colors">
              <option value="newest" className="bg-[#1a1a2e]">
                Newest
              </option>
              <option value="oldest" className="bg-[#1a1a2e]">
                Oldest
              </option>
              <option value="popular" className="bg-[#1a1a2e]">
                Popular
              </option>
            </select>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {visible.map((post, i) => (
              <BlogCard key={post.id} post={post} delay={i + 1} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7c5cbf]/10 border border-[#7c5cbf]/20 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
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
              Try a different filter above
            </p>
          </div>
        )}

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
                className={`w-9 h-9 rounded-xl text-sm font-bold border transition-all cursor-pointer ${page === n ? "bg-[#7c5cbf] border-[#7c5cbf] text-white shadow-[0_4px_16px_rgba(124,92,191,0.35)]" : "bg-transparent border-white/10 text-white/40 hover:border-[#7c5cbf]/40 hover:text-white"}`}
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
                  Join thousands of practitioners publishing on tech, science
                  and ideas that matter.
                </p>
                <a
                  href="/add-post"
                  className="inline-flex items-center gap-2 bg-white text-[#0e0e1c] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/92 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.18)] transition-all duration-200 no-underline"
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
                </a>
              </div>
            </div>

            <div className="reveal reveal-d2 relative overflow-hidden rounded-2xl min-h-[160px] group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=700&q=80"
                alt="code"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e1c] via-[#0e0e1c]/80 to-[#0e0e1c]/30" />
              <div className="relative p-7 h-full flex items-center justify-between">
                <div>
                  <p className="text-white/35 text-xs mb-1">
                    Articles Published
                  </p>
                  <p
                    className="text-white font-extrabold tracking-tight leading-none"
                    style={{ fontSize: 50 }}
                  >
                    1.2K
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/35 text-xs mb-1">Writers</p>
                  <p className="text-white font-extrabold text-3xl tracking-tight">
                    340+
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-d3 relative overflow-hidden rounded-2xl min-h-[420px] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&q=80"
              alt="knowledge"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c]/95 via-[#0e0e1c]/35 to-transparent" />
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
              <p className="text-white/45 text-sm leading-relaxed mb-5">
                Every article is written by practitioners who have shipped real
                systems and learned hard lessons along the way.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-[#c4a8f0] text-sm font-semibold hover:gap-3 transition-all no-underline"
              >
                Learn more about us
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
              </a>
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
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            >
              The best tech writing,
              <br />
              in your inbox every Friday.
            </h2>
            <p className="text-white/35 text-sm leading-relaxed">
              No algorithm, no noise. 120,000+ developers get our curated weekly
              roundup.
            </p>
          </div>
          <div className="reveal reveal-d2 w-full md:w-auto md:min-w-[340px] flex gap-2.5">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/[0.06] border border-white/[0.09] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors min-w-0"
            />
            <button className="bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-bold px-5 py-3.5 rounded-xl whitespace-nowrap hover:shadow-[0_6px_24px_rgba(124,92,191,0.45)] hover:-translate-y-0.5 transition-all duration-200">
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
                  THE QUILL
                </span>
              </div>
              <p className="text-white/28 text-[13px] leading-relaxed max-w-[220px]">
                A knowledge platform for developers, engineers, and curious
                minds exploring the frontiers of technology.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <p className="text-white/60 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">
                  {col.title}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-white/28 text-sm no-underline mb-2.5 hover:text-white/75 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
            <div>
              <p className="text-white/60 text-[10px] font-bold tracking-[0.18em] uppercase mb-4">
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
                    className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 text-[10px] font-bold hover:bg-[#7c5cbf]/25 hover:border-[#7c5cbf]/35 hover:text-white/80 transition-all no-underline uppercase"
                  >
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-6 flex items-center justify-between flex-wrap gap-3">
            <span className="text-white/20 text-xs">
              ©2026 The Quill. All rights reserved.
            </span>
            <div className="flex gap-5">
              <a
                href="#"
                className="text-white/20 text-xs no-underline hover:text-white/55 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/20 text-xs no-underline hover:text-white/55 transition-colors"
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
