// Behaviour shared by every dropdown menu on the site (page actions, the
// language menu). The markup is a button with `popovertarget` and a
// `popover` element with `role="menu"`, so the browser already opens it on
// click, Enter, and Space, closes it on Escape or a click outside, returns
// focus to the button, and keeps only one open at a time. This script adds
// what the platform leaves out: `aria-expanded`, arrow-key movement, and a
// position under the button that stays inside the viewport.

const GAP = 6;
const EDGE = 8;

function itemsOf(menu: HTMLElement): HTMLElement[] {
  return [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')];
}

function place(button: HTMLElement, menu: HTMLElement): void {
  // A split control positions the menu under the whole control, not the
  // narrow toggle.
  const anchor = (button.closest<HTMLElement>("[data-menu-anchor]") ?? button).getBoundingClientRect();
  const width = menu.offsetWidth;
  const height = menu.offsetHeight;
  const left = Math.min(Math.max(EDGE, anchor.right - width), window.innerWidth - width - EDGE);
  const below = anchor.bottom + GAP;
  const top = below + height > window.innerHeight - EDGE ? Math.max(EDGE, anchor.top - GAP - height) : below;
  menu.style.left = `${Math.max(EDGE, left)}px`;
  menu.style.top = `${top}px`;
}

function setUp(button: HTMLButtonElement): void {
  const menu = document.getElementById(button.getAttribute("popovertarget") ?? "");
  if (!menu) return;
  let focusOnOpen: "first" | "last" = "first";

  // `beforetoggle` runs before the menu is drawn and `toggle` just after. The
  // menu can only be measured once it is drawn, so it stays invisible for
  // that moment instead of appearing in one place and jumping to another.
  menu.addEventListener("beforetoggle", (event) => {
    const open = (event as ToggleEvent).newState === "open";
    button.setAttribute("aria-expanded", String(open));
    menu.style.visibility = open ? "hidden" : "";
  });

  menu.addEventListener("toggle", (event) => {
    if ((event as ToggleEvent).newState !== "open") return;
    place(button, menu);
    menu.style.visibility = "";
    const items = itemsOf(menu);
    (focusOnOpen === "last" ? items.at(-1) : items[0])?.focus();
    focusOnOpen = "first";
  });

  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    focusOnOpen = event.key === "ArrowUp" ? "last" : "first";
    menu.showPopover();
  });

  menu.addEventListener("keydown", (event) => {
    const items = itemsOf(menu);
    const at = items.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    if (event.key === "ArrowDown") next = items[(at + 1) % items.length];
    else if (event.key === "ArrowUp") next = items[(at - 1 + items.length) % items.length];
    else if (event.key === "Home") next = items[0];
    else if (event.key === "End") next = items.at(-1);
    else if (event.key === "Tab") menu.hidePopover();
    if (!next) return;
    event.preventDefault();
    next.focus();
  });

  // Choosing an item closes the menu; a link still navigates.
  menu.addEventListener("click", (event) => {
    if ((event.target as Element).closest('[role="menuitem"]')) menu.hidePopover();
  });

  const follow = () => {
    if (menu.matches(":popover-open")) place(button, menu);
  };
  window.addEventListener("resize", follow, { passive: true });
  window.addEventListener("scroll", follow, { passive: true });
}

for (const button of document.querySelectorAll<HTMLButtonElement>('button[popovertarget][aria-haspopup="menu"]')) {
  setUp(button);
}
