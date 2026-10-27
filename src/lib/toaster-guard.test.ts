import { keepOpenOnToasterPointerDown } from "./toaster-guard";

function pointerDownOn(target: EventTarget) {
  const event = new CustomEvent("dismissableLayer.pointerDownOutside", {
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

describe("keepOpenOnToasterPointerDown", () => {
  let toastButton: HTMLButtonElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    const toaster = document.createElement("ol");
    toaster.setAttribute("data-sonner-toaster", "");
    toastButton = document.createElement("button");
    toaster.append(toastButton);
    outside = document.createElement("div");
    document.body.append(toaster, outside);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("prevents the dismiss when the press lands inside the toaster", () => {
    const event = pointerDownOn(toastButton);
    keepOpenOnToasterPointerDown()(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("lets the dismiss through when the press lands outside the toaster", () => {
    const event = pointerDownOn(outside);
    keepOpenOnToasterPointerDown()(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("lets the dismiss through when the target is not an element", () => {
    const event = pointerDownOn(document);
    keepOpenOnToasterPointerDown()(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("runs the caller's handler before deciding", () => {
    const preventedWhenCalled: boolean[] = [];
    const handler = jest.fn((e: Event) => {
      preventedWhenCalled.push(e.defaultPrevented);
    });
    const event = pointerDownOn(toastButton);
    keepOpenOnToasterPointerDown(handler)(event);

    expect(handler).toHaveBeenCalledWith(event);
    expect(preventedWhenCalled).toEqual([false]);
    expect(event.defaultPrevented).toBe(true);
  });

  it("keeps a dismiss the caller already prevented outside the toaster", () => {
    const event = pointerDownOn(outside);
    keepOpenOnToasterPointerDown((e: Event) => e.preventDefault())(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
