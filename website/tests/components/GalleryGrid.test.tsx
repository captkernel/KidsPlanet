import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GalleryGrid from "@/components/GalleryGrid";

const mockImages = [
  { id: "1", src: "/test1.jpg", alt: "Test 1", category: "events" },
  { id: "2", src: "/test2.jpg", alt: "Test 2", category: "classrooms" },
  { id: "3", src: "/test3.jpg", alt: "Test 3", category: "events" },
];

describe("GalleryGrid", () => {
  it("renders filter buttons for all categories", () => {
    render(<GalleryGrid images={mockImages} />);
    expect(screen.getByText("all")).toBeInTheDocument();
    expect(screen.getByText("events")).toBeInTheDocument();
    expect(screen.getByText("classrooms")).toBeInTheDocument();
  });

  it("renders all images initially", () => {
    render(<GalleryGrid images={mockImages} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });
});
