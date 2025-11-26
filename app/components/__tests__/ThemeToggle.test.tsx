/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("renders with moon icon by default", () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
  });

  it("toggles between moon and sun icons when clicked", () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
  });

  it("toggles dark class on document element", () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(button);
    expect(document.documentElement).toHaveClass("dark");

    fireEvent.click(button);
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("updates aria-label when toggled", () => {
    render(<ThemeToggle />);
    const button = screen.getByTestId("theme-toggle");

    expect(button).toHaveAttribute("aria-label", "Use dark theme");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Use light theme");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-label", "Use dark theme");
  });
});
