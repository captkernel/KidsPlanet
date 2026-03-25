"use client";

import {
  ZoomIn,
  ZoomOut,
  Download,
  Copy,
  Undo2,
  Redo2,
  Maximize2,
  Info,
} from "lucide-react";

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
  templateName,
  width,
  height,
  category,
}: EditorToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 1.0));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.2));
  };

  const handleFitToView = () => {
    // Signal parent to recalculate fit
    onZoomChange(-1);
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      {/* Left: Template info */}
      <div className="flex items-center gap-3">
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

      {/* Right: Export actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onCopyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          title="Copy to Clipboard"
        >
          <Copy size={14} />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        <button
          onClick={() => onDownload(1)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          title="Download PNG (1x)"
        >
          <Download size={14} />
          <span className="hidden sm:inline">PNG</span>
        </button>
        <button
          onClick={() => onDownload(2)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-700 text-white hover:bg-green-800 transition-colors"
          title="Download HD PNG (2x)"
        >
          <Download size={14} />
          <span className="hidden sm:inline">HD</span>
        </button>
      </div>
    </div>
  );
}
