import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail, Star, Newspaper } from "lucide-react";
import { SCHOOL, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary-dark font-bold text-lg">
                KP
              </div>
              <div>
                <div className="text-lg font-bold leading-tight">{SCHOOL.name}</div>
                <div className="text-sm text-white/70 leading-tight">
                  Kullu Valley &middot; Since {SCHOOL.founded}
                </div>
              </div>
            </div>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              {SCHOOL.description}
            </p>
            <div className="flex gap-3">
              <a
                href={SCHOOL.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SCHOOL.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{SCHOOL.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${SCHOOL.phone}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  <span>{SCHOOL.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SCHOOL.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  <span>{SCHOOL.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="fill-accent text-accent" />
            <span>4.4/5 rating from 23 reviews on JustDial</span>
          </div>
          <span className="hidden sm:inline">&middot;</span>
          <div className="flex items-center gap-1.5">
            <Newspaper size={12} className="text-accent" />
            <span>Featured in Amar Ujala</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
