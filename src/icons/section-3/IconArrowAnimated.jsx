import React, { useRef, useState, useEffect } from "react";

const ARROW_PATHS = {
  right:
    "M29.8419 27.7651C30.3118 28.105 30.9682 27.9995 31.308 27.5296L36.8457 19.8722C37.1856 19.4023 37.0801 18.7459 36.6102 18.4061C36.1403 18.0663 35.4839 18.1717 35.1441 18.6416L30.2216 25.4482L23.4151 20.5257C22.9452 20.1859 22.2888 20.2914 21.9489 20.7613C21.6091 21.2312 21.7146 21.8876 22.1845 22.2274L29.8419 27.7651ZM0.166504 1.49121L0.33304 2.52792C8.71562 1.18135 15.2451 3.06786 20.029 7.31739C24.8449 11.5954 28.0236 18.3855 29.4205 27.0808L30.4572 26.9143L31.4939 26.7478C30.0508 17.7643 26.7234 10.4551 21.4236 5.74736C16.0918 1.01113 8.89587 -0.974525 -3.17528e-05 0.454502L0.166504 1.49121Z",
  left: "M7.20306 27.7651C6.73317 28.105 6.07676 27.9995 5.73694 27.5296L0.199186 19.8722C-0.140637 19.4023 -0.0351922 18.7459 0.434703 18.4061C0.904598 18.0663 1.56101 18.1717 1.90083 18.6416L6.82328 25.4482L13.6299 20.5257C14.0998 20.1859 14.7562 20.2914 15.096 20.7613C15.4358 21.2312 15.3304 21.8876 14.8605 22.2274L7.20306 27.7651ZM36.8784 1.49121L36.7119 2.52792C28.3293 1.18135 21.7998 3.06786 17.0159 7.31739C12.2 11.5954 9.02127 18.3855 7.62447 27.0808L6.58776 26.9143L5.55105 26.7478C6.99414 17.7643 10.3215 10.4551 15.6213 5.74736C20.9531 1.01113 28.149 -0.974525 37.045 0.454502L36.8784 1.49121Z",
};

const FILL_COLOR = "#DADADA";
const DRAW_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * חץ עם אפקט ציור (stroke מצויר) ואז מילוי — למובייל בסקשיין How Does It Work.
 * @param {"left" | "right"} direction
 * @param {boolean} inView - האם הסקשיין גלוי (מתחיל את האנימציה)
 * @param {number} drawDelayMs - delay לפני תחילת ציור (למשל 200ms אחרי הכרטיס)
 * @param {number} drawDurationMs - משך ציור (600ms מומלץ)
 */
export default function IconArrowAnimated({
  direction = "right",
  className = "",
  inView = false,
  drawDelayMs = 200,
  drawDurationMs = 600,
}) {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(200);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPathLength(len);
  }, []);

  const d = ARROW_PATHS[direction] ?? ARROW_PATHS.right;
  const offset = inView ? 0 : pathLength;
  const strokeTransition = `stroke-dashoffset ${drawDurationMs}ms ${DRAW_EASING} ${drawDelayMs}ms`;
  const fillDelayMs = drawDelayMs + drawDurationMs;
  const fillOpacity = inView ? 1 : 0;
  const fillTransition = `opacity 150ms ease-out ${fillDelayMs}ms`;

  return (
    <svg
      width="38"
      height="28"
      viewBox="0 0 38 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* אפקט ציור: קו מצויר */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={FILL_COLOR}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={offset}
        style={{ transition: strokeTransition }}
      />
      {/* מילוי — מופיע אחרי סיום הציור */}
      <path
        d={d}
        fill={FILL_COLOR}
        style={{
          opacity: fillOpacity,
          transition: fillTransition,
        }}
      />
    </svg>
  );
}
