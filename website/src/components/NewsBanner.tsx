"use client";

import { useState } from "react";
import { Newspaper, X } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
}

export function NewsBanner({ news }: { news: NewsItem[] }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || news.length === 0) return null;

  const latest = news[0];

  return (
    <div className="bg-accent/10 border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Newspaper size={16} className="text-accent-dark flex-shrink-0" />
          <p className="text-sm text-primary-dark truncate">
            <span className="font-semibold">In the News:</span>{" "}
            <a
              href={latest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline underline-offset-2"
            >
              {latest.title}
            </a>
            <span className="text-text-muted ml-2 hidden sm:inline">— {latest.source}</span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-text-muted hover:text-primary-dark flex-shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default NewsBanner;
