import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InquiryForm from "@/components/InquiryForm";

describe("InquiryForm", () => {
  it("renders all required fields", () => {
    render(<InquiryForm />);
    expect(screen.getByLabelText("Parent Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Child's Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Class Applying For")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<InquiryForm />);
    expect(screen.getByText("Submit Inquiry")).toBeInTheDocument();
  });
});
