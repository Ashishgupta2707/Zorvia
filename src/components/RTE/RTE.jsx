import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import environment from "../../config/config";

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-sm font-semibold text-white/80">
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={environment.tinyApiKey}
            initialValue={defaultValue}
            init={{
              height: 580,
              menubar: true,

              // ── Dark theme ────────────────────────────────────────────────
              skin: "oxide-dark",
              content_css: "dark",

              // ── Plugins ───────────────────────────────────────────────────
              // Added: codesample (syntax-highlighted blocks like Medium)
              //        code (raw HTML view)
              //        quickbars (floating toolbar on selection like Medium)
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code", // raw HTML editor
                "codesample", // ← syntax-highlighted code blocks (like Medium)
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
                "quickbars", // ← floating toolbar on text selection (like Medium)
              ],

              // ── Toolbar ───────────────────────────────────────────────────
              // codesample button inserts a highlighted code block with language picker
              toolbar:
                "undo redo | blocks | " +
                "bold italic underline strikethrough | forecolor | " +
                "alignleft aligncenter alignright | " +
                "bullist numlist | blockquote | " +
                "codesample | link image | " + // ← codesample = Medium-style code block
                "removeformat | fullscreen | help",

              // ── Floating quickbar (appears when text is selected) ─────────
              // This is Medium's signature UX — select text → toolbar pops up
              quickbars_selection_toolbar:
                "bold italic | link | blockquote codesample",
              quickbars_insert_toolbar: false, // disable the + insert bar

              // ── Code sample languages ─────────────────────────────────────
              codesample_languages: [
                { text: "JavaScript", value: "javascript" },
                { text: "TypeScript", value: "typescript" },
                { text: "JSX / TSX", value: "jsx" },
                { text: "HTML", value: "markup" },
                { text: "CSS", value: "css" },
                { text: "Python", value: "python" },
                { text: "Bash / Shell", value: "bash" },
                { text: "JSON", value: "json" },
                { text: "SQL", value: "sql" },
                { text: "Java", value: "java" },
                { text: "C / C++", value: "cpp" },
                { text: "Rust", value: "rust" },
                { text: "Go", value: "go" },
              ],

              // ── Global content style ──────────────────────────────────────
              content_style: `
                body {
                  font-family: Helvetica, Arial, sans-serif;
                  font-size: 15px;
                  background-color: #13132a;
                  color: rgba(255, 255, 255, 0.82);
                  padding: 1.25rem 1.5rem;
                  line-height: 1.8;
                  max-width: 100%;
                }

                /* ── Headings ── */
                h1, h2, h3, h4, h5, h6 { color: #ffffff; font-weight: 700; margin: 1.5rem 0 0.6rem; }
                h1 { font-size: 2rem; }
                h2 { font-size: 1.5rem; }
                h3 { font-size: 1.2rem; color: #e0d0ff; }

                /* ── Paragraph & links ── */
                p  { margin: 0 0 1rem; }
                a  { color: #c4a8f0; text-decoration: underline; text-underline-offset: 3px; }

                /* ── Blockquote (Medium style) ── */
                blockquote {
                  border-left: 3px solid #7c5cbf;
                  margin: 1.5rem 0;
                  padding: 0.5rem 1.25rem;
                  color: rgba(255,255,255,0.55);
                  font-style: italic;
                  background: rgba(124,92,191,0.06);
                  border-radius: 0 8px 8px 0;
                }

                /* ── Inline code ── */
                code {
                  background: rgba(124,92,191,0.18);
                  color: #c4a8f0;
                  padding: 0.15em 0.45em;
                  border-radius: 4px;
                  font-size: 0.875em;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                }

                /* ── Code BLOCK (codesample plugin renders a <pre><code>) ── */
                pre[class*="language-"],
                pre.language-markup {
                  background: #1a1a35 !important;
                  border: 1px solid rgba(124,92,191,0.25) !important;
                  border-radius: 10px !important;
                  padding: 1.1rem 1.25rem !important;
                  margin: 1.5rem 0 !important;
                  overflow-x: auto;
                  font-size: 0.875rem;
                  line-height: 1.65;
                }
                pre code {
                  background: transparent !important;
                  padding: 0 !important;
                  border-radius: 0 !important;
                  color: #c4a8f0;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                }

                /* ── Lists ── */
                ul { list-style: disc;    padding-left: 1.6rem; margin: 1rem 0; }
                ol { list-style: decimal; padding-left: 1.6rem; margin: 1rem 0; }
                li { margin-bottom: 0.4rem; }

                /* ── Table ── */
                table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
                th {
                  background: rgba(124,92,191,0.15);
                  color: #c4a8f0;
                  font-weight: 600;
                  padding: 0.65rem 1rem;
                  border: 1px solid rgba(255,255,255,0.08);
                  text-align: left;
                }
                td {
                  padding: 0.6rem 1rem;
                  border: 1px solid rgba(255,255,255,0.06);
                  color: rgba(255,255,255,0.7);
                }
                tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

                /* ── Images ── */
                img {
                  max-width: 100%;
                  border-radius: 10px;
                  margin: 1.25rem 0;
                  border: 1px solid rgba(255,255,255,0.07);
                }

                /* ── HR ── */
                hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2rem 0; }
              `,

              promotion: false,
              branding: false,

              // Allow the codesample CSS to also load in the preview pane
              codesample_global_prismjs: true,
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
