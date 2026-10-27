const TOASTER_SELECTOR = "[data-sonner-toaster]";

/*
 * A modal Drawer/Dialog dismisses on any pointerdown outside its content, and
 * the toasts render outside it: pressing a toast's close or action button would
 * also close the modal underneath.
 */
export function keepOpenOnToasterPointerDown<E extends Event>(
  handler?: (event: E) => void
) {
  return (event: E) => {
    handler?.(event);
    if (
      event.target instanceof Element &&
      event.target.closest(TOASTER_SELECTOR)
    ) {
      event.preventDefault();
    }
  };
}
