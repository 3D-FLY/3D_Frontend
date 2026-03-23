import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./registration-form.css";
// @ts-expect-error js module
import IconGoogle from "./icons/IconGoogle.jsx";
import IconTitleUnderline from "./icons/IconTitleUnderline.js";
import Input from "../../components/ui/input/Input.js";
import Button from "../../components/ui/Button.jsx";
import Turtle from "../../components/ui/Turtle.jsx";
// @ts-expect-error js module
import AmbientGlowBackdrop from "../../components/ui/AmbientGlowBackdrop.jsx";

type FormState = {
  usernameOrEmail: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.usernameOrEmail.trim())
    errors.usernameOrEmail = "USERNAME OR EMAIL IS REQUIRED";
  if (!form.password) errors.password = "PASSWORD IS REQUIRED";
  return errors;
}

const INITIAL_FORM: FormState = {
  usernameOrEmail: "",
  password: "",
};

export default function LoginForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
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
            YOU&apos;RE IN!
          </h3>
          <p className="text-gray text-sm uppercase tracking-wide">
            SIGNED IN SUCCESSFULLY.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col w-full min-h-0 bg-dark items-center overflow-y-auto overflow-x-hidden">
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

      <div className="reg-form-content-in relative z-10 flex flex-col items-center justify-start gap-6 w-full max-w-[850px] h-full mt-18 px-6 py-8 mb-[50vh]">
        <div className="relative w-full flex items-center justify-center mb-7">
          <IconTitleUnderline className="w-full h-full" />
          <h1 className="absolute z-10 text-[#DBDADA] italic font-extrabold text-[clamp(2.8rem,8vw,5.5rem)] leading-none tracking-tight uppercase">
            SIGN IN
          </h1>
        </div>

        <IconGoogle onClick={() => {}} className="w-[clamp(150px,60vw,280px)]" />

        <div className="flex items-center justify-center py-0.5">
          <span className="text-[#DBDADA] text-[clamp(1.2rem,4vw,2rem)] font-semibold italic tracking-widest">
            OR
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full max-w-[450px]"
        >
          <div className="flex flex-col gap-2.5">
            <Input
              label="USERNAME OR EMAIL"
              placeholder="ENTER YOUR USERNAME"
              value={form.usernameOrEmail}
              onChange={setField("usernameOrEmail")}
              error={errors.usernameOrEmail}
              autoComplete="username"
            />

            <Input
              label="PASSWORD"
              password
              placeholder="ENTER YOUR PASSWORD"
              value={form.password}
              onChange={setField("password")}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          <div className="pt-8 pb-3 flex justify-center w-full">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              hovering="darkBg"
              className="w-[70%] rounded-[12px] font-extrabold italic tracking-widest !text-base"
            >
              SIGN IN
            </Button>
          </div>

          <p className="text-center text-[10px] font-medium italic text-[#DFDFDF] uppercase tracking-widest mt-2">
            <span className="text-[#DFDFDF]">DON&apos;T HAVE AN ACCOUNT?</span>
            <Link
              to="/register"
              className="font-bold text-[#DFDFDF] underline underline-offset-[3px] decoration-[#DFDFDF] hover:text-green hover:decoration-green transition-colors"
            >
              CREATE ONE
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
