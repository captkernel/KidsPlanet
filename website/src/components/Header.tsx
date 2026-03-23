"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { SCHOOL, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white font-bold text-lg">
              KP
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-primary-dark leading-tight">
                {SCHOOL.name}
              </div>
              <div className="text-xs text-text-muted leading-tight">
                Kullu Valley &middot; Since {SCHOOL.founded}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.filter((link) => link.label !== "Home").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-text-light hover:text-primary transition-colors rounded-md hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admissions" className="btn-primary ml-2">
              Apply Now
            </Link>
          </nav>

          {/* Mobile phone + menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${SCHOOL.phone}`}
              className="p-2 text-primary hover:bg-primary/5 rounded-md transition-colors"
              aria-label="Call us"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-text-light hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-primary/10 bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-text-light hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admissions"
              className="btn-primary block text-center mt-3"
              onClick={() => setMobileOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
