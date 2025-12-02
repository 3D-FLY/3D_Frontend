import React from "react";

export default function Button({
  children = "TRY NOW",
  onClick,
  className = "",
  variant = "primary",
  size = "sm",
  disabled = false,
  hovering = "",
  ...props
}) {
  const baseClasses =
    "font-bold uppercase tracking-wide transition-all duration-200 rounded-[10px] justify-center items-center flex";

  const hoverings = {
    darkBg: "transition-all duration-400 hover:scale-105 hover:bg-gray ",
    garyBg: "transition-all duration-400 hover:scale-105 hover:bg-dark",
  };
  //יש דילמה - הבעיה היא שאני לא מצליח לעשות הובר החלפת צבע לכפתור יש לו עיצוב עם גרדיאנט.
  // כרגע הכפתורים שמתחלף להם הצבע בהובר הם ללא גרדיאנט

  // style={{
  //   background:
  //     "radial-gradient(circle at center, #7bd445 0%, #5ac422 70%, #4a9c1b 100%)",
  // }}

  // השתמש במחלקת Tailwind עבור רקע גרדיאנט עגול מותאם אישית
  // יש להוסיף את המחלקה הזו כחלק מה-props או ב-className
  // לדוג' (ב-className): 'bg-[radial-gradient(circle_at_center,_#7bd445_0%,_#5ac422_70%,_#4a9c1b_100%)]'

  const variants = {
    primary: "bg-green text-white ",
    secondary: "bg-green text-black   ",
    tertiary: "bg-dark text-green   ",
    outline: "border-3 border-green text-green  ",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      className={`${baseClasses}${hoverings[hovering]} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
