import { useEffect, useState } from "react";

export interface VisualViewportBox {
  height: number;
  offsetTop: number;
}

// The part of the screen that is actually visible. On iOS the on-screen keyboard
// shrinks the visual viewport but not the layout (and dvh), so sheets with a
// search field size themselves from this to stay above the keyboard.
export default function useVisualViewport(active: boolean): VisualViewportBox | null {
  const [box, setBox] = useState<VisualViewportBox | null>(null);

  useEffect(() => {
    const viewport = typeof window !== "undefined" ? window.visualViewport : null;
    if (!active || !viewport) return;
    const update = () => setBox({ height: viewport.height, offsetTop: viewport.offsetTop });
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [active]);

  return active ? box : null;
}
