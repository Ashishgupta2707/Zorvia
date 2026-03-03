import { useState, useRef } from "react";

const CATEGORIES = ["AI & ML", "Programming", "Data Science", "Web Dev", "Cybersecurity", "Career", "Science"];

/* ─── Tiny Rich Text Toolbar ─────────────────────────────────────────────── */
const TOOLBAR_ACTIONS = [
  { label: "B",      cmd: "bold",           title: "Bold",          style: "font-bold" },
  { label: "I",      cmd: "italic",         title: "Italic",        style: "italic" },
  { label: "U",      cmd: "underline",      title: "Underline",     style: "underline" },
  { label: "S",      cmd: "strikeThrough",  title: "Strikethrough", style: "line-through" },
];
const TOOLBAR_BLOCKS = [
  { label: "H1", cmd: "formatBlock", val: "h1", title: "Heading 1" },
  { label: "H2", cmd: "formatBlock", val: "h2", title: "Heading 2" },
  { label: "H3", cmd: "formatBlock", val: "h3", title: "Heading 3" },
  { label: "¶",  cmd: "formatBlock", val: "p",  title: "Paragraph" },
];
const TOOLBAR_LISTS = [
  { label: "≡", cmd: "insertUnorderedList", title: "Bullet list" },
  { label: "1.", cmd: "insertOrderedList",   title: "Numbered list" },
];
const TOOLBAR_EXTRAS = [
  { label: "\"", cmd: "formatBlock", val: "blockquote", title: "Blockquote" },
  { label: "</>",cmd: "formatBlock", val: "pre",        title: "Code block" },
];

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML || "");
  };

  const ToolBtn = ({ label, title, onClick, style = "" }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-8 h-7 flex items-center justify-center text-xs text-white/60 hover:text-white hover:bg-white/10 rounded transition-all ${style}`}
    >{label}</button>
  );

  return (
    <div className="border border-white/[0.09] rounded-xl overflow-hidden focus-within:border-[#7c5cbf]/60 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-[#1a1a2e] border-b border-white/[0.07] flex-wrap">
        {TOOLBAR_ACTIONS.map(b => (
          <ToolBtn key={b.cmd} label={b.label} title={b.title} style={b.style} onClick={() => exec(b.cmd)} />
        ))}
        <span className="w-px h-5 bg-white/10 mx-1.5" />
        {TOOLBAR_BLOCKS.map(b => (
          <ToolBtn key={b.label} label={b.label} title={b.title} onClick={() => exec(b.cmd, b.val)} />
        ))}
        <span className="w-px h-5 bg-white/10 mx-1.5" />
        {TOOLBAR_LISTS.map(b => (
          <ToolBtn key={b.label} label={b.label} title={b.title} onClick={() => exec(b.cmd)} />
        ))}
        <span className="w-px h-5 bg-white/10 mx-1.5" />
        {TOOLBAR_EXTRAS.map(b => (
          <ToolBtn key={b.label} label={b.label} title={b.title} onClick={() => exec(b.cmd, b.val)} />
        ))}
        <span className="w-px h-5 bg-white/10 mx-1.5" />
        <ToolBtn label="↩" title="Undo" onClick={() => exec("undo")} />
        <ToolBtn label="↪" title="Redo" onClick={() => exec("redo")} />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        className="min-h-[280px] p-5 text-sm text-white/80 leading-relaxed outline-none bg-[#13132a]"
        style={{
          caretColor: "#c4a8f0",
        }}
        data-placeholder="Write your post content here..."
      />

      {/* Editor styles injected via a style tag workaround */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.2);
          pointer-events: none;
        }
        [contenteditable] h1 { font-size: 1.6rem; font-weight: 800; margin: 1rem 0 .5rem; color: #fff; }
        [contenteditable] h2 { font-size: 1.3rem; font-weight: 700; margin: .9rem 0 .4rem; color: #fff; }
        [contenteditable] h3 { font-size: 1.1rem; font-weight: 600; margin: .8rem 0 .4rem; color: #e0d0ff; }
        [contenteditable] p  { margin: .5rem 0; }
        [contenteditable] blockquote { border-left: 3px solid #7c5cbf; padding-left: 1rem; color: rgba(255,255,255,.55); margin: .75rem 0; font-style: italic; }
        [contenteditable] pre { background: rgba(124,92,191,.1); border: 1px solid rgba(124,92,191,.2); border-radius: 8px; padding: .75rem 1rem; font-family: monospace; font-size: .85rem; color: #c4a8f0; margin: .75rem 0; white-space: pre-wrap; }
        [contenteditable] ul  { list-style: disc; padding-left: 1.5rem; margin: .5rem 0; }
        [contenteditable] ol  { list-style: decimal; padding-left: 1.5rem; margin: .5rem 0; }
        [contenteditable] strong { font-weight: 700; color: #fff; }
      `}</style>
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────────────────────────── */
function Field({ label, hint, required, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-white/80">
          {label} {required && <span className="text-[#c4a8f0]">*</span>}
        </label>
        {hint && <span className="text-[11px] text-white/30">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────────────────── */
function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-[#13132a] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors ${className}`}
    />
  );
}

/* ─── AddPost Page ───────────────────────────────────────────────────────── */
export default function AddPost() {
  const [form, setForm] = useState({
    title:       "",
    category:    "",
    tags:        "",
    excerpt:     "",
    content:     "",
    coverImage:  null,
    coverPreview:null,
    status:      "Published",
    metaTitle:   "",
    metaDesc:    "",
    slug:        "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags]         = useState([]);
  const [saved, setSaved]       = useState(false);
  const fileRef                 = useRef(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  /* Auto-generate slug from title */
  const handleTitle = (val) => {
    set("title", val);
    set("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    if (!form.metaTitle) set("metaTitle", val);
  };

  /* Cover image */
  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("coverImage", file);
    set("coverPreview", URL.createObjectURL(file));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    set("coverImage", file);
    set("coverPreview", URL.createObjectURL(file));
  };

  /* Tags */
  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");
      if (t && !tags.includes(t) && tags.length < 8) {
        setTags([...tags, t]);
        setTagInput("");
      }
    }
  };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  /* Submit */
  const handleSubmit = (status) => {
    set("status", status);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const wordCount = form.content.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">

      {/* Success toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 text-sm font-semibold px-5 py-3 rounded-2xl backdrop-blur-sm shadow-lg au1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Post saved successfully!
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-20">

        {/* ── Page heading ── */}
        <div className="au1 flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-1.5">Create</p>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">New Post</h1>
          </div>
          <a href="/all-posts" className="flex items-center gap-2 text-white/50 hover:text-white text-sm no-underline transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            Back to All Posts
          </a>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">

          {/* ══ LEFT — Main form ══ */}
          <div className="space-y-7">

            {/* Cover image upload */}
            <div className="au2">
              <Field label="Cover Image" required>
                <div
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => !form.coverPreview && fileRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                    form.coverPreview
                      ? "border-[#7c5cbf]/40 cursor-default"
                      : "border-white/10 hover:border-[#7c5cbf]/50 cursor-pointer bg-[#13132a]"
                  }`}
                  style={{ minHeight: 200 }}
                >
                  {form.coverPreview ? (
                    <>
                      <img src={form.coverPreview} alt="cover" className="w-full h-52 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-xl hover:bg-white/30 transition-all">
                          Replace
                        </button>
                        <button type="button" onClick={() => { set("coverImage", null); set("coverPreview", null); }}
                          className="px-4 py-2 bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl hover:bg-red-500/50 transition-all">
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 flex items-center justify-center mb-4">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c4a8f0" strokeWidth="1.8">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <p className="text-white/60 text-sm font-medium mb-1">Drop your cover image here</p>
                      <p className="text-white/25 text-xs">PNG, JPG, WebP · Max 5MB · 1200×630px recommended</p>
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="mt-4 px-5 py-2 bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 text-[#c4a8f0] text-xs font-semibold rounded-xl hover:bg-[#7c5cbf]/30 transition-all">
                        Browse files
                      </button>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
                </div>
              </Field>
            </div>

            {/* Title */}
            <div className="au3">
              <Field label="Post Title" required hint={`${form.title.length}/120`}>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleTitle(e.target.value)}
                  maxLength={120}
                  placeholder="Write a clear, compelling title..."
                  className="w-full bg-[#13132a] border border-white/[0.09] rounded-xl px-4 py-3.5 text-white text-lg font-semibold placeholder-white/20 outline-none focus:border-[#7c5cbf]/60 transition-colors"
                />
              </Field>
            </div>

            {/* Excerpt */}
            <div className="au4">
              <Field label="Short Excerpt" hint={`${form.excerpt.length}/200`}>
                <textarea
                  value={form.excerpt}
                  onChange={e => set("excerpt", e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="A short summary shown on post cards and search results..."
                  className="w-full bg-[#13132a] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#7c5cbf]/60 transition-colors resize-none leading-relaxed"
                />
              </Field>
            </div>

            {/* Content editor */}
            <div className="au5">
              <Field label="Content" required hint={`${wordCount} words`}>
                <RichEditor value={form.content} onChange={v => set("content", v)} />
              </Field>
            </div>
          </div>

          {/* ══ RIGHT — Sidebar settings ══ */}
          <div className="space-y-6">

            {/* Publish card */}
            <div className="au2 bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a8f0" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Publish Settings
              </p>

              {/* Status toggle */}
              <div className="flex gap-2 mb-5">
                {["Published", "Draft"].map(s => (
                  <button key={s} type="button" onClick={() => set("status", s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.status === s
                        ? s === "Published"
                          ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                          : "bg-amber-500/20 border-amber-500/35 text-amber-400"
                        : "bg-transparent border-white/10 text-white/35 hover:text-white/60"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <button type="button" onClick={() => handleSubmit(form.status)}
                  className="w-full py-3 bg-[#7c5cbf] hover:bg-[#6a4caa] text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,191,0.4)] transition-all duration-200">
                  {form.status === "Published" ? "Publish Post" : "Save as Draft"}
                </button>
                <button type="button" onClick={() => handleSubmit("Draft")}
                  className="w-full py-2.5 bg-transparent border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:border-white/20 hover:text-white/80 transition-all">
                  Save Draft
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="au3 bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a8f0" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                Category <span className="text-[#c4a8f0]">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => set("category", cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                      form.category === cat
                        ? "bg-[#7c5cbf]/25 border-[#7c5cbf]/45 text-[#c4a8f0]"
                        : "bg-transparent border-white/[0.08] text-white/45 hover:text-white/80 hover:border-white/20"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="au4 bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-white text-sm font-bold mb-1.5 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a8f0" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                Tags
              </p>
              <p className="text-white/25 text-[11px] mb-3">Press Enter or comma to add · max 8</p>

              {/* Tag chips */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1.5 bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 text-[#c4a8f0] text-xs font-semibold px-2.5 py-1 rounded-full">
                      #{t}
                      <button type="button" onClick={() => removeTag(t)} className="text-[#c4a8f0]/50 hover:text-[#c4a8f0] transition-colors leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="e.g. react, typescript, ai..."
                disabled={tags.length >= 8}
                className="w-full bg-[#0e0e1c] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7c5cbf]/50 transition-colors disabled:opacity-40"
              />
            </div>

            {/* SEO */}
            <div className="au5 bg-[#16162a] border border-white/[0.08] rounded-2xl p-5 space-y-4">
              <p className="text-white text-sm font-bold flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4a8f0" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                SEO Settings
              </p>

              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block">URL Slug</label>
                <div className="flex items-center bg-[#0e0e1c] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-[#7c5cbf]/50 transition-colors">
                  <span className="text-white/20 text-xs px-3 border-r border-white/[0.07] py-2.5 flex-shrink-0">/post/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => set("slug", e.target.value)}
                    placeholder="post-url-slug"
                    className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block">
                  Meta Title <span className="text-white/25 font-normal">({form.metaTitle.length}/60)</span>
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={e => set("metaTitle", e.target.value)}
                  maxLength={60}
                  placeholder="SEO page title..."
                  className="w-full bg-[#0e0e1c] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7c5cbf]/50 transition-colors"
                />
                {/* Meta title progress bar */}
                <div className="mt-1.5 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    form.metaTitle.length > 55 ? "bg-red-400" : form.metaTitle.length > 40 ? "bg-amber-400" : "bg-emerald-500"
                  }`} style={{ width: `${Math.min(100, (form.metaTitle.length / 60) * 100)}%` }} />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block">
                  Meta Description <span className="text-white/25 font-normal">({form.metaDesc.length}/160)</span>
                </label>
                <textarea
                  value={form.metaDesc}
                  onChange={e => set("metaDesc", e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Brief description for search engines..."
                  className="w-full bg-[#0e0e1c] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7c5cbf]/50 transition-colors resize-none"
                />
                <div className="mt-1.5 h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    form.metaDesc.length > 150 ? "bg-red-400" : form.metaDesc.length > 120 ? "bg-amber-400" : "bg-emerald-500"
                  }`} style={{ width: `${Math.min(100, (form.metaDesc.length / 160) * 100)}%` }} />
                </div>
              </div>

              {/* SERP preview */}
              {(form.metaTitle || form.title) && (
                <div className="bg-[#0e0e1c] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-white/25 text-[10px] font-bold tracking-wider uppercase mb-2.5">Search Preview</p>
                  <p className="text-[#8ab4f8] text-sm font-medium leading-tight mb-0.5 line-clamp-1">
                    {form.metaTitle || form.title || "Page title"}
                  </p>
                  <p className="text-[#34a853] text-[11px] mb-1">thequill.com/post/{form.slug || "post-slug"}</p>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                    {form.metaDesc || form.excerpt || "Add a meta description to preview how this post will appear in search results."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}