"use client";

import { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  Download,
  Copy,
  Undo2,
  Redo2,
  Maximize2,
  Info,
  Layers,
  ChevronDown,
} from "lucide-react";
import { AddMenu } from "@/components/studio/AddMenu";

interface EditorToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDownload: (quality: 1 | 2) => void;
  onCopyToClipboard: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  templateName: string;
  width: number;
  height: number;
  category: string;
  canvasMode: boolean;
  onToggleMode: () => void;
  onAddImage: () => void;
  onAddText: () => void;
  onOpenIconPicker: () => void;
  onOpenStickerPicker: () => void;
  showLayers: boolean;
  onToggleLayers: () => void;
  onDownloadJpeg?: () => void;
}

export default function EditorToolbar({
  zoom,
  onZoomChange,
  onDownload,
  onCopyToClipboard,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  width,
  height,
  category,
  canvasMode,
  onToggleMode,
  onAddImage,
  onAddText,
  onOpenIconPicker,
  onOpenStickerPicker,
  showLayers,
  onToggleLayers,
  onDownloadJpeg,
}: EditorToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Close download dropdown on outside click
  useEffect(() => {
    if (!downloadOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [downloadOpen]);

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.2));
  };

  const handleFitToView = () => {
    onZoomChange(-1);
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex-wrap gap-2">
      {/* Left: Mode toggle + Add menu + Template info */}
      <div className="flex items-center gap-2">
        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => { if (canvasMode) onToggleMode(); }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              !canvasMode
                ? "bg-primary text-white"
                : "bg-surface-muted text-text-muted hover:bg-gray-100"
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => { if (!canvasMode) onToggleMode(); }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              canvasMode
                ? "bg-primary text-white"
                : "bg-surface-muted text-text-muted hover:bg-gray-100"
            }`}
          >
            Canvas
          </button>
        </div>

        {/* Add menu (only in canvas mode) */}
        {canvasMode && (
          <AddMenu
            onAddImage={onAddImage}
            onAddText={onAddText}
            onOpenIconPicker={onOpenIconPicker}
            onOpenStickerPicker={onOpenStickerPicker}
          />
        )}

        <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1.5 text-gray-400">
          <Info size={14} />
        </div>
        <span className="text-xs font-medium text-gray-600 hidden sm:inline">
          {width} &times; {height}px
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
          {category}
        </span>
      </div>

      {/* Center: Zoom + Undo/Redo */}
      <div className="flex items-center gap-1">
        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} className="text-gray-600" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={15} className="text-gray-600" />
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Zoom controls */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.2}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={15} className="text-gray-600" />
        </button>
        <span className="text-xs font-mono text-gray-500 min-w-[3rem] text-center select-none">
          {zoomPercent}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 1.0}
          className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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

      {/* Right: Layers + Export actions */}
      <div className="flex items-center gap-1">
        {/* Layers toggle */}
        <button
          onClick={onToggleLayers}
          className={`p-1.5 rounded-md transition-colors ${
            showLayers ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"
          }`}
          title="Toggle Layers"
        >
          <Layers size={15} />
        </button>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Copy */}
        <button
          onClick={onCopyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          title="Copy to Clipboard"
        >
          <Copy size={14} />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Download dropdown */}
        <div ref={downloadRef} className="relative">
          <button
            onClick={() => setDownloadOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-700 text-white hover:bg-green-800 transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
            <ChevronDown size={12} />
          </button>
          {downloadOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-44 z-50">
              <button
                onClick={() => { onDownload(1); setDownloadOpen(false); }}
                className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
              >
                <Download size={14} className="text-gray-400" />
                PNG (1x)
              </button>
              <button
                onClick={() => { onDownload(2); setDownloadOpen(false); }}
                className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
              >
                <Download size={14} className="text-gray-400" />
                PNG HD (2x)
              </button>
              {onDownloadJpeg && (
                <button
                  onClick={() => { onDownloadJpeg(); setDownloadOpen(false); }}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
                >
                  <Download size={14} className="text-gray-400" />
                  JPEG
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
