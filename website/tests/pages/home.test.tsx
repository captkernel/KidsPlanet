import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";

describe("Home Page", () => {
  it('renders "Nurturing Excellence" (hero)', () => {
    render(<Home />);
    expect(screen.getByText(/Nurturing Excellence/)).toBeInTheDocument();
  });

  it('renders "Our Programs" (section heading)', () => {
    render(<Home />);
    expect(screen.getByText("Our Programs")).toBeInTheDocument();
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
