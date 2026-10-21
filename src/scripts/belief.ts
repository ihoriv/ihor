/**
 * Belief: words slide up line by line the first time the text scrolls into view.
 * Lines are measured once, so each word gets the delay of its visual line (--d).
 */
export function initBelief() {
  const box = document.querySelector<HTMLElement>('.bl2-t');
  if (!box) return;
  let measured = false;
  const measure = () => {
    let line = -1, top: number | null = null, para: Element | null = null;
    box.querySelectorAll<HTMLElement>('.w').forEach((w) => {
      const p = w.closest('p');
      const y = w.offsetTop;
      if (p !== para || top === null || Math.abs(y - top) > 4) { line++; top = y; para = p; }
      w.style.setProperty('--d', `${line * 0.09}s`);
    });
    measured = true;
  };
  const check = () => {
    if (!measured) measure();
    if (box.getBoundingClientRect().top < innerHeight * 0.82) {
      box.classList.add('on');
      window.removeEventListener('scroll', check);
    }
  };
  window.addEventListener('scroll', check, { passive: true });
  setTimeout(check, 100);
}
