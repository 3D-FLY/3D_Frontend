import LogoSvg from "../assets/icons/logo-icon.svg?react";

export default function LogoIcon({ className = "" }) {
  return (
    <LogoSvg
      aria-label="Logo icon"
      className={`text-green ${className}`}
    />
  );
}
