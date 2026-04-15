import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "./LanguageSwticher";

const changeLanguageMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/i18n", () => ({
  default: {
    resolvedLanguage: "en",
    changeLanguage: (...args: any[]) => changeLanguageMock(...args),
  },
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    changeLanguageMock.mockClear();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });

  it("renders both language options", () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole("button", { name: /English/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /中文/i })).toBeInTheDocument();
  });

  it("changes language and persists selection", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    render(<LanguageSwitcher compact tiny />);

    fireEvent.click(screen.getByRole("button", { name: /中文/i }));

    expect(changeLanguageMock).toHaveBeenCalledWith("zh-CN");
    expect(setItemSpy).toHaveBeenCalledWith("lang", "zh-CN");
  });
});

