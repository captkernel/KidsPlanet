"use client";

import { use, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import PageHeader from "@/components/PageHeader";
import { getTemplate } from "@/data/templates";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/templates";
import { getTemplateComponent } from "@/templates/registry";
import EditorToolbar from "@/components/studio/EditorToolbar";
import FieldGroup from "@/components/studio/FieldGroup";
import {
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Share2,
} from "lucide-react";

const MAX_HISTORY = 20;

export default function CustomizePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const template = getTemplate(templateId);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize field values from template defaults
  const getDefaults = useCallback(() => {
    if (!template) return {};
    const defaults: Record<string, string> = {};
    for (const field of template.fields) {
      defaults[field.key] = field.default;
    }
    return defaults;
  }, [template]);

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(getDefaults);
  const [downloading, setDownloading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  // Undo / Redo history
  const [history, setHistory] = useState<Record<string, string>[]>(() => [getDefaults()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Calculate preview scale based on container width
  const [zoom, setZoom] = useState(0.4);
  const containerRef = useRef<HTMLDivElement>(null);

  const computeFitScale = useCallback(() => {
    if (!template || !containerRef.current) return 0.4;
    const containerWidth = containerRef.current.clientWidth - 32;
    return Math.min(containerWidth / template.width, 0.6);
  }, [template]);

  useEffect(() => {
    if (!template || !containerRef.current) return;
    const updateScale = () => setZoom(computeFitScale());
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [template, computeFitScale]);

  // Push new state to history
  const pushHistory = useCallback(
    (newValues: Record<string, string>) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        const next = [...trimmed, newValues];
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      setHistoryIndex((prev) => {
        const newIdx = prev + 1;
        return newIdx >= MAX_HISTORY ? MAX_HISTORY - 1 : newIdx;
      });
    },
    [historyIndex]
  );

  const handleFieldChange = useCallback(
    (key: string, value: string) => {
      const newValues = { ...fieldValues, [key]: value };
      setFieldValues(newValues);
      pushHistory(newValues);
    },
    [fieldValues, pushHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setFieldValues(history[newIndex]);
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setFieldValues(history[newIndex]);
  }, [historyIndex, history]);

  const resetDefaults = useCallback(() => {
    const defaults = getDefaults();
    setFieldValues(defaults);
    pushHistory(defaults);
  }, [getDefaults, pushHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S → download PNG
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleDownload(1);
      }
      // Ctrl+Z → undo
      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      // Ctrl+Shift+Z → redo
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleDownload = useCallback(
    async (quality: 1 | 2 = 1) => {
      if (!previewRef.current || !template) return;
      setDownloading(true);
      try {
        const dataUrl = await toPng(previewRef.current, {
          width: template.width,
          height: template.height,
          pixelRatio: quality,
        });
        const link = document.createElement("a");
        link.download = `${template.id}${quality === 2 ? "-hd" : ""}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setDownloading(false);
      }
    },
    [template]
  );

  const handleCopyToClipboard = useCallback(async () => {
    if (!previewRef.current || !template) return;
    try {
      const dataUrl = await toPng(previewRef.current, {
        width: template.width,
        height: template.height,
        pixelRatio: 1,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Copy to clipboard failed:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [template]);

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      if (newZoom === -1) {
        setZoom(computeFitScale());
      } else {
        setZoom(Math.round(newZoom * 100) / 100);
      }
    },
    [computeFitScale]
  );

  const handleShareUrl = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
  }, []);

  if (!template) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-primary-dark mb-2">
          Template Not Found
        </h2>
        <p className="text-text-muted mb-6">
          The template &ldquo;{templateId}&rdquo; does not exist.
        </p>
        <Link href="/content-studio" className="btn-primary">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const TemplateComponent = getTemplateComponent(templateId);

  // Build preview URL with current field values
  const previewSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(fieldValues)) {
    previewSearchParams.set(key, value);
  }
  const previewUrl = `/content-studio/${templateId}/preview?${previewSearchParams.toString()}`;

  // Categorize fields into groups
  const textFields = template.fields.filter(
    (f) => f.type === "text" || f.type === "textarea" || f.type === "date" || f.type === "year"
  );
  const imageFields = template.fields.filter(
    (f) => f.key.toLowerCase().includes("image") || f.key.toLowerCase().includes("photo") || f.key.toLowerCase().includes("logo")
  );
  const colorFields = template.fields.filter(
    (f) => f.key.toLowerCase().includes("color") || f.key.toLowerCase().includes("bg") || f.key.toLowerCase().includes("theme")
  );
  // Content fields are those not in image or color groups
  const imageAndColorKeys = new Set([...imageFields.map((f) => f.key), ...colorFields.map((f) => f.key)]);
  const contentFields = textFields.filter((f) => !imageAndColorKeys.has(f.key));

  const renderField = (field: (typeof template.fields)[number]) => (
    <div key={field.key}>
      <label className="block text-xs font-medium text-text-muted mb-1">
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          value={fieldValues[field.key] || ""}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder || field.default}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
        />
      ) : (
        <input
          type={field.type === "date" ? "date" : field.type === "year" ? "number" : "text"}
          value={fieldValues[field.key] || ""}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          placeholder={field.placeholder || field.default}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title={template.name}
        subtitle={template.description}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/content-studio"
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Gallery
            </Link>
            <button
              onClick={resetDefaults}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> Reset
            </button>
            <Link
              href={previewUrl}
              target="_blank"
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <ExternalLink size={16} /> Full Preview
            </Link>
            <button
              onClick={handleShareUrl}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Copy page URL"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[template.category]}`}
        >
          {CATEGORY_LABELS[template.category]}
        </span>
        <span className="text-xs text-text-muted">
          {template.width} &times; {template.height}px
        </span>
        {copyStatus === "copied" && (
          <span className="text-xs text-green-600 font-medium ml-2">
            Copied to clipboard!
          </span>
        )}
        {copyStatus === "error" && (
          <span className="text-xs text-red-600 font-medium ml-2">
            Copy failed
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form fields - sticky left sidebar */}
        <div className="w-full lg:w-96 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-3 pb-4">
            {/* Template Info section */}
            <div className="card">
              <h3 className="font-bold text-sm text-primary-dark mb-2">
                Template Info
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>{" "}
                  {template.name}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Category:</span>{" "}
                  {CATEGORY_LABELS[template.category]}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Size:</span>{" "}
                  {template.width} &times; {template.height}px
                </div>
                <div>
                  <span className="font-medium text-gray-600">Fields:</span>{" "}
                  {template.fields.length}
                </div>
              </div>
            </div>

            {/* Field groups */}
            <div className="card space-y-3">
              {contentFields.length > 0 && (
                <FieldGroup title="Content" defaultOpen={true}>
                  {contentFields.map(renderField)}
                </FieldGroup>
              )}

              {imageFields.length > 0 && (
                <FieldGroup title="Images" defaultOpen={true}>
                  {imageFields.map(renderField)}
                </FieldGroup>
              )}

              {colorFields.length > 0 && (
                <FieldGroup title="Styling" defaultOpen={true}>
                  {colorFields.map(renderField)}
                </FieldGroup>
              )}

              {/* Fallback: if no categorization matched, show all fields */}
              {contentFields.length === 0 &&
                imageFields.length === 0 &&
                colorFields.length === 0 && (
                  <FieldGroup title="Customize Fields" defaultOpen={true}>
                    {template.fields.map(renderField)}
                  </FieldGroup>
                )}
            </div>
          </div>
        </div>

        {/* Live preview - right side */}
        <div className="flex-1 min-w-0 space-y-3" ref={containerRef}>
          {/* Editor Toolbar */}
          <EditorToolbar
            zoom={zoom}
            onZoomChange={handleZoomChange}
            onDownload={handleDownload}
            onCopyToClipboard={handleCopyToClipboard}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            templateName={template.name}
            width={template.width}
            height={template.height}
            category={CATEGORY_LABELS[template.category]}
          />

          {/* Preview area */}
          <div className="card overflow-auto">
            <h3 className="font-bold text-sm text-primary-dark mb-4">
              Live Preview
              {downloading && (
                <span className="ml-2 text-xs font-normal text-amber-600">
                  Exporting...
                </span>
              )}
            </h3>
            <div
              className="rounded-lg p-4 flex items-center justify-center overflow-auto"
              style={{
                minHeight: 300,
                backgroundImage:
                  "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            >
              <div
                className="shadow-xl rounded-sm"
                style={{
                  width: template.width * zoom,
                  height: template.height * zoom,
                  overflow: "hidden",
                }}
              >
                <div
                  ref={previewRef}
                  style={{
                    width: template.width,
                    height: template.height,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    flexShrink: 0,
                  }}
                >
                  <TemplateComponent fields={fieldValues} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
