import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders hero headline", () => {
    render(<Home />);
    expect(screen.getByText(/Brightest Future Begins/)).toBeInTheDocument();
  });

  it('renders "Programs for Every Age" (section heading)', () => {
    render(<Home />);
    expect(screen.getByText("Programs for Every Age")).toBeInTheDocument();
  });

  it('renders "Mrs. Neeta Parmar" (founder spotlight)', () => {
    render(<Home />);
    expect(screen.getByText("Mrs. Neeta Parmar")).toBeInTheDocument();
  });

  it('renders "What Parents Say" (testimonials)', () => {
    render(<Home />);
    expect(screen.getByText("What Parents Say")).toBeInTheDocument();
  });
});
