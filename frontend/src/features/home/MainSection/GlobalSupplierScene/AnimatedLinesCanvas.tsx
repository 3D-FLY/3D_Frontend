import { useEffect, useRef } from "react";

interface CanvasLine {
  start:  { x: number; y: number };
  ctrl:   { x: number; y: number };
  ctrl2?: { x: number; y: number };
  end:    { x: number; y: number };
  delay:    number;
  duration: number;
  stroke?:      string;
  strokeWidth?: number;
  dashSize?:    number;
  dashGap?:     number;
}

interface Props {
  lines:     CanvasLine[];
  className?: string;
}

function cubicPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number,
) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

function quadraticPoint(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number,
) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function AnimatedLinesCanvas({ lines, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr  = window.devicePixelRatio || 1;
    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;

    if (!cssW || !cssH) return;

    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const startTime = performance.now();
    let rafId: number;

    function draw(now: number) {
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, cssW, cssH);

      let allDone = true;

      for (const line of lines) {
        const lineElapsed = elapsed - line.delay;
        if (lineElapsed <= 0) { allDone = false; continue; }

        const rawProgress = Math.min(lineElapsed / line.duration, 1);
        if (rawProgress < 1) allDone = false;
        const progress = easeInOut(rawProgress);

        const sx = (pct: number) => pct * cssW / 100;
        const sy = (pct: number) => pct * cssH / 100;

        const p0 = { x: sx(line.start.x), y: sy(line.start.y) };
        const p1 = { x: sx(line.ctrl.x),  y: sy(line.ctrl.y)  };
        const p3 = { x: sx(line.end.x),   y: sy(line.end.y)   };
        const p2 = line.ctrl2 ? { x: sx(line.ctrl2.x), y: sy(line.ctrl2.y) } : null;

        ctx.save();
        ctx.strokeStyle = line.stroke      ?? "#4CAF50";
        ctx.lineWidth   = (line.strokeWidth ?? 0.4)  * cssW / 100;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.setLineDash([
          (line.dashSize ?? 1.5) * cssW / 100,
          (line.dashGap  ?? 1.5) * cssW / 100,
        ]);

        const STEPS   = 400;
        const maxStep = Math.floor(progress * STEPS);
        const getPoint = (t: number) =>
          p2
            ? cubicPoint(p0, p1, p2, p3, t)
            : quadraticPoint(p0, p1, p3, t);

        ctx.beginPath();
        const start = getPoint(0);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i <= maxStep; i++) {
          const pt = getPoint(i / STEPS);
          ctx.lineTo(pt.x, pt.y);
        }

        ctx.stroke();
        ctx.restore();
      }

      if (!allDone) {
        rafId = requestAnimationFrame(draw);
      }
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [lines]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`.trim()}
    />
  );
}
