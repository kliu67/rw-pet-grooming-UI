import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("renders the active tab content by default", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account" forceMount>
          Account content
        </TabsContent>
        <TabsContent value="billing" forceMount>
          Billing content
        </TabsContent>
      </Tabs>
    );

    const accountContent = screen.getByText("Account content");
    const billingContent = screen.getByText("Billing content");

    expect(accountContent).toHaveAttribute("data-state", "active");
    expect(billingContent).toHaveAttribute("data-state", "inactive");
  });

  it("applies data-slot attributes for styled components", () => {
    render(
      <Tabs defaultValue="first" className="tabs-root">
        <TabsList className="tabs-list">
          <TabsTrigger value="first" className="tabs-trigger">
            First
          </TabsTrigger>
        </TabsList>
        <TabsContent value="first" className="tabs-content">
          First content
        </TabsContent>
      </Tabs>
    );

    expect(screen.getByText("First").closest("[data-slot='tabs-trigger']")).toHaveClass(
      "tabs-trigger"
    );
    expect(screen.getByText("First content")).toHaveAttribute(
      "data-slot",
      "tabs-content"
    );
  });
});
