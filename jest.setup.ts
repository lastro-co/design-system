import "@testing-library/jest-dom";

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Stub pointer capture and scrollIntoView for Radix UI (Select, etc.) in JSDOM
Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
Element.prototype.setPointerCapture = jest.fn();
Element.prototype.releasePointerCapture = jest.fn();
Element.prototype.scrollIntoView = jest.fn();

// Mock window.location to avoid JSDOM navigation errors
delete (window as any).location;
window.location = {
  href: "http://localhost",
  origin: "http://localhost",
  protocol: "http:",
  host: "localhost",
  hostname: "localhost",
  port: "",
  pathname: "/",
  search: "",
  hash: "",
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => "http://localhost"),
} as any;

// Suppress JSDOM navigation errors
const originalConsoleError = console.error;

const isNotImplementedError = (
  value: unknown
): value is Error & { type?: string } =>
  value instanceof Error &&
  (value as { type?: string }).type === "not implemented";

console.error = (...args: unknown[]) => {
  const [first] = args;

  if (
    typeof first === "string" &&
    first.includes("Not implemented: navigation")
  ) {
    return;
  }

  if (isNotImplementedError(first)) {
    return;
  }

  originalConsoleError.apply(console, args as Parameters<typeof console.error>);
};
