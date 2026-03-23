import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsBar } from "@/components/StatsBar";

describe("StatsBar", () => {
  it("renders all stat values", () => {
    render(<StatsBar />);
    expect(screen.getByText("15+")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();
    expect(screen.getByText("20:1")).toBeInTheDocument();
    expect(screen.getByText("4.4★")).toBeInTheDocument();
  });

  it("renders all stat labels", () => {
    render(<StatsBar />);
    expect(screen.getByText("Years")).toBeInTheDocument();
    expect(screen.getByText("Classrooms")).toBeInTheDocument();
    expect(screen.getByText("Student Ratio")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });
});
