"use client";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { getTemplateComponent } from "@/templates/registry";

interface TemplateRendererProps {
  templateId: string;
  fields: Record<string, string>;
  width: number;
  height: number;
  scale?: number;
}

export interface TemplateRendererHandle {
  getNode: () => HTMLDivElement | null;
}

const TemplateRenderer = forwardRef<TemplateRendererHandle, TemplateRendererProps>(
  function TemplateRenderer({ templateId, fields, width, height, scale }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ getNode: () => containerRef.current }));
    const TemplateComponent = getTemplateComponent(templateId);
    const containerStyle: React.CSSProperties = scale
      ? { width: width * scale, height: height * scale, overflow: "hidden" }
      : {};
    const innerStyle: React.CSSProperties = scale
      ? { transform: `scale(${scale})`, transformOrigin: "top left", width, height }
      : { width, height };
    return (
      <div style={containerStyle}>
        <div ref={containerRef} style={innerStyle}>
          {TemplateComponent ? <TemplateComponent fields={fields} /> : null}
        </div>
      </div>
    );
  }
);
export default TemplateRenderer;
