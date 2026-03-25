"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import TemplateRenderer, {
  type TemplateRendererHandle,
} from "./TemplateRenderer";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Download,
  X,
} from "lucide-react";

interface PreviewModalProps {
  templateId: string;
  templateName: string;
  fields: Record<string, string>;
  width: number;
  height: number;
  onClose: () => void;
}

export default function PreviewModal({
  templateId,
  templateName,
  fields,
  width,
  height,
  onClose,
}: PreviewModalProps) {
  const rendererRef = useRef<TemplateRendererHandle>(null);
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Calculate initial fit zoom
  useEffect(() => {
    const maxW = window.innerWidth * 0.8;
    const maxH = window.innerHeight * 0.7;
    const fitScale = Math.min(maxW / width, maxH / height, 1);
    setZoom(fitScale);
  }, [width, height]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  }, [onClose]);

  const handleDownload = useCallback(
    async (quality: 1 | 2 = 1) => {
      const node = rendererRef.current?.getNode();
      if (!node) return;
      try {
        await document.fonts.ready;
        const dataUrl = await toPng(node, {
          width,
          height,
          pixelRatio: quality,
        });
        const link = document.createElement("a");
        link.download = `${templateId}${quality === 2 ? "-hd" : ""}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to generate PNG:", err);
      }
    },
    [templateId, width, height]
  );

  const handleCopyToClipboard = useCallback(async () => {
    const node = rendererRef.current?.getNode();
    if (!node) return;
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(node, { width, height, pixelRatio: 1 });
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
  }, [width, height]);

  const handleOpenInNewTab = useCallback(() => {
    const params = new URLSearchParams();
    params.set("templateId", templateId);
    Object.entries(fields).forEach(([key, value]) => {
      params.set(`f_${key}`, value);
    });
    window.open(`/content-studio/preview?${params.toString()}`, "_blank");
  }, [templateId, fields]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.2));
  const handleFitToView = () => {
    const maxW = window.innerWidth * 0.8;
    const maxH = window.innerHeight * 0.7;
    setZoom(Math.min(maxW / width, maxH / height, 1));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalContentRef}
        className={`relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-xl bg-white shadow-2xl transition-all duration-200 ${
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {templateName}
            </h2>
            <span className="text-xs text-gray-400">
              {width} &times; {height}px
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.2}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={15} className="text-gray-600" />
              </button>
              <span className="text-xs font-mono text-gray-500 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 1.0}
                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={15} className="text-gray-600" />
              </button>
              <button
                onClick={handleFitToView}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title="Fit to view"
              >
                <Maximize2 size={15} className="text-gray-600" />
              </button>
            </div>

            {/* Copy */}
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy size={14} />
              {copyStatus === "copied"
                ? "Copied!"
                : copyStatus === "error"
                ? "Failed"
                : "Copy"}
            </button>

            {/* Open in new tab */}
            <button
              onClick={handleOpenInNewTab}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Open in Tab
            </button>

            {/* Download buttons */}
            <button
              onClick={() => handleDownload(1)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> PNG
            </button>
            <button
              onClick={() => handleDownload(2)}
              className="flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800 transition-colors"
            >
              <Download size={14} /> HD
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="ml-1 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div
          className="flex items-center justify-center p-6"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          <div className="shadow-xl rounded-sm overflow-hidden">
            <TemplateRenderer
              ref={rendererRef}
              templateId={templateId}
              fields={fields}
              width={width}
              height={height}
              scale={zoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
