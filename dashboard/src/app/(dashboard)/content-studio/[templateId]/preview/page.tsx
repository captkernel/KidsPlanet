"use client";

import { use, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";
import { getTemplate } from "@/data/templates";
import { getTemplateComponent } from "@/templates/registry";
import { Download, ArrowLeft } from "lucide-react";

function PreviewContent({ templateId }: { templateId: string }) {
  const searchParams = useSearchParams();
  const template = getTemplate(templateId);
  const previewRef = useRef<HTMLDivElement>(null);

  // Hide sidebar on mount, restore on unmount
  useEffect(() => {
    const aside = document.querySelector("aside");
    if (aside) {
      const prev = (aside as HTMLElement).style.display;
      (aside as HTMLElement).style.display = "none";
      return () => {
        (aside as HTMLElement).style.display = prev;
      };
    }
  }, []);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Template Not Found</h2>
          <Link href="/content-studio" className="underline">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  // Read field values from URL search params, fall back to template defaults
  const fieldValues: Record<string, string> = {};
  for (const field of template.fields) {
    fieldValues[field.key] = searchParams.get(field.key) || field.default;
  }

  const TemplateComponent = getTemplateComponent(templateId);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Preview not available for blank canvas</h2>
          <Link href="/content-studio" className="underline">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        width: template.width,
        height: template.height,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${template.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/content-studio/${templateId}`}
            className="text-white/80 hover:text-white flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} /> Back to Editor
          </Link>
          <span className="text-white/40">|</span>
          <span className="text-white/60 text-sm">{template.name}</span>
          <span className="text-white/40 text-xs">
            {template.width} x {template.height}px
          </span>
        </div>
        <button
          onClick={handleDownload}
          className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Download size={16} /> Download PNG
        </button>
      </div>

      {/* Template rendered full size, centered */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          ref={previewRef}
          style={{
            width: template.width,
            height: template.height,
            flexShrink: 0,
          }}
        >
          <TemplateComponent fields={fieldValues} />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-700 flex items-center justify-center text-white">
          Loading preview...
        </div>
      }
    >
      <PreviewContent templateId={templateId} />
    </Suspense>
  );
}
