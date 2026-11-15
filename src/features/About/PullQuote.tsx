interface PullQuoteProps {
  children: string;
  className?: string;
}

export default function PullQuote({ children, className = "" }: PullQuoteProps) {
  return (
    <blockquote
      className={`rounded-2xl border border-green-500/20 bg-green-500/5 px-6 py-8 text-center text-[clamp(1.25rem,3.5vw,2.25rem)] font-extrabold italic leading-snug text-white md:px-12 md:py-12 ${className}`}
    >
      {children}
    </blockquote>
  );
}
