"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FieldGroupProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function FieldGroup({
  title,
  defaultOpen = true,
  children,
}: FieldGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-primary-dark">{title}</span>
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      <div
        className="transition-all duration-200 ease-in-out overflow-hidden"
        style={{
          maxHeight: open ? "2000px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-4 py-3 space-y-4">{children}</div>
      </div>
    </div>
  );
}
