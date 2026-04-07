import { Suspense } from "react";
import { TEMPLATES } from "@/data/templates";
import EditorClient from "./EditorClient";

export function generateStaticParams() {
  return [
    { templateId: "blank" },
    ...TEMPLATES.map((t) => ({ templateId: t.id })),
  ];
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-muted">Loading studio...</div>}>
      <EditorClient params={params} />
    </Suspense>
  );
}
