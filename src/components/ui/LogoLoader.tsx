import React, { useEffect, useRef } from "react";

interface LogoLoaderProps {
  size?: number;
  gap?: number;
}

const keyframeCSS = `
  @keyframes logo-breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes logo-dot-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

const LogoLoader: React.FC<LogoLoaderProps> = ({ size = 400, gap = 20 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));

    // Set initial state — invisible and shifted down
    paths.forEach((p) => {
      p.style.opacity = "0";
      p.style.transform = "translateY(8px)";
      p.style.transition = "none";
    });

    // Force reflow so initial styles are committed before transition starts
    svg.getBoundingClientRect();

    // Double RAF ensures initial painted frame is flushed before we add transitions
    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        paths.forEach((p, i) => {
          p.style.transition = `opacity 120ms ease-out ${i * 75}ms, transform 120ms ease-out ${i * 75}ms`;
          p.style.opacity = "1";
          p.style.transform = "translateY(0)";
        });
      });
    });

    // Phase 2 starts after every path has finished its entrance
    const buildUpMs = (paths.length - 1) * 75 + 120 + 100;
    const breatheTimer = setTimeout(() => {
      paths.forEach((p) => {
        const dur = 2000 + Math.random() * 2000;
        const delay = Math.random() * 2000;
        p.style.transition = "";
        p.style.animation = `logo-breathe ${dur}ms ease-in-out ${delay}ms infinite`;
      });
    }, buildUpMs);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(breatheTimer);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center"
      style={{ gap }}
    >
      <style>{keyframeCSS}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 2475 1684"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: "auto" }}
      >
        <path d="M1810.57 244.779L2475 0C2473.43 8.6708 2427.54 201.511 2246.51 335.452L1810.57 244.779Z" fill="#68BE37"/>
        <path d="M1810.57 244.78L2246.51 335.452C2203.07 367.597 2151.84 396.348 2091.54 418.338C2090.35 418.766 2089.15 419.223 2087.92 419.651L2086.5 420.192L1634.5 593.437L1573.66 556.187L1810.57 244.78Z" fill="#52AE38"/>
        <path d="M2313.39 379.036C2287.07 415.744 2182.7 611.065 1998.59 692.097L1701.36 634.368L1634.5 593.438L2086.5 420.193L2087.92 419.652C2089.15 419.224 2090.35 418.767 2091.54 418.339C2091.54 418.339 2199.3 408.499 2313.39 379.036Z" fill="#2A7D28"/>
        <path d="M1998.59 692.097L2109.29 717.909C2109.29 717.909 2017.19 821.16 1873.78 914.914L1701.36 893.151V844.549L1998.59 692.097Z" fill="#207A21"/>
        <path d="M1998.59 692.095L1701.36 844.548V634.366L1998.59 692.095Z" fill="#19621C"/>
        <path d="M1701.36 893.148V1188.53L1540.18 1099.02V942.635C1647.34 913.228 1701.36 893.148 1701.36 893.148Z" fill="#1F6C20"/>
        <path d="M1701.36 844.548V893.15C1701.36 893.15 1647.34 913.229 1540.18 942.636V731.456L1701.36 634.366V844.548Z" fill="#2A7D26"/>
        <path d="M1573.67 556.184L1634.5 593.435L1701.36 634.364L1540.18 731.454L1237.5 548.084V350.424L1400.22 450.024L1573.67 556.184Z" fill="#53AF36"/>
        <path d="M1701.36 1188.53L1612.03 1255.1L1452.56 1373.24L1323.9 1469.42L1237.5 1533.99V1315.71L1540.18 1099.03L1701.36 1188.53Z" fill="#1E681F"/>
        <path d="M1628.06 1278.66L1697 1380.08L1637.01 1638.18L1490.89 1469.02L1628.06 1278.66Z" fill="#18691F"/>
        <path d="M1612.03 1255.1L1628.06 1278.66L1490.89 1469.02L1452.56 1373.24L1612.03 1255.1Z" fill="#12581B"/>
        <path d="M1540.18 942.637V1099.02L1237.5 1315.71V1014.37C1364.23 988.33 1465.2 963.201 1540.18 942.637Z" fill="#13591B"/>
        <path d="M1540.18 731.457V942.637C1465.2 963.201 1364.23 988.33 1237.5 1014.37V807.526L1540.18 731.457Z" fill="#36952D"/>
        <path d="M1540.18 731.456L1237.5 807.526V548.086L1540.18 731.456Z" fill="#176518"/>
        <path d="M1400.22 258.899V450.028L1237.5 350.428V118.056L1400.22 258.899Z" fill="#1E711D"/>
        <path d="M1323.9 1469.42L1237.5 1683.7V1533.99L1323.9 1469.42Z" fill="#13561A"/>
        <path d="M1237.5 1533.99V1683.7L1151.11 1469.42L1237.5 1533.99Z" fill="#1A6A21"/>
        <path d="M1237.5 1315.71V1533.99L1151.11 1469.42L1022.47 1373.24L862.973 1255.1L773.67 1188.53L934.821 1099.03L1237.5 1315.71Z" fill="#419A32"/>
        <path d="M1237.5 1014.37V1315.71L934.821 1099.03V942.609C1009.81 963.203 1110.78 988.331 1237.5 1014.37Z" fill="#1F7022"/>
        <path d="M1237.5 807.526V1014.37C1110.78 988.33 1009.81 963.201 934.821 942.608V731.457L1237.5 807.526Z" fill="#4CA835"/>
        <path d="M1237.5 548.086V807.526L934.821 731.456L1237.5 548.086Z" fill="#277F25"/>
        <path d="M1237.5 548.084L934.821 731.454L773.67 634.364L840.526 593.435L901.365 556.213L1074.81 450.024L1237.5 350.424V548.084Z" fill="#75CB41"/>
        <path d="M1237.5 118.056V350.428L1074.81 450.028V258.899L1237.5 118.056Z" fill="#379E2D"/>
        <path d="M1022.47 1373.24L984.108 1469.02L846.973 1278.66L862.974 1255.1L1022.47 1373.24Z" fill="#207022"/>
        <path d="M846.971 1278.66L984.107 1469.02L837.986 1638.18L778.004 1380.08L846.971 1278.66Z" fill="#319329"/>
        <path d="M934.821 942.606V1099.02L773.67 1188.53V893.148C773.67 893.148 827.663 913.228 934.821 942.606Z" fill="#5FBB3D"/>
        <path d="M934.821 731.456V942.608C827.663 913.23 773.67 893.15 773.67 893.15V634.366L934.821 731.456Z" fill="#6AC33E"/>
        <path d="M901.365 556.216L840.526 593.437L388.504 420.192L387.077 419.651C385.851 419.223 384.653 418.766 383.455 418.338C323.187 396.348 271.961 367.597 228.521 335.452L664.429 244.78L901.365 556.216Z" fill="#51AE38"/>
        <path d="M840.526 593.438L773.669 634.368L476.409 692.097C292.297 611.065 187.933 415.744 161.636 379.036C275.697 408.499 383.454 418.339 383.454 418.339C384.652 418.767 385.85 419.224 387.077 419.652L388.503 420.193L840.526 593.438Z" fill="#36912E"/>
        <path d="M773.668 844.549V893.151L601.222 914.914C457.812 821.16 365.741 717.909 365.741 717.909L476.408 692.097L773.668 844.549Z" fill="#34962B"/>
        <path d="M773.668 634.366V844.548L476.407 692.095L773.668 634.366Z" fill="#257B24"/>
        <path d="M664.429 244.779L228.521 335.452C47.4612 201.539 1.56873 8.6708 0 0L664.429 244.779Z" fill="#6ABF37"/>
      </svg>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#5ac422",
              animation: `logo-dot-bounce 0.9s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LogoLoader;
