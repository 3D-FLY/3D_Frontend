import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  type RefObject,
} from "react";

const MIN_THUMB_PX = 24;

interface ThumbMetrics {
  thumbH: number;
  thumbTop: number;
  maxThumbTop: number;
  maxScroll: number;
}

function calcThumb(el: HTMLElement, trackH: number): ThumbMetrics | null {
  const { scrollHeight: sh, clientHeight: ch, scrollTop: st } = el;
  if (sh <= ch + 1) return null;
  const thumbH = Math.min(Math.max((ch / sh) * trackH, MIN_THUMB_PX), trackH);
  const maxThumbTop = trackH - thumbH;
  const maxScroll = sh - ch;
  const thumbTop =
    maxThumbTop > 0 && maxScroll > 0 ? (st / maxScroll) * maxThumbTop : 0;
  return { thumbH, thumbTop, maxThumbTop, maxScroll };
}

function CustomScrollbar({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ThumbMetrics | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    setMetrics(calcThumb(el, track.clientHeight));
  }, [scrollRef]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRef, update]);

  const onThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    setIsDragging(true);

    const startY = e.clientY;
    const startScroll = el.scrollTop;
    const snap = calcThumb(el, track.clientHeight);
    if (!snap) return;
    const { maxThumbTop, maxScroll } = snap;

    const onMove = (ev: PointerEvent) => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop =
        startScroll + ((ev.clientY - startY) / maxThumbTop) * maxScroll;
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (e.target !== trackRef.current) return;
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const snap = calcThumb(el, track.clientHeight);
    if (!snap) return;
    const { thumbH, maxThumbTop, maxScroll } = snap;
    const y = e.clientY - track.getBoundingClientRect().top;
    const wantTop = Math.max(0, Math.min(y - thumbH / 2, maxThumbTop));
    el.scrollTop = maxThumbTop > 0 ? (wantTop / maxThumbTop) * maxScroll : 0;
  };

  const visible = metrics !== null;

  return (
    <div
      ref={trackRef}
      role="presentation"
      className={
        visible
          ? "relative w-1.5 shrink-0 overflow-hidden rounded-full bg-zinc-900"
          : "relative w-0 min-w-0 shrink-0 overflow-hidden p-0 opacity-0 pointer-events-none"
      }
      onPointerDown={onTrackPointerDown}
    >
      {visible && (
        <div
          className={`absolute inset-x-0 cursor-grab rounded-full bg-green-500 hover:brightness-[0.95] active:cursor-grabbing ${
            isDragging ? "" : "transition-[top] duration-150 ease-out"
          }`}
          style={{ height: metrics.thumbH, top: metrics.thumbTop }}
          onPointerDown={onThumbPointerDown}
        />
      )}
    </div>
  );
}

interface ScrollableContentProps {
  children: React.ReactNode;
  className?: string;
  scrollbarSide?: "left" | "right";
}

export default function ScrollableContent({
  children,
  className = "",
  scrollbarSide = "right",
}: ScrollableContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () =>
      setShowFade(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) return;

      e.stopPropagation();
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const bar = (
    <CustomScrollbar scrollRef={scrollRef as RefObject<HTMLDivElement>} />
  );

  const textBottomFade =
    "linear-gradient(to bottom, #000 0%, #000 calc(100% - 2.25rem), transparent 100%)";

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-row gap-4">
        {scrollbarSide === "left" && bar}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div
            ref={scrollRef}
            className={`scrollbar-native-hidden min-h-0 flex-1 overflow-y-auto ${className}`}
            style={{
              WebkitMaskImage: showFade ? textBottomFade : "none",
              maskImage: showFade ? textBottomFade : "none",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            {children}
          </div>
        </div>
        {scrollbarSide === "right" && bar}
      </div>
    </div>
  );
}