import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalBehaviorOptions {
  open: boolean;
  panelRef: RefObject<HTMLElement | null>;
  /** Called on Escape (only when dismissible) */
  onClose: () => void;
  dismissible?: boolean;
  /** Element to focus when the modal opens; defaults to the last focusable */
  getInitialFocus?: (panel: HTMLElement) => HTMLElement | null | undefined;
}

// Shared modal behavior: scroll lock, Escape, Tab focus trap, initial focus and
// focus return. Used by ConfirmDialog and BottomSheet.
export default function useModalBehavior({
  open,
  panelRef,
  onClose,
  dismissible = true,
  getInitialFocus,
}: ModalBehaviorOptions) {
  // Latest callbacks without re-running the effect on every render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const initialFocusRef = useRef(getInitialFocus);
  initialFocusRef.current = getInitialFocus;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const target = initialFocusRef.current?.(panel) ?? items[items.length - 1];
      target?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items || items.length === 0) return;
      const first = items[0] as HTMLElement;
      const last = items[items.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, dismissible, panelRef]);
}
