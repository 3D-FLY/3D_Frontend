// Fields are wrapped in <div id="field-<key>">. Scroll to and focus the first invalid one.
export function focusFirstError(
  orderedKeys: readonly string[],
  errors: Record<string, string | undefined>,
): void {
  const key = orderedKeys.find((k) => errors[k]);
  if (!key) return;
  const wrapper = document.getElementById(`field-${key}`);
  if (!wrapper) return;
  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  wrapper
    .querySelector<HTMLElement>("input, textarea, select, button")
    ?.focus({ preventScroll: true });
}
