import LogoTextSvg from "../assets/logo-text.svg?react";

export default function LogoText({ className = "" }) {
  return (
    <LogoTextSvg
      aria-label="Company name"
      className={`text-gray ${className}`}
    />
  );
}
