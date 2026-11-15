// Fields are wrapped in <div id="field-<key>">. Scroll to and focus the first invalid one.
// Some fields render a mobile and a desktop control, so only visible ones are considered.
export function focusFirstError(
  orderedKeys: readonly string[],
  errors: Record<string, string | undefined>,
): void {
  const key = orderedKeys.find((k) => errors[k]);
  if (!key) return;
  const wrapper = document.getElementById(`field-${key}`);
  if (!wrapper) return;
  wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  Array.from(wrapper.querySelectorAll<HTMLElement>("input, textarea, select, button"))
    .find((el) => el.offsetParent !== null || el.getClientRects().length > 0)
    ?.focus({ preventScroll: true });
}
