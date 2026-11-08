import { useEffect, useState } from "react";

/**
 * Measures the real height of the sticky site `<header>` (the navbar's height depends on its content,
 * so it is not exactly the `--nav-h` constant). Pages with their own sticky bars set `--nav-h`
 * from this value so the bars sit flush under the navbar.
 */
export default function useNavbarHeight(fallback = 72): number {
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setHeight(Math.round(header.getBoundingClientRect().height));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return height;
}
