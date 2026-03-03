import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
    active: true,
  },
  {
    name: "All Posts",
    path: "/all-posts",
    active: true,
  },
  {
    name: "AddPost",
    path: "/add-post",
    active: true,
  },
  {
    name: "Writers",
    path: "/writers",
    active: true,
  },
  {
    name: "About",
    path: "/about",
    active: true,
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-5 transition-all duration-300">
        {/* ── Logo ── */}
        <NavLink
          to={"/"}
          className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-widest no-underline"
        >
          <span className="w-2 h-2 rounded-full bg-[#7c5cbf] animate-pulse-dot flex-shrink-0" />
          THE QUILL
        </NavLink>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            if (link.active) {
              return (
                <NavLink key={link.name} to={link.path}>
                  {({ isActive }) => (
                    <button
                      className={`relative text-sm font-medium pb-1 transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                        isActive
                          ? "text-white"
                          : "text-white hover:text-white/80"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#7c5cbf]" />
                      )}
                    </button>
                  )}
                </NavLink>
              );
            }
          })}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2.5">
          <NavLink
            to={"/login"}
            className="px-4 py-2 text-sm font-medium text-white bg-white/30 border border-white/[0.12] rounded-lg hover:bg-white/[0.12] hover:border-white/20 hover:-translate-y-px transition-all duration-200 no-underline"
          >
            Log in
          </NavLink>
          <NavLink
            to={"/signup"}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#7c5cbf] rounded-lg hover:bg-[#6a4caa] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(124,92,191,0.4)] transition-all duration-200 no-underline"
          >
            Get Started
          </NavLink>
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
        <div className="md:hidden bg-[#13131f]/95 backdrop-blur-md border-t border-white/[0.08] px-6 pb-6 animate-fade-up-1">
          {NAV_LINKS.map((link) =>
            link.active ? (
              <NavLink key={link.name}>
                {({ isActive }) => (
                  <div
                    className={`relative py-3 border-b border-white/[0.06] text-[15px] font-medium transition-colors duration-200 ${
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {/* Active left bar indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#7c5cbf]" />
                    )}
                    <span className={isActive ? "pl-3" : ""}>{link.name}</span>
                    {/* Active background glow */}
                    {isActive && (
                      <span className="absolute inset-0 bg-[#7c5cbf]/10 rounded-md -z-10" />
                    )}
                  </div>
                )}
              </NavLink>
            ) : null,
          )}
          <div className="flex gap-2.5 mt-5">
            <NavLink
              to={"/login"}
              className="flex-1 text-center px-4 py-2.5 text-sm font-medium text-white/80 bg-white/[0.07] border border-white/[0.12] rounded-lg hover:bg-white/[0.12] transition-all no-underline"
            >
              Log in
            </NavLink>
            <NavLink
              to={"/signup"}
              className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#7c5cbf] rounded-lg hover:bg-[#6a4caa] transition-all no-underline"
            >
              Get Started
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
