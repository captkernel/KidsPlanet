import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AnnouncementList from "@/components/AnnouncementList";

const mockAnnouncements = [
  { id: "1", title: "Older Notice", date: "2026-01-01", type: "general", content: "Old content" },
  { id: "2", title: "Newer Notice", date: "2026-03-15", type: "event", content: "New content" },
];

describe("AnnouncementList", () => {
  it("renders all announcements", () => {
    render(<AnnouncementList announcements={mockAnnouncements} />);
    expect(screen.getByText("Older Notice")).toBeInTheDocument();
    expect(screen.getByText("Newer Notice")).toBeInTheDocument();
  });

  it("shows newest announcements first", () => {
    render(<AnnouncementList announcements={mockAnnouncements} />);
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles[0]).toHaveTextContent("Newer Notice");
    expect(titles[1]).toHaveTextContent("Older Notice");
  });
});
