// Clipboard helper for the copy buttons. A button that copies carries a
// `[data-label]` span, a `data-copied` label, and both a copy and a check
// icon; `data-state="copied"` swaps them for two seconds.

const timers = new WeakMap<HTMLElement, number>();

/**
 * Copies `text`. On success `button` reads "copied" for two seconds; on
 * failure (no clipboard permission, an insecure origin) `message` is written
 * into `status`, which is a live region, so the failure is seen and announced.
 */
export async function copyText(
  text: string,
  button: HTMLElement,
  status: HTMLElement | null,
  message: string,
): Promise<void> {
  const label = button.querySelector<HTMLElement>("[data-label]");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    if (status) status.textContent = message;
    return;
  }
  if (status) status.textContent = "";
  if (!label) return;
  label.dataset.idle ??= label.textContent ?? "";
  label.textContent = button.dataset.copied ?? label.dataset.idle;
  button.dataset.state = "copied";
  window.clearTimeout(timers.get(button));
  timers.set(
    button,
    window.setTimeout(() => {
      label.textContent = label.dataset.idle ?? "";
      delete button.dataset.state;
    }, 2000),
  );
}
