"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { SCHOOL, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on Escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    },
    [mobileOpen],
  );

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [mobileOpen, handleEscape]);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-primary/10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-primary focus:shadow-lg focus:font-medium"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="" className="h-10 w-10" />
            <div>
              <div className="text-lg font-extrabold text-primary-dark leading-none tracking-tight">
                Kids Planet
              </div>
              <div className="text-[10px] font-semibold text-text-muted leading-none mt-0.5 tracking-wide uppercase">
                Kullu Valley &middot; Est. {SCHOOL.founded}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-text-light hover:text-primary hover:bg-primary/5"
                  }`}
                  {...(isActive ? { "aria-current": "page" as const } : {})}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/admissions" className="btn-primary ml-3 py-2.5">
              Apply Now
            </Link>
          </nav>

          {/* Mobile: phone + hamburger together */}
          <div className="flex items-center gap-1 lg:hidden">
            <a
              href={`tel:${SCHOOL.phone}`}
              className="p-2.5 text-primary hover:bg-primary/5 rounded-lg transition-colors"
              aria-label="Call Kids Planet"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              className="p-2.5 text-text-light hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation — slide down */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-primary/10 bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-text-light hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setMobileOpen(false)}
                  {...(isActive ? { "aria-current": "page" as const } : {})}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 pb-1">
              <Link
                href="/admissions"
                className="btn-primary block text-center"
                onClick={() => setMobileOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
