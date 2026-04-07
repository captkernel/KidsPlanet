"use client";

import { use, useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toPng, toJpeg } from "html-to-image";
import PageHeader from "@/components/PageHeader";
import { getTemplate } from "@/data/templates";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/templates";
import { getTemplateComponent } from "@/templates/registry";
import EditorToolbar from "@/components/studio/EditorToolbar";
import FieldGroup from "@/components/studio/FieldGroup";
import CanvasEditor from "@/components/studio/CanvasEditor";
import { FloatingToolbar } from "@/components/studio/FloatingToolbar";
import { LayerPanel } from "@/components/studio/LayerPanel";
import { IconPicker } from "@/components/studio/IconPicker";
import { StickerPicker } from "@/components/studio/StickerPicker";
import { useImageImporter } from "@/components/studio/ImageImporter";
import { STICKERS } from "@/data/stickers";
import type {
  CanvasElement,
  ImageElement,
  TextElement,
  IconElement,
  StickerElement,
  EditorSnapshot,
} from "@/lib/types/canvas";
import {
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Share2,
} from "lucide-react";
import { useStudioAuth } from "../auth";

const MAX_HISTORY = 30;

export default function CustomizePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { authenticated, LoginGate } = useStudioAuth();
  const { templateId } = use(params);
  const searchParams = useSearchParams();
  const template = getTemplate(templateId);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const isBlank = templateId === "blank";
  const blankWidth = isBlank ? Number(searchParams.get("w")) || 1080 : 0;
  const blankHeight = isBlank ? Number(searchParams.get("h")) || 1080 : 0;

  const templateWidth = isBlank ? blankWidth : (template?.width ?? 1080);
  const templateHeight = isBlank ? blankHeight : (template?.height ?? 1080);
  const templateName = isBlank ? "Blank Canvas" : (template?.name ?? "");

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [canvasMode, setCanvasMode] = useState(isBlank);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

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

  const [history, setHistory] = useState<EditorSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    const defaults = getDefaults();
    setHistory([{ fields: defaults, elements: [] }]);
    setHistoryIndex(0);
  }, [getDefaults]);

  const [zoom, setZoom] = useState(0.4);
  const containerRef = useRef<HTMLDivElement>(null);

  const computeFitScale = useCallback(() => {
    if (!containerRef.current) return 0.4;
    const containerWidth = containerRef.current.clientWidth - 32;
    return Math.min(containerWidth / templateWidth, 0.6);
  }, [templateWidth]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => setZoom(computeFitScale());
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [computeFitScale]);

  const pushHistory = useCallback(
    (fields: Record<string, string>, elems: CanvasElement[]) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        const next = [...trimmed, { fields, elements: [...elems] }];
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
      pushHistory(newValues, elements);
    },
    [fieldValues, pushHistory, elements]
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const snapshot = history[newIndex];
    if (snapshot) {
      setFieldValues(snapshot.fields);
      setElements(snapshot.elements);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const snapshot = history[newIndex];
    if (snapshot) {
      setFieldValues(snapshot.fields);
      setElements(snapshot.elements);
    }
  }, [historyIndex, history]);

  const resetDefaults = useCallback(() => {
    const defaults = getDefaults();
    setFieldValues(defaults);
    setElements([]);
    pushHistory(defaults, []);
  }, [getDefaults, pushHistory]);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedElementId) ?? null,
    [elements, selectedElementId]
  );

  const addTextElement = useCallback(() => {
    const el: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      content: "New Text",
      x: (templateWidth - 200) / 2,
      y: (templateHeight - 50) / 2,
      width: 200,
      height: 50,
      zIndex: elements.length + 1,
      locked: false,
      visible: true,
      style: {
        opacity: 1,
        fontSize: 24,
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "center",
        color: "#000000",
      },
    };
    const newElems = [...elements, el];
    setElements(newElems);
    setSelectedElementId(el.id);
    setCanvasMode(true);
    pushHistory(fieldValues, newElems);
  }, [elements, templateWidth, templateHeight, fieldValues, pushHistory]);

  const addIconElement = useCallback(
    (iconName: string) => {
      const el: IconElement = {
        id: crypto.randomUUID(),
        type: "icon",
        content: iconName,
        x: (templateWidth - 48) / 2,
        y: (templateHeight - 48) / 2,
        width: 48,
        height: 48,
        zIndex: elements.length + 1,
        locked: false,
        visible: true,
        style: { opacity: 1, color: "#000000" },
      };
      const newElems = [...elements, el];
      setElements(newElems);
      setSelectedElementId(el.id);
      setCanvasMode(true);
      pushHistory(fieldValues, newElems);
    },
    [elements, templateWidth, templateHeight, fieldValues, pushHistory]
  );

  const addStickerElement = useCallback(
    (stickerId: string) => {
      const sticker = STICKERS.find((s) => s.id === stickerId);
      const el: StickerElement = {
        id: crypto.randomUUID(),
        type: "sticker",
        content: sticker?.svg ?? stickerId,
        x: (templateWidth - 80) / 2,
        y: (templateHeight - 80) / 2,
        width: 80,
        height: 80,
        zIndex: elements.length + 1,
        locked: false,
        visible: true,
        style: { opacity: 1 },
      };
      const newElems = [...elements, el];
      setElements(newElems);
      setSelectedElementId(el.id);
      setCanvasMode(true);
      pushHistory(fieldValues, newElems);
    },
    [elements, templateWidth, templateHeight, fieldValues, pushHistory]
  );

  const { importFromFile, fileInputRef, handleFileChange } = useImageImporter(
    templateWidth,
    templateHeight,
    (result) => {
      const el: ImageElement = {
        id: crypto.randomUUID(),
        type: "image",
        content: result.dataUrl,
        x: (templateWidth - result.width) / 2,
        y: (templateHeight - result.height) / 2,
        width: result.width,
        height: result.height,
        zIndex: elements.length + 1,
        locked: false,
        visible: true,
        style: { opacity: 1 },
      };
      const newElems = [...elements, el];
      setElements(newElems);
      setSelectedElementId(el.id);
      setCanvasMode(true);
      pushHistory(fieldValues, newElems);
    }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleDownload("png", 1);
      }
      if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleDownload = useCallback(
    async (format: "png" | "jpeg", scale: number = 1) => {
      if (!previewRef.current) return;
      setSelectedElementId(null);
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      await new Promise((r) => requestAnimationFrame(r));

      setDownloading(true);
      try {
        const node = previewRef.current;
        const fname = isBlank ? "canvas" : templateId;

        if (format === "jpeg") {
          const dataUrl = await toJpeg(node, {
            width: templateWidth,
            height: templateHeight,
            quality: 0.95,
            backgroundColor: "#ffffff",
            pixelRatio: scale,
          });
          const link = document.createElement("a");
          link.download = `${fname}.jpg`;
          link.href = dataUrl;
          link.click();
        } else {
          const dataUrl = await toPng(node, {
            width: templateWidth,
            height: templateHeight,
            pixelRatio: scale,
          });
          const link = document.createElement("a");
          link.download = `${fname}${scale === 2 ? "-hd" : ""}.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setDownloading(false);
      }
    },
    [templateId, templateWidth, templateHeight, isBlank]
  );

  const handleCopyToClipboard = useCallback(async () => {
    if (!previewRef.current) return;
    setSelectedElementId(null);
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    await new Promise((r) => requestAnimationFrame(r));

    try {
      const dataUrl = await toPng(previewRef.current, {
        width: templateWidth,
        height: templateHeight,
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
  }, [templateWidth, templateHeight]);

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

  const handleElementUpdate = useCallback(
    (updates: Partial<CanvasElement>) => {
      if (!selectedElementId) return;
      const newElems = elements.map((el) =>
        el.id === selectedElementId ? ({ ...el, ...updates } as CanvasElement) : el
      );
      setElements(newElems);
      pushHistory(fieldValues, newElems);
    },
    [selectedElementId, elements, fieldValues, pushHistory]
  );

  const handleElementDelete = useCallback(() => {
    if (!selectedElementId) return;
    const newElems = elements.filter((el) => el.id !== selectedElementId);
    setElements(newElems);
    setSelectedElementId(null);
    pushHistory(fieldValues, newElems);
  }, [selectedElementId, elements, fieldValues, pushHistory]);

  const handleLayerReorder = useCallback(
    (id: string, direction: "up" | "down") => {
      const newElems = elements.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            zIndex: direction === "up" ? el.zIndex + 1 : Math.max(0, el.zIndex - 1),
          } as CanvasElement;
        }
        return el;
      });
      setElements(newElems);
      pushHistory(fieldValues, newElems);
    },
    [elements, fieldValues, pushHistory]
  );

  const handleToggleVisible = useCallback(
    (id: string) => {
      const newElems = elements.map((el) =>
        el.id === id ? ({ ...el, visible: !el.visible } as CanvasElement) : el
      );
      setElements(newElems);
      pushHistory(fieldValues, newElems);
    },
    [elements, fieldValues, pushHistory]
  );

  const handleToggleLock = useCallback(
    (id: string) => {
      const newElems = elements.map((el) =>
        el.id === id ? ({ ...el, locked: !el.locked } as CanvasElement) : el
      );
      setElements(newElems);
      pushHistory(fieldValues, newElems);
    },
    [elements, fieldValues, pushHistory]
  );

  const toolbarPosition = useMemo(() => {
    if (!selectedElement || !canvasContainerRef.current) return { x: 0, y: 0 };
    const rect = canvasContainerRef.current.getBoundingClientRect();
    return {
      x: rect.left + selectedElement.x * zoom,
      y: rect.top + selectedElement.y * zoom,
    };
  }, [selectedElement, zoom]);

  const canvasContainerTop = canvasContainerRef.current?.getBoundingClientRect().top ?? 0;

  if (!authenticated) return <LoginGate />;

  if (!isBlank && !template) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center py-20">
        <h2 className="text-xl font-bold text-primary-dark mb-2">
          Template Not Found
        </h2>
        <p className="text-text-muted mb-6">
          The template &ldquo;{templateId}&rdquo; does not exist.
        </p>
        <Link href="/PlanetStudio" className="btn-primary">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const TemplateComponent = isBlank ? null : getTemplateComponent(templateId);

  const previewSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(fieldValues)) {
    previewSearchParams.set(key, value);
  }

  const textFields = template
    ? template.fields.filter(
        (f) =>
          f.type === "text" || f.type === "textarea" || f.type === "date" || f.type === "year"
      )
    : [];
  const imageFields = template
    ? template.fields.filter(
        (f) =>
          f.key.toLowerCase().includes("image") ||
          f.key.toLowerCase().includes("photo") ||
          f.key.toLowerCase().includes("logo")
      )
    : [];
  const colorFields = template
    ? template.fields.filter(
        (f) =>
          f.key.toLowerCase().includes("color") ||
          f.key.toLowerCase().includes("bg") ||
          f.key.toLowerCase().includes("theme")
      )
    : [];
  const imageAndColorKeys = new Set([
    ...imageFields.map((f) => f.key),
    ...colorFields.map((f) => f.key),
  ]);
  const contentFields = textFields.filter((f) => !imageAndColorKeys.has(f.key));

  const renderField = (field: NonNullable<typeof template>["fields"][number]) => (
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title={templateName}
        subtitle={isBlank ? `${templateWidth} x ${templateHeight} blank canvas` : template!.description}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/PlanetStudio"
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} /> Gallery
            </Link>
            {!isBlank && (
              <button
                onClick={resetDefaults}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
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
        {template && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[template.category]}`}
          >
            {CATEGORY_LABELS[template.category]}
          </span>
        )}
        <span className="text-xs text-text-muted">
          {templateWidth} &times; {templateHeight}px
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
        {!isBlank && template && (
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-3 pb-4">
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
        )}

        <div className="flex-1 min-w-0 space-y-3" ref={containerRef}>
          <EditorToolbar
            zoom={zoom}
            onZoomChange={handleZoomChange}
            onDownload={(quality) => handleDownload("png", quality)}
            onCopyToClipboard={handleCopyToClipboard}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            templateName={templateName}
            width={templateWidth}
            height={templateHeight}
            category={template ? CATEGORY_LABELS[template.category] : "Canvas"}
            canvasMode={canvasMode}
            onToggleMode={() => setCanvasMode((prev) => !prev)}
            onAddImage={importFromFile}
            onAddText={addTextElement}
            onOpenIconPicker={() => setShowIconPicker(true)}
            onOpenStickerPicker={() => setShowStickerPicker(true)}
            showLayers={showLayers}
            onToggleLayers={() => setShowLayers((prev) => !prev)}
            onDownloadJpeg={() => handleDownload("jpeg", 1)}
          />

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
                  width: templateWidth * zoom,
                  height: templateHeight * zoom,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  ref={(node) => {
                    (previewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    (canvasContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                  }}
                  style={{
                    width: templateWidth,
                    height: templateHeight,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    flexShrink: 0,
                    position: "relative",
                    background: "white",
                  }}
                >
                  {TemplateComponent && !isBlank && (
                    <TemplateComponent fields={fieldValues} />
                  )}
                  <CanvasEditor
                    elements={elements}
                    onElementsChange={(newElems) => {
                      setElements(newElems);
                      pushHistory(fieldValues, newElems);
                    }}
                    canvasWidth={templateWidth}
                    canvasHeight={templateHeight}
                    scale={zoom}
                    active={canvasMode}
                    onSelectionChange={(ids) => setSelectedElementId(ids[0] ?? null)}
                  />
                </div>
              </div>
            </div>
          </div>

          {showLayers && (
            <div className="mt-3">
              <LayerPanel
                elements={elements}
                selectedId={selectedElementId}
                onSelect={(id) => {
                  setSelectedElementId(id);
                  setCanvasMode(true);
                }}
                onReorder={handleLayerReorder}
                onToggleVisible={handleToggleVisible}
                onToggleLock={handleToggleLock}
              />
            </div>
          )}
        </div>
      </div>

      {canvasMode && selectedElementId && selectedElement && (
        <FloatingToolbar
          element={selectedElement}
          onUpdate={handleElementUpdate}
          onDelete={handleElementDelete}
          position={toolbarPosition}
          elementHeight={selectedElement.height * zoom}
          canvasTop={canvasContainerTop}
        />
      )}

      <IconPicker
        open={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={(name) => {
          addIconElement(name);
          setShowIconPicker(false);
        }}
      />
      <StickerPicker
        open={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onSelect={(id) => {
          addStickerElement(id);
          setShowStickerPicker(false);
        }}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        tabIndex={-1}
      />
    </div>
  );
}
