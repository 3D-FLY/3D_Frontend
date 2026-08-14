import GoogleSvg from "./Google (1).svg?react";

export default function IconGoogle({ onClick, className = "", ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer hover:opacity-80 transition-opacity duration-200 ${className}`}
      aria-label="Continue with Google"
      {...props}
    >
      <GoogleSvg className="w-full h-auto" />
    </button>
  );
}
