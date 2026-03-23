import React, { useState } from "react";
import "./registration-form.css";
// @ts-expect-error js module
import PasswordRulesTooltip from "./components/PasswordRulesTooltip.jsx";
// @ts-expect-error js module
import IconPasswordInfo from "./icons/IconPasswordInfo.jsx";
// @ts-expect-error js module
import IconGoogle from "./icons/IconGoogle.jsx";
import IconTitleUnderline from "./icons/IconTitleUnderline.js";
import Input from "../../components/ui/input/Input.js";
import Button from "../../components/ui/Button.jsx";
import Turtle from "../../components/ui/Turtle.jsx";
// @ts-expect-error js module
import AmbientGlowBackdrop from "../../components/ui/AmbientGlowBackdrop.jsx";

type FormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.username.trim()) errors.username = "Username is required";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";

  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 8)
    errors.password = "Password must be at least 8 characters";

  if (!form.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
}

const INITIAL_FORM: FormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const setField =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="relative flex flex-1 flex-col w-full bg-dark items-center justify-center overflow-hidden py-12">
        <AmbientGlowBackdrop />
        <Turtle
          bottom="0"
          left="50%"
          height="50vh"
          translateX="-50%"
          translateY="0"
          opacity={0.1}
          zIndex={0}
        />
        <div className="reg-form-content-in relative z-10 flex flex-col items-center gap-4 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-green/10 border border-green/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#5ac422"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-white text-xl font-black italic uppercase">
            Account created!
          </h3>
          <p className="text-gray text-sm">
            Check your email to verify your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col w-full min-h-0 bg-dark items-center overflow-y-auto overflow-x-hidden">
      <AmbientGlowBackdrop />
      {/* Turtle background decoration */}
      <Turtle
        bottom="0"
        left="50%"
        height="50vh"
        translateX="-50%"
        translateY="0"
        opacity={0.1}
        zIndex={0}
      />

      {/* Main content container — enter animation in registration-form.css */}
      <div className="reg-form-content-in relative z-10 flex flex-col items-center justify-start gap-6 w-full max-w-[850px] h-full mt-18 px-6 py-8 mb-[50vh]">
        {/* Title + underline */}
        <div className="relative w-full flex items-center justify-center mb-7">
          <IconTitleUnderline className="w-full h-full" />
          <h1 className="absolute z-10 text-[#DBDADA] italic font-extrabold text-[clamp(2.8rem,8vw,5.5rem)] leading-none tracking-tight uppercase">
            Sign Up
          </h1>
        </div>

        {/* Google sign-up button */}
        <IconGoogle onClick={() => {}} className="w-[clamp(150px,60vw,280px)]" />

        {/* OR separator */}
        <div className="flex items-center justify-center py-0.5">
          <span className="text-[#DBDADA] text-[clamp(1.2rem,4vw,2rem)] font-semibold italic tracking-widest">
            OR
          </span>
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full max-w-[450px]"
        >
          {/* Inputs group */}
          <div className="flex flex-col gap-2.5">
            <Input
              label="Username"
              placeholder="Choose a username"
              value={form.username}
              onChange={setField("username")}
              error={errors.username}
              autoComplete="username"
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={setField("email")}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                password
                placeholder="Create a password"
                value={form.password}
                onChange={setField("password")}
                error={errors.password}
                autoComplete="new-password"
              />

              <div
                className="absolute left-full bottom-0 top-[calc(50%+10px)] -translate-y-1/2 ml-3 flex items-center"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <button
                  type="button"
                  className="flex items-center cursor-pointer"
                  aria-label="Password requirements"
                  tabIndex={-1}
                >
                  <IconPasswordInfo />
                </button>
                <PasswordRulesTooltip
                  password={form.password}
                  visible={tooltipVisible}
                />
              </div>
            </div>

            <Input
              label="Confirm Password"
              password
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          {/* Submit button */}
          <div className="pt-8 pb-3 flex justify-center w-full">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              hovering="darkBg"
              className="w-[70%] rounded-[12px] font-extrabold italic tracking-widest !text-base"
            >
              Create Account
            </Button>
          </div>

          {/* Sign-in link */}
          <p className="text-center text-[10px] font-medium italic text-[#DFDFDF] uppercase tracking-widest mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#DFDFDF] font-bold underline underline-offset-2 hover:text-green transition-colors"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
