import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/post";

const CAT_COLOR = {
  "AI & ML": "bg-violet-500/15  text-violet-400  border-violet-500/25",
  Programming: "bg-blue-500/15    text-blue-400    border-blue-500/25",
  "Data Science": "bg-cyan-500/15    text-cyan-400    border-cyan-500/25",
  "Web Dev": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Cybersecurity: "bg-red-500/15     text-red-400     border-red-500/25",
  Career: "bg-amber-500/15   text-amber-400   border-amber-500/25",
  Science: "bg-pink-500/15    text-pink-400    border-pink-500/25",
};

const STATUS_STYLE = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Inactive: "bg-red-500/15    text-red-400    border-red-500/25",
};

/* ─── Delete Modal ───────────────────────────────────────────────────────── */
function DeleteModal({ onConfirm, onCancel, deleting }) {
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
          Delete this post?
        </h3>
        <p className="text-white/45 text-sm text-center leading-relaxed mb-6">
          This action is permanent and cannot be undone.
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

/* ─── PostDetail ─────────────────────────────────────────────────────────── */
export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    appwriteService
      .getPost(slug)
      .then((data) => {
        if (data) setPost(data);
        else setError("Post not found.");
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [slug]);

  const isAuthor = post && userData && post.userId === userData.$id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await appwriteService.deletePost(post.$id);
      if (post.featuredImage)
        await appwriteService.deleteFile(post.featuredImage);
      navigate("/all-posts");
    } catch (err) {
      console.error(err);
      setError("Failed to delete post.");
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const wordCount = (post?.content || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-[#0e0e1c] min-h-screen text-white">
        <div className="max-w-[860px] mx-auto px-8 pt-28 pb-20 animate-pulse space-y-6">
          <div className="h-4 w-24 bg-white/[0.07] rounded" />
          <div className="h-10 w-3/4 bg-white/[0.07] rounded-xl" />
          <div className="h-5 w-1/2 bg-white/[0.05] rounded" />
          <div className="h-[400px] bg-white/[0.06] rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-white/[0.05] rounded"
                style={{ width: `${85 + Math.random() * 15}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="bg-[#0e0e1c] min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">
            {error || "Post not found"}
          </h2>
          <p className="text-white/40 text-sm mb-6">
            The post you're looking for doesn't exist or was removed.
          </p>
          <button
            onClick={() => navigate("/all-posts")}
            className="px-5 py-2.5 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-semibold rounded-xl transition-all"
          >
            Back to All Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {showDelete && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          deleting={deleting}
        />
      )}

      {/* Hero cover */}
      {post.featuredImage && (
        <div className="relative w-full h-[420px] overflow-hidden">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1c] via-[#0e0e1c]/60 to-transparent" />
        </div>
      )}

      <div
        className={`max-w-[860px] mx-auto px-8 pb-24 ${post.featuredImage ? "-mt-32 relative z-10" : "pt-28"}`}
      >
        {/* Back + author actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          {isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/edit-post/${post.$id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 text-[#c4a8f0] text-xs font-semibold rounded-xl hover:bg-[#7c5cbf]/30 transition-all"
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
                Edit Post
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-500/25 transition-all"
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
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Meta badges */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {post.category && (
            <span
              className={`text-[11px] font-bold tracking-wider uppercase border rounded-lg px-2.5 py-1 ${CAT_COLOR[post.category] || "bg-white/10 text-white/50 border-white/10"}`}
            >
              {post.category}
            </span>
          )}
          {post.status && (
            <span
              className={`text-[11px] font-semibold border rounded-lg px-2.5 py-1 ${STATUS_STYLE[post.status] || ""}`}
            >
              {post.status}
            </span>
          )}
          <span className="text-[11px] text-white/30 bg-white/[0.05] border border-white/[0.07] rounded-lg px-2.5 py-1">
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* ✅ Author + date row — elegant byline */}
        <div className="flex items-center gap-4 flex-wrap mb-6 pb-6 border-b border-white/[0.08]">
          {/* Author avatar + name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7c5cbf]/25 border border-[#7c5cbf]/40 flex items-center justify-center text-sm font-bold text-[#c4a8f0] flex-shrink-0">
              {post.authorName ? post.authorName.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">
                {post.authorName || "Unknown Author"}
              </p>
              <p className="text-white/35 text-xs mt-0.5">Author</p>
            </div>
          </div>

          <span className="w-px h-8 bg-white/[0.08] hidden sm:block" />

          {/* Date */}
          <div className="flex items-center gap-1.5 text-white/35 text-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(post.$createdAt)}
          </div>

          {post.$updatedAt !== post.$createdAt && (
            <span className="text-white/20 text-xs">
              · Updated {formatDate(post.$updatedAt)}
            </span>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <>
              <span className="w-px h-4 bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#c4a8f0]/70 bg-[#7c5cbf]/10 border border-[#7c5cbf]/15 rounded-full px-2.5 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content body */}
        <div
          className="prose-post mt-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
          ref={(el) => {
            if (el && window.Prism) window.Prism.highlightAllUnder(el);
          }}
        />

        {/* Bottom nav */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate("/all-posts")}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            All Posts
          </button>
          {isAuthor && (
            <button
              onClick={() => navigate(`/edit-post/${post.$id}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,191,0.4)] transition-all duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit this Post
            </button>
          )}
        </div>
      </div>

      {/* Prism.js syntax highlighting */}
      {!document.getElementById("prism-css") &&
        (() => {
          const link = document.createElement("link");
          link.id = "prism-css";
          link.rel = "stylesheet";
          link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
          document.head.appendChild(link);
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js";
          script.onload = () => {
            const al = document.createElement("script");
            al.src =
              "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
            document.body.appendChild(al);
          };
          document.body.appendChild(script);
          return null;
        })()}

      <style>{`
        .prose-post { color: rgba(255,255,255,0.75); font-size: 1rem; line-height: 1.85; }
        .prose-post h1 { font-size: 2rem;  font-weight: 800; color: #fff; margin: 2rem 0 1rem; }
        .prose-post h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 1.75rem 0 .85rem; }
        .prose-post h3 { font-size: 1.2rem; font-weight: 600; color: #e0d0ff; margin: 1.5rem 0 .75rem; }
        .prose-post p  { margin: 0 0 1.1rem; }
        .prose-post a  { color: #c4a8f0; text-decoration: underline; text-underline-offset: 3px; }
        .prose-post a:hover { color: #fff; }
        .prose-post strong { font-weight: 700; color: #fff; }
        .prose-post em { color: rgba(255,255,255,0.65); }
        .prose-post ul { list-style: disc;    padding-left: 1.6rem; margin: 1rem 0; }
        .prose-post ol { list-style: decimal; padding-left: 1.6rem; margin: 1rem 0; }
        .prose-post li { margin-bottom: .4rem; }
        .prose-post blockquote {
          border-left: 3px solid #7c5cbf; padding: .5rem 1.25rem; margin: 1.5rem 0;
          color: rgba(255,255,255,.5); font-style: italic;
          background: rgba(124,92,191,.06); border-radius: 0 8px 8px 0;
        }
        .prose-post pre[class*="language-"] {
          background: #1a1a35 !important; border: 1px solid rgba(124,92,191,0.3) !important;
          border-radius: 10px !important; padding: 1.1rem 1.25rem !important;
          margin: 1.5rem 0 !important; overflow-x: auto; font-size: .875rem; line-height: 1.65; position: relative;
        }
        .prose-post pre[class*="language-"]::before {
          content: attr(data-language); position: absolute; top: 0.5rem; right: 0.75rem;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(196,168,240,0.5); font-family: sans-serif;
        }
        .prose-post pre[class*="language-"] code {
          background: transparent !important; padding: 0 !important; border-radius: 0 !important;
          font-size: inherit; color: inherit;
          font-family: 'JetBrains Mono','Fira Code','Consolas',monospace;
        }
        .prose-post :not(pre) > code {
          background: rgba(124,92,191,.18); color: #c4a8f0; padding: .15em .45em;
          border-radius: 4px; font-size: .875em; font-family: 'JetBrains Mono','Fira Code',monospace;
        }
        .prose-post img { max-width: 100%; border-radius: 12px; margin: 1.5rem 0; border: 1px solid rgba(255,255,255,.08); }
        .prose-post table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: .9rem; }
        .prose-post th { background: rgba(124,92,191,.15); color: #c4a8f0; font-weight: 600; text-align: left; padding: .65rem 1rem; border: 1px solid rgba(255,255,255,.08); }
        .prose-post td { padding: .6rem 1rem; border: 1px solid rgba(255,255,255,.06); color: rgba(255,255,255,.7); }
        .prose-post tr:nth-child(even) td { background: rgba(255,255,255,.02); }
        .prose-post hr { border: none; border-top: 1px solid rgba(255,255,255,.08); margin: 2rem 0; }
        .token.comment,.token.prolog,.token.doctype,.token.cdata { color: rgba(255,255,255,0.3); }
        .token.keyword,.token.selector { color: #c4a8f0; }
        .token.string,.token.attr-value { color: #a8d8a8; }
        .token.function { color: #79c0ff; }
        .token.number,.token.boolean { color: #f8a4a4; }
        .token.operator { color: rgba(255,255,255,0.7); }
        .token.class-name { color: #ffd580; }
        .token.punctuation { color: rgba(255,255,255,0.45); }
      `}</style>
    </div>
  );
}
