const openBtn = document.getElementById("openPopover");
const closeBtn = document.getElementById("closePopover");
const popover = document.getElementById("popover");
const header = document.getElementById("popoverHeader");

if (!openBtn || !closeBtn || !popover || !header) {
  throw new Error(
    "Popover: faltan elementos en el DOM (IDs requeridos: openPopover, closePopover, popover, popoverHeader)",
  );
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function setPopoverPosition(left, top) {
  const rect = popover.getBoundingClientRect();

  const maxLeft = window.innerWidth - rect.width;
  const maxTop = window.innerHeight - rect.height;

  const nextLeft = clamp(left, 0, Math.max(0, maxLeft));
  const nextTop = clamp(top, 0, Math.max(0, maxTop));

  popover.style.left = `${nextLeft}px`;
  popover.style.top = `${nextTop}px`;
}

function openPopover() {
  popover.classList.remove("is-hidden");

  if (!popover.style.left || !popover.style.top) {
    setPopoverPosition(24, 76);
  } else {
    const left = Number.parseFloat(popover.style.left) || 0;
    const top = Number.parseFloat(popover.style.top) || 0;
    setPopoverPosition(left, top);
  }
}

function closePopover() {
  popover.classList.add("is-hidden");
}

openBtn.addEventListener("click", openPopover);
closeBtn.addEventListener("click", closePopover);

// Dragging
let dragging = false;
let startPointerX = 0;
let startPointerY = 0;
let startLeft = 0;
let startTop = 0;
let activePointerId = null;

header.addEventListener("pointerdown", (e) => {
  if (popover.classList.contains("is-hidden")) return;
  if (e.button !== undefined && e.button !== 0) return;

  // If the user is clicking a control inside the header (e.g. close button),
  // don't start dragging or capture the pointer.
  const interactive = e.target?.closest?.(
    "button, a, input, textarea, select, option, label",
  );
  if (interactive) return;

  dragging = true;
  activePointerId = e.pointerId;
  header.setPointerCapture(activePointerId);

  const rect = popover.getBoundingClientRect();
  startLeft = rect.left;
  startTop = rect.top;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
});

header.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  if (activePointerId !== null && e.pointerId !== activePointerId) return;

  const dx = e.clientX - startPointerX;
  const dy = e.clientY - startPointerY;

  setPopoverPosition(startLeft + dx, startTop + dy);
});

function stopDragging(e) {
  if (!dragging) return;
  if (activePointerId !== null && e.pointerId !== activePointerId) return;

  dragging = false;
  try {
    header.releasePointerCapture(activePointerId);
  } catch {
    // ignore
  }
  activePointerId = null;
}

header.addEventListener("pointerup", stopDragging);
header.addEventListener("pointercancel", stopDragging);

// Keep inside viewport on resize
window.addEventListener("resize", () => {
  if (popover.classList.contains("is-hidden")) return;
  const rect = popover.getBoundingClientRect();
  setPopoverPosition(rect.left, rect.top);
});
