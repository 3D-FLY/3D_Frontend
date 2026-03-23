import HideIconSvg from "./HideIcon 1.svg?react";

/**
 * Crossed-out eye icon — indicates password is currently hidden.
 * Click to reveal the password.
 * Source: src/auth/HideIcon 1.svg
 */
export default function IconEyeHide({ className = "", ...props }) {
  return <HideIconSvg className={`w-5 h-4 ${className}`} {...props} />;
}
