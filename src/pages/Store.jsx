import React from "react";
import Background from "../components/ui/Background";

export default function Store() {
  return (
    <Background variant="dark">
      <div className="flex h-screen items-center justify-center">
        <h1
          className="text-center font-extrabold uppercase italic text-gray"
          style={{ fontSize: "clamp(3rem, 12vw, 10rem)", lineHeight: 1 }}
        >
          Coming Soon
        </h1>
      </div>
    </Background>
  );
}
