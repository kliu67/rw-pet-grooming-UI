import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceConfigurations } from "./ServiceConfigurations";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn()
}));

vi.mock("@/components/Table", () => ({
  Table: ({ data }) => {
    return (
      <div data-testid="table">
        {data.map((row) => (
          <div key={row.id}>
            <span>{row.service}</span>
            <span>{row.breed}</span>
            <span>{row.weightClass}</span>
            <span>{row.durationMinutes}</span>
            <span>{row.isActive ? "Yes" : "No"}</span>
          </div>
        ))}
      </div>
    );
  }
}));

import { useQuery } from "@tanstack/react-query";

const mockServiceConfigurations = [
  {
    id: 1,
    service_id: 1,
    breed_id: 10,
    weight_class_id: 100,
    price: 40,
    duration_minutes: 60,
    is_active: true,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-02T00:00:00.000Z"
  },
  {
    id: 2,
    service_id: 2,
    breed_id: 20,
    weight_class_id: 200,
    price: 55,
    duration_minutes: 90,
    is_active: false,
    created_at: "2025-01-03T00:00:00.000Z",
    updated_at: "2025-01-04T00:00:00.000Z"
  }
];

const mockServices = [
  { id: 1, name: "Bath" },
  { id: 2, name: "Trim" }
];

const mockBreeds = [
  { id: 10, name: "Poodle" },
  { id: 20, name: "Labrador" }
];

const mockWeightClasses = [
  { id: 100, label: "Small" },
  { id: 200, label: "Large" }
];

function mockAllQueries({
  serviceConfigurationsData = mockServiceConfigurations,
  servicesData = mockServices,
  breedsData = mockBreeds,
  weightClassesData = mockWeightClasses,
  serviceConfigurationsIsLoading = false,
  servicesIsLoading = false,
  breedsIsLoading = false,
  weightClassesIsLoading = false,
  serviceConfigurationsError = null,
  servicesError = null,
  breedsError = null,
  weightClassesError = null
} = {}) {
  useQuery.mockImplementation(({ queryKey }) => {
    const key = queryKey?.[0];

    if (key === "serviceConfigurations") {
      return {
        data: serviceConfigurationsData,
        isLoading: serviceConfigurationsIsLoading,
        error: serviceConfigurationsError
      };
    }
    if (key === "services") {
      return { data: servicesData, isLoading: servicesIsLoading, error: servicesError };
    }
    if (key === "breeds") {
      return { data: breedsData, isLoading: breedsIsLoading, error: breedsError };
    }
    if (key === "weightClasses") {
      return {
        data: weightClassesData,
        isLoading: weightClassesIsLoading,
        error: weightClassesError
      };
    }

    return { data: [], isLoading: false, error: null };
  });
}

describe("ServiceConfigurations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockAllQueries({ serviceConfigurationsIsLoading: true });

    render(<ServiceConfigurations />);
    expect(screen.getByText("general.loading")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockAllQueries({ breedsError: new Error("failed") });

    render(<ServiceConfigurations />);
    expect(
      screen.getByText("serviceConfigurations.errors.loading")
    ).toBeInTheDocument();
  });

  it("renders mapped values and active labels", () => {
    mockAllQueries();

    render(<ServiceConfigurations />);

    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.getByText("Trim")).toBeInTheDocument();
    expect(screen.getByText("Poodle")).toBeInTheDocument();
    expect(screen.getByText("Labrador")).toBeInTheDocument();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("filters service configurations by search input", () => {
    mockAllQueries();

    render(<ServiceConfigurations />);
    fireEvent.change(screen.getByPlaceholderText("serviceConfigurations.search"), {
      target: { value: "poodle" }
    });

    expect(screen.getByText("Bath")).toBeInTheDocument();
    expect(screen.queryByText("Trim")).not.toBeInTheDocument();
  });

  it("uses fallback labels when related records are missing", () => {
    mockAllQueries({
      servicesData: [{ id: 1, name: "Bath" }],
      breedsData: [{ id: 10, name: "Poodle" }],
      weightClassesData: [{ id: 100, label: "Small" }]
    });

    render(<ServiceConfigurations />);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});
