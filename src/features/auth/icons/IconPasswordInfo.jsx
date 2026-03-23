import InfoSvg from "./Info.svg?react";

/**
 * Green exclamation-circle icon used to trigger the password-rules tooltip.
 * Source: src/auth/Info.svg
 */
export default function IconPasswordInfo({ className = "", ...props }) {
  return <InfoSvg className={`w-[28px] h-[28px] ${className}`} {...props} />;
}
