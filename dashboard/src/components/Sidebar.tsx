"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS, SECTIONS } from "@/lib/constants";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, school, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sidebar-collapsed") || "{}");
    } catch {
      return {};
    }
  });

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const toggleSection = (section: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [section]: !prev[section] };
      try {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "KP";

  const schoolBadge = school?.name ? "KP" : "PS";

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.some((role) => profile?.roles?.includes(role))
  );

  type NavItem = (typeof NAV_ITEMS)[number];
  const grouped = visibleItems.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, NavItem[]>
  );

  const capitalizeRole = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const nav = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c8a84e] text-primary-dark rounded-lg flex items-center justify-center font-extrabold text-lg">
            {schoolBadge}
          </div>
          <div>
            <div className="font-bold text-white text-sm">
              {school?.name ?? "Planet Studio"}
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest">
              School Management
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {Object.entries(grouped).map(([section, items]) => {
          const sectionLabel = SECTIONS[section];
          const isCollapsed = !!collapsed[section];

          return (
            <div key={section}>
              {sectionLabel && (
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between text-white/40 uppercase text-[11px] tracking-wider font-medium cursor-pointer px-3 pt-4 pb-2 hover:text-white/60 transition-colors"
                >
                  <span>{sectionLabel}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  />
                </button>
              )}
              <div
                className={`transition-all duration-200 ${
                  sectionLabel && isCollapsed
                    ? "max-h-0 overflow-hidden"
                    : "max-h-[1000px]"
                }`}
              >
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 h-11 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "border-l-[3px] border-[#c8a84e] bg-white/15 text-white pl-[9px]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {profile?.full_name ?? "Loading..."}
            </div>
            <div className="text-[10px] text-white/40">
              {capitalizeRole(profile?.primary_role)}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar text-white rounded-lg shadow-lg"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-40 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {nav}
      </aside>
    </>
  );
}
