import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Input from "../components/input";
import FieldLabel from "../components/fieldLabel";
import { RTE } from "../components";
import appwriteService from "../appwrite/post";

const CATEGORIES = [
  "AI & ML",
  "Programming",
  "Data Science",
  "Web Dev",
  "Cybersecurity",
  "Career",
  "Science",
];

export default function AddPost({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isEditMode = !!post;

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(post?.tags || []);
  const [coverPreview, setCoverPreview] = useState(
    post?.featuredImage
      ? appwriteService.getFilePreview(post.featuredImage)
      : null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      slug: post?.$id || "",
      status: post?.status || "Active",
      category: post?.category || "",
      // FIX: initialise to null so RHF "sees" a value in edit mode
      image: isEditMode ? null : undefined,
    },
  });

  const titleValue = watch("title");
  const statusValue = watch("status");
  const categoryValue = watch("category");

  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (!isEditMode && titleValue) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [titleValue, isEditMode, setValue]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      // FIX: use trigger-compatible setValue with shouldValidate + shouldDirty
      setValue("image", e.dataTransfer.files, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setCoverPreview(URL.createObjectURL(file));
    },
    [setValue],
  );

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, "");
      if (t && !tags.includes(t) && tags.length < 8) {
        setTags((prev) => [...prev, t]);
        setTagInput("");
      }
    }
  };
  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      if (isEditMode) {
        let featuredImage = post.featuredImage;
        if (data.image && data.image[0]) {
          const uploaded = await appwriteService.uploadFile(data.image[0]);
          if (uploaded) {
            await appwriteService.deleteFile(post.featuredImage);
            featuredImage = uploaded.$id;
          }
        }
        const updated = await appwriteService.updatePost({
          slug: post.$id,
          title: data.title,
          content: data.content,
          featuredImage,
          status: data.status,
          authorName: post.authorName || userData?.name || "Anonymous",
          category: data.category,
          tags,
        });
        if (updated) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          navigate(`/post/${updated.$id}`);
        }
      } else {
        if (!data.image || !data.image[0]) {
          setSubmitError("Please select a cover image.");
          setSubmitting(false);
          return;
        }
        const uploaded = await appwriteService.uploadFile(data.image[0]);
        if (!uploaded) throw new Error("Image upload failed.");
        const created = await appwriteService.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          featuredImage: uploaded.$id,
          status: data.status,
          userId: userData?.$id,
          authorName: userData?.name || "Anonymous",
          category: data.category,
          tags,
        });
        if (created) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          navigate(`/post/${created.$id}`);
        }
      }
    } catch (err) {
      console.error("AddPost :: onSubmit :: error", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = (getValues("content") || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // FIX: custom validate instead of `required` so RHF checks the actual
  // FileList value — `required` on a file input only checks the raw HTML
  // input element, not the value stored via setValue().
  const imageRegister = register("image", {
    validate: (value) => {
      if (isEditMode) return true; // edit mode: image optional
      if (value && value[0]) return true; // FileList with a file → OK
      return "Cover image is required";
    },
  });

  return (
    <div className="bg-[#0e0e1c] min-h-screen text-white">
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 text-sm font-semibold px-5 py-3 rounded-2xl backdrop-blur-sm shadow-lg">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Post {isEditMode ? "updated" : "published"} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-[1200px] mx-auto px-8 pt-28 pb-20">
          {/* Page header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[#7c5cbf] text-xs font-bold tracking-[0.2em] uppercase mb-1.5">
                {isEditMode ? "Edit" : "Create"}
              </p>
              <h1 className="text-white text-3xl font-extrabold tracking-tight">
                {isEditMode ? "Edit Post" : "New Post"}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/all-posts")}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
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
              Back to All Posts
            </button>
          </div>

          {/* Author identity banner */}
          {userData?.name && (
            <div className="mb-8 flex items-center gap-3 bg-[#16162a] border border-white/[0.07] rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-full bg-[#7c5cbf]/25 border border-[#7c5cbf]/40 flex items-center justify-center text-sm font-bold text-[#c4a8f0] flex-shrink-0">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white/60 text-xs leading-none mb-0.5">
                  {isEditMode ? "Editing as" : "Publishing as"}
                  <span className="text-white font-semibold ml-1.5">
                    {userData.name}
                  </span>
                </p>
                <p className="text-white/25 text-[11px]">
                  This name will appear as the author on your post
                </p>
              </div>
            </div>
          )}

          {submitError && (
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
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            {/* ════ LEFT ════ */}
            <div className="space-y-7">
              {/* Cover Image */}
              <div>
                <FieldLabel label="Cover Image" required={!isEditMode} />
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                    coverPreview
                      ? "border-[#7c5cbf]/40"
                      : "border-white/10 hover:border-[#7c5cbf]/50 bg-[#13132a] cursor-pointer"
                  }`}
                  style={{ minHeight: 200 }}
                  onClick={() =>
                    !coverPreview &&
                    document.getElementById("coverInput").click()
                  }
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("coverInput").click();
                          }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold rounded-xl hover:bg-white/30 transition-all"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverPreview(null);
                            // FIX: clear with shouldValidate so error shows immediately
                            setValue("image", undefined, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          className="px-4 py-2 bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-semibold rounded-xl hover:bg-red-500/50 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#7c5cbf]/15 border border-[#7c5cbf]/25 flex items-center justify-center mb-4">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#c4a8f0"
                          strokeWidth="1.8"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <p className="text-white/60 text-sm font-medium mb-1">
                        Drop your cover image here
                      </p>
                      <p className="text-white/25 text-xs">
                        PNG, JPG, WebP · Max 5MB · 1200×630px recommended
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("coverInput").click();
                        }}
                        className="mt-4 px-5 py-2 bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 text-[#c4a8f0] text-xs font-semibold rounded-xl hover:bg-[#7c5cbf]/30 transition-all"
                      >
                        Browse files
                      </button>
                    </div>
                  )}
                </div>

                {/*
                  FIX: Spread imageRegister directly on the input — this keeps
                  RHF's internal ref+onChange wired up. We layer our own
                  onChange on top via the spread so the preview still updates.
                  Because spread order matters: imageRegister.onChange fires
                  first (updates RHF state), then our extra side-effect runs.
                */}
                <input
                  id="coverInput"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
                  className="hidden"
                  {...imageRegister}
                  onChange={(e) => {
                    // 1️⃣ Let RHF process the FileList (clears the error)
                    imageRegister.onChange(e);
                    // 2️⃣ Update our preview
                    const file = e.target.files?.[0];
                    if (file) setCoverPreview(URL.createObjectURL(file));
                  }}
                />
                {errors.image && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <FieldLabel
                  label="Post Title"
                  required
                  hint={`${(watch("title") || "").length}/120`}
                />
                <Input
                  type="text"
                  placeholder="Write a clear, compelling title..."
                  {...register("title", {
                    required: "Post title is required",
                    maxLength: {
                      value: 120,
                      message: "Title must be under 120 characters",
                    },
                  })}
                  hasError={!!errors.title}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <FieldLabel
                  label="Content"
                  required
                  hint={`${wordCount} words`}
                />
                <RTE
                  name="content"
                  control={control}
                  defaultValue={getValues("content")}
                />
                {errors.content && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* ════ RIGHT ════ */}
            <div className="space-y-6">
              {/* Submit */}
              <div className="bg-[#16162a] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#7c5cbf] hover:bg-[#6a4caa] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,92,191,0.4)] transition-all duration-200"
                >
                  {submitting
                    ? isEditMode
                      ? "Updating..."
                      : "Publishing..."
                    : isEditMode
                      ? "Update Post"
                      : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/all-posts")}
                  className="w-full py-2.5 bg-transparent border border-white/10 text-white/50 text-sm font-semibold rounded-xl hover:border-white/20 hover:text-white/80 transition-all"
                >
                  Cancel
                </button>
              </div>

              {/* Slug */}
              <div className="bg-[#16162a] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <p className="text-white text-sm font-bold flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c4a8f0"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  URL Slug
                </p>
                <div className="flex items-center bg-[#0e0e1c] border border-white/[0.08] rounded-xl overflow-hidden">
                  <input
                    type="text"
                    readOnly
                    placeholder="auto-generated-from-title"
                    className="flex-1 bg-transparent cursor-not-allowed px-3 py-2.5 text-xs text-white/60 placeholder-white/20 outline-none"
                    {...register("slug", { required: true })}
                  />
                </div>
                {errors.slug && (
                  <p className="text-red-400 text-xs mt-1 ml-1">
                    Slug is required — enter a title first
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c4a8f0"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Status
                </p>
                <div className="flex gap-2">
                  {["Active", "Inactive"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValue("status", s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        statusValue === s
                          ? s === "Active"
                            ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-400"
                            : "bg-red-500/20 border-red-500/35 text-red-400"
                          : "bg-transparent border-white/10 text-white/35 hover:text-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c4a8f0"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Category <span className="text-[#c4a8f0]">*</span>
                </p>
                <input
                  type="hidden"
                  {...register("category", {
                    required: "Please select a category",
                  })}
                />
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setValue("category", cat, { shouldValidate: true })
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                        categoryValue === cat
                          ? "bg-[#7c5cbf]/25 border-[#7c5cbf]/45 text-[#c4a8f0]"
                          : "bg-transparent border-white/[0.08] text-white/45 hover:text-white/80 hover:border-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-2 ml-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div className="bg-[#16162a] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-white text-sm font-bold mb-1.5 flex items-center gap-2">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c4a8f0"
                    strokeWidth="2"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  Tags
                </p>
                <p className="text-white/25 text-[11px] mb-3">
                  Press Enter or comma to add · max 8
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1.5 bg-[#7c5cbf]/20 border border-[#7c5cbf]/30 text-[#c4a8f0] text-xs font-semibold px-2.5 py-1 rounded-full"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="text-[#c4a8f0]/50 hover:text-[#c4a8f0] transition-colors leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="e.g. react, typescript, ai..."
                  disabled={tags.length >= 8}
                  className="w-full bg-[#0e0e1c] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-[#7c5cbf]/50 transition-colors disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
