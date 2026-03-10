import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout as logoutSlice } from "../store/features/authSlice";
import authService from "../appwrite/auth";

const NAV_LINKS = [
  { name: "Home", path: "/", active: true },
  { name: "All Posts", path: "/all-posts", active: true },
  { name: "Add Post", path: "/add-post", active: true },
  { name: "Writers", path: "/writers", active: true },
  { name: "About", path: "/about", active: true },
];

/* ─── UserMenu — avatar + dropdown ─────────────────────────────────────── */
function UserMenu({ userData, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const name = userData?.name || "User";
  const email = userData?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all duration-200 group"
      >
        {/* Avatar circle */}
        <div className="w-8 h-8 rounded-full bg-[#7c5cbf]/30 border border-[#7c5cbf]/50 flex items-center justify-center text-[13px] font-bold text-[#c4a8f0] flex-shrink-0 group-hover:border-[#7c5cbf]/80 group-hover:bg-[#7c5cbf]/40 transition-all duration-200">
          {initial}
        </div>
        {/* Name — hidden on small desktop, shown on wider */}
        <span className="hidden lg:block text-white/80 text-sm font-semibold max-w-[120px] truncate group-hover:text-white transition-colors">
          {name}
        </span>
        {/* Chevron */}
        <svg
          className={`hidden lg:block text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-[#16162e] border border-white/[0.09] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          {/* User identity header */}
          <div className="px-4 py-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7c5cbf]/30 border border-[#7c5cbf]/50 flex items-center justify-center text-base font-bold text-[#c4a8f0] flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold leading-none truncate">
                  {name}
                </p>
                <p className="text-white/35 text-[11px] mt-1 truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <NavLink
              to="/add-post"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-white/60 text-sm hover:text-white hover:bg-white/[0.05] transition-all no-underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Write a Post
            </NavLink>
            {/* <NavLink
              to="/all-posts"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-white/60 text-sm hover:text-white hover:bg-white/[0.05] transition-all no-underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              My Posts
            </NavLink> */}
          </div>

          {/* Logout */}
          <div className="border-t border-white/[0.07] py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/80 text-sm hover:text-red-400 hover:bg-red-500/[0.08] transition-all cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────────────────────── */
export default function Header() {
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const logout = () => {
    authService
      .logout()
      .then(() => dispatch(logoutSlice()))
      .catch(console.error);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#13131f]/90 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-5">
        {/* ── Logo ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-widest no-underline"
        >
          <span className="w-2 h-2 rounded-full bg-[#7c5cbf] animate-pulse flex-shrink-0" />
          ZORVIA
        </NavLink>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.active ? (
              <NavLink key={link.name} to={link.path}>
                {({ isActive }) => (
                  <span
                    className={`relative text-sm font-medium pb-1 transition-colors duration-200 cursor-pointer ${isActive ? "text-white" : "text-white/60 hover:text-white/90"}`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#7c5cbf]" />
                    )}
                  </span>
                )}
              </NavLink>
            ) : null,
          )}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2.5">
          {authStatus ? (
            /* ✅ Logged in: show avatar + name + dropdown */
            <UserMenu userData={userData} onLogout={logout} />
          ) : (
            /* Not logged in: show login / signup */
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white/80 bg-white/[0.07] border border-white/[0.12] rounded-lg hover:bg-white/[0.12] hover:border-white/20 hover:-translate-y-px transition-all duration-200 no-underline"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#7c5cbf] rounded-lg hover:bg-[#6a4caa] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(124,92,191,0.4)] transition-all duration-200 no-underline"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-0.5 bg-white/80 rounded transition-all duration-300"
            style={{
              transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none",
            }}
          />
          <span
            className="block w-5 h-0.5 bg-white/80 rounded transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-white/80 rounded transition-all duration-300"
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translate(4px,-4px)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-[#13131f]/97 backdrop-blur-md border-t border-white/[0.08] px-6 pb-6">
          {/* Nav links */}
          <div className="py-2">
            {NAV_LINKS.map((link) =>
              link.active ? (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <div
                      className={`relative py-3 border-b border-white/[0.06] text-[15px] font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#7c5cbf]" />
                      )}
                      <span className={isActive ? "pl-3" : ""}>
                        {link.name}
                      </span>
                      {isActive && (
                        <span className="absolute inset-0 bg-[#7c5cbf]/8 rounded-md -z-10" />
                      )}
                    </div>
                  )}
                </NavLink>
              ) : null,
            )}
          </div>

          {/* Auth section */}
          {authStatus ? (
            /* ✅ Logged in mobile: show user identity + sign out */
            <div className="mt-4">
              {/* User identity card */}
              <div className="flex items-center gap-3 bg-[#1e1e35] border border-white/[0.07] rounded-xl px-4 py-3.5 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#7c5cbf]/30 border border-[#7c5cbf]/50 flex items-center justify-center text-base font-bold text-[#c4a8f0] flex-shrink-0">
                  {(userData?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold leading-none truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-white/35 text-[11px] mt-0.5 truncate">
                    {userData?.email || ""}
                  </p>
                </div>
              </div>
              {/* Sign out */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 text-sm font-semibold text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-xl hover:bg-red-500/15 transition-all cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            /* Not logged in mobile: show login / signup */
            <div className="flex gap-2.5 mt-4">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white/80 bg-white/[0.07] border border-white/[0.12] rounded-lg hover:bg-white/[0.12] transition-all no-underline"
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#7c5cbf] rounded-lg hover:bg-[#6a4caa] transition-all no-underline"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
