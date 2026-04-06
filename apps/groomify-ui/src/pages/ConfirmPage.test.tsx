import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmPage } from "./ConfirmPage";

const navigateMock = vi.fn();
const useQueryMock = vi.fn();
const handleDownloadPdfMock = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ appId: "123" }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}));

vi.mock("@shared-utils/pdf", () => ({
  handleDownloadPdf: (...args: unknown[]) => handleDownloadPdfMock(...args),
}));

describe("ConfirmPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders confirmation details and price rows", () => {
    useQueryMock.mockReturnValue({
      data: {
        appointment_number: "ABC-123",
        service_name: "Full Groom",
        start_time: "2026-04-10T15:30:00.000Z",
        duration_snapshot: 90,
        pet_name: "Milo",
        breed_name: "Poodle",
        weight_class_label: "Small",
        service_base_price: 45.5,
        price_snapshot: 60.75,
        client_first_name: "Jane",
        client_last_name: "Doe",
        client_email: "jane@example.com",
        client_phone: "555-1234",
      },
    });

    render(<ConfirmPage />);

    expect(screen.getByText("ABC-123")).toBeInTheDocument();
    expect(screen.getByText("Full Groom")).toBeInTheDocument();
    expect(screen.getByText("Milo")).toBeInTheDocument();
    expect(screen.getByText("$45.5")).toBeInTheDocument();
    expect(screen.getByText("$15.25")).toBeInTheDocument();
    expect(screen.getByText("$60.75")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("calls pdf helper when download is clicked", async () => {
    useQueryMock.mockReturnValue({
      data: {
        appointment_number: "ABC-123",
        service_base_price: 10,
        price_snapshot: 20,
      },
    });
    handleDownloadPdfMock.mockResolvedValue(undefined);

    render(<ConfirmPage />);

    fireEvent.click(screen.getByRole("button", { name: "confirmStep.download" }));

    await waitFor(() => {
      expect(handleDownloadPdfMock).toHaveBeenCalledTimes(1);
      expect(handleDownloadPdfMock).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmData: expect.objectContaining({
            appointment_number: "ABC-123",
          }),
        }),
      );
    });
  });

  it("navigates home when Book Another is clicked", () => {
    useQueryMock.mockReturnValue({ data: {} });

    render(<ConfirmPage />);
    fireEvent.click(screen.getByRole("button", { name: "confirmStep.bookAnother" }));

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("keeps download disabled when confirmation data is unavailable", () => {
    useQueryMock.mockReturnValue({ data: undefined });

    render(<ConfirmPage />);
    const downloadButton = screen.getByRole("button", { name: "confirmStep.download" });

    expect(downloadButton).toBeDisabled();
    fireEvent.click(downloadButton);
    expect(handleDownloadPdfMock).not.toHaveBeenCalled();
  });
});
