import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProgramCard } from "@/components/ProgramCard";

const mockProgram = {
  id: "test",
  name: "Test Program",
  ageRange: "2-3 years",
  level: "preschool" as const,
  description: "A test program description",
  highlights: ["Highlight 1", "Highlight 2"],
};

describe("ProgramCard", () => {
  it("renders program name", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("Test Program")).toBeInTheDocument();
  });

  it("renders age range", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("2-3 years")).toBeInTheDocument();
  });

  it("renders highlights", () => {
    render(<ProgramCard program={mockProgram} />);
    expect(screen.getByText("Highlight 1")).toBeInTheDocument();
    expect(screen.getByText("Highlight 2")).toBeInTheDocument();
  });
});
