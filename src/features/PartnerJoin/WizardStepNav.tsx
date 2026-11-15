import Button from "../../components/ui/Button.jsx";

interface WizardStepNavProps {
  showBack: boolean;
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  busy?: boolean;
  className?: string;
}

// Back / Continue. Below lg it sticks to the bottom of the screen (thumb reach);
// on lg+ it sits at the end of the step card.
export default function WizardStepNav({
  showBack,
  onBack,
  onContinue,
  continueLabel,
  busy = false,
  className = "",
}: WizardStepNavProps) {
  return (
    <div
      className={[
        "sticky bottom-0 z-30 -mx-6 flex items-center gap-3 border-t border-white/10 bg-dark/95 px-6 pt-3 backdrop-blur",
        "pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
        "lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-2 lg:backdrop-blur-none",
        className,
      ].join(" ")}
    >
      {showBack && (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          className="border-2 lg:px-8"
        >
          Back
        </Button>
      )}
      <Button
        type="button"
        variant="primary"
        size="md"
        hovering="darkBg"
        disabled={busy}
        onClick={onContinue}
        className="flex-1 lg:ml-auto lg:flex-none lg:px-10"
      >
        {busy ? "Sending..." : continueLabel}
      </Button>
    </div>
  );
}
