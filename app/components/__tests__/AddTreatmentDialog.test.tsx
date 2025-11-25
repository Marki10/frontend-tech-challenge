import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTreatmentDialog } from "../AddTreatmentDialog";

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe("AddTreatmentDialog", () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockFetch.mockClear();
  });

  const renderComponent = () => {
    render(
      <AddTreatmentDialog onSubmit={mockOnSubmit}>
        <button>Open Dialog</button>
      </AddTreatmentDialog>
    );

    fireEvent.click(screen.getByText("Open Dialog"));
  };

  it("renders the dialog when trigger is clicked", () => {
    renderComponent();
    expect(screen.getByText("Add treatment")).toBeInTheDocument();
  });

  it("shows validation errors when form is submitted empty", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Save treatment"));

    expect(await screen.findByText("Patient is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Procedure is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("Dentist is required")).toBeInTheDocument();
    expect(await screen.findByText("Date is required")).toBeInTheDocument();

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    renderComponent();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await userEvent.type(screen.getByLabelText(/patient/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/procedure/i), "Root Canal");
    await userEvent.type(screen.getByLabelText(/dentist/i), "Dr. Smith");
    await userEvent.type(screen.getByLabelText(/date/i), "2025-12-31");
    await userEvent.type(
      screen.getByLabelText(/notes/i),
      "Patient has allergy to penicillin"
    );

    fireEvent.click(screen.getByText("Save treatment"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/treatments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: "John Doe",
          procedure: "Root Canal",
          dentist: "Dr. Smith",
          date: "2025-12-31",
          notes: "Patient has allergy to penicillin",
        }),
      });
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        patient: "John Doe",
        procedure: "Root Canal",
        dentist: "Dr. Smith",
        date: "2025-12-31",
        notes: "Patient has allergy to penicillin",
      });
    });
  });

  it("handles server validation errors", async () => {
    renderComponent();

    mockFetch.mockResolvedValueOnce({
      status: 422,
      json: async () => ({
        message: "Invalid treatment data",
      }),
    });

    await userEvent.type(screen.getByLabelText(/patient/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/procedure/i), "Root Canal");
    await userEvent.type(screen.getByLabelText(/dentist/i), "Dr. Smith");
    await userEvent.type(screen.getByLabelText(/date/i), "2025-12-31");

    fireEvent.click(screen.getByText("Save treatment"));

    expect(
      await screen.findByText("Invalid treatment data")
    ).toBeInTheDocument();
  });

  it("handles server errors", async () => {
    renderComponent();

    mockFetch.mockRejectedValueOnce(new Error("Server error"));

    await userEvent.type(screen.getByLabelText(/patient/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/procedure/i), "Root Canal");
    await userEvent.type(screen.getByLabelText(/dentist/i), "Dr. Smith");
    await userEvent.type(screen.getByLabelText(/date/i), "2025-12-31");

    fireEvent.click(screen.getByText("Save treatment"));

    expect(
      await screen.findByText("Failed to save treatment")
    ).toBeInTheDocument();
  });

  it("resets the form and closes the dialog on successful submission", async () => {
    renderComponent();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    await userEvent.type(screen.getByLabelText(/patient/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/procedure/i), "Root Canal");
    await userEvent.type(screen.getByLabelText(/dentist/i), "Dr. Smith");
    await userEvent.type(screen.getByLabelText(/date/i), "2025-12-31");

    fireEvent.click(screen.getByText("Save treatment"));

    await waitFor(() => {
      expect(screen.queryByText("Add treatment")).not.toBeInTheDocument();
    });
  });
});
