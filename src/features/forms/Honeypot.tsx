interface HoneypotProps {
  value: string;
  onChange: (next: string) => void;
}

// Spam trap: invisible to people, attractive to bots. Any value means "bot".
export default function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
      <label>
        Leave this field empty
        <input
          type="text"
          name="contact_preference"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
