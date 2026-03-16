import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user", email: "test@example.com" },
    isAuthenticated: true,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  }),
  AuthProvider: ({ children }) => children
}));

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
