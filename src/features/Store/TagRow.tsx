// src/components/TagRow.tsx
import React from "react";
import TagPill from "./TagPill";

type Props = {
  tags: string[];
  greenFirst?: boolean;
  className?: string;
};

export default function TagRow({ tags, greenFirst = true, className = "" }: Props) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((t, i) => (
        <TagPill key={`${t}-${i}`} variant={greenFirst && i === 0 ? "green" : "gray"}>
          {t}
        </TagPill>
      ))}
    </div>
  );
}
