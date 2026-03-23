import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/Header";

describe("Header", () => {
  it("renders school name", () => {
    render(<Header />);
    expect(screen.getByText("Kids Planet")).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<Header />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Programs")).toBeInTheDocument();
    expect(screen.getByText("Admissions")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders Apply Now CTA", () => {
    render(<Header />);
    const ctaButtons = screen.getAllByText("Apply Now");
    expect(ctaButtons.length).toBeGreaterThan(0);
    expect(ctaButtons[0]).toBeInTheDocument();
  });
});
