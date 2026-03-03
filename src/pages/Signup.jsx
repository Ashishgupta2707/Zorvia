import { useState } from "react";
import { NavLink } from "react-router-dom";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&q=80",
    title: "Capturing Moments,",
    subtitle: "Creating Memories",
  },
  {
    image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=900&q=80",
    title: "Sharing Stories,",
    subtitle: "Building Community",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
    title: "Inspiring Minds,",
    subtitle: "Changing Lives",
  },
];

// ── Reusable input styled with Tailwind ──
function AuthInput({ type = "text", placeholder, className = "", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-white/[0.07] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#7c5cbf] focus:bg-[#7c5cbf]/10 transition-all duration-200 ${className}`}
      {...props}
    />
  );
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6">
      <div className="w-full max-w-[900px]">

        {/* ── Card ── */}
        <div className="flex rounded-2xl overflow-hidden min-h-[580px] shadow-[0_40px_90px_rgba(0,0,0,0.55)]">

          {/* ════════ LEFT IMAGE PANEL ════════ */}
          <div className="hidden md:block relative w-[46%] flex-shrink-0">
            {/* Slide image */}
            <img
              key={slideIndex}
              src={SLIDES[slideIndex].image}
              alt="visual"
              className="img-slide absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08061a]/90 via-[#08061a]/30 to-transparent" />

            {/* Top bar */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="text-white font-bold text-[17px] tracking-widest">THE QUILL</span>
              <NavLink
                to={'/'}
                className="inline-flex items-center gap-1.5 bg-white/[0.12] hover:bg-white/[0.18] text-white/85 text-[13px] rounded-full px-4 py-1.5 no-underline transition-colors duration-200"
              >
                Back to website →
              </NavLink>
            </div>

            {/* Bottom text + dots */}
            <div className="absolute bottom-8 left-6 right-6">
              <h2 className="text-white text-2xl font-bold leading-snug mb-4">
                {SLIDES[slideIndex].title}<br />{SLIDES[slideIndex].subtitle}
              </h2>
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1 rounded-full border-none cursor-pointer transition-all duration-200 ${
                      i === slideIndex ? "w-8 bg-white" : "w-5 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ════════ RIGHT FORM PANEL ════════ */}
          <div className="flex-1 bg-[#252538] flex flex-col justify-center px-10 py-11">

            <h1 className="au1 text-white text-3xl font-bold leading-tight mb-1.5">
              Create an account
            </h1>
            <p className="au2 text-white/40 text-sm mb-7">
              Already have an account?{" "}
              <a href="/login" className="text-[#a07de0] font-medium no-underline hover:text-[#c4a8f0] transition-colors">
                Log in
              </a>
            </p>

            {/* First + Last name */}
            <div className="au3 grid grid-cols-2 gap-3 mb-3.5">
              <AuthInput type="text" placeholder="First name" />
              <AuthInput type="text" placeholder="Last name" />
            </div>

            {/* Email */}
            <div className="au4 mb-3.5">
              <AuthInput type="email" placeholder="Email" />
            </div>

            {/* Password */}
            <div className="au5 relative mb-5">
              <AuthInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer flex items-center p-0"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Terms checkbox */}
            <div className="au5 flex items-center gap-2.5 mb-6">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  agreed
                    ? "bg-[#7c5cbf] border-[#7c5cbf]"
                    : "bg-white/[0.06] border-white/20"
                }`}
              >
                {agreed && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                )}
              </div>
              <span className="text-white/45 text-[13px]">
                I agree to the{" "}
                <a href="#" className="text-[#a07de0] no-underline hover:text-[#c4a8f0] transition-colors">
                  Terms &amp; Conditions
                </a>
              </span>
            </div>

            {/* Submit */}
            <button className="au6 w-full bg-[#7c5cbf] hover:bg-[#6a4caa] text-white font-semibold text-[15px] rounded-xl py-3.5 mb-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,92,191,0.45)] active:translate-y-0 transition-all duration-200 cursor-pointer border-none">
              Create account
            </button>

            {/* Divider */}
            <div className="au7 flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/35 text-xs">Or register with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social buttons */}
            <div className="au8 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-white/85 text-sm font-medium rounded-xl py-3 hover:-translate-y-px transition-all duration-200 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-white/85 text-sm font-medium rounded-xl py-3 hover:-translate-y-px transition-all duration-200 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}