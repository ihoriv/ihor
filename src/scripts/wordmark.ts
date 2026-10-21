/**
 * Footer wordmark: each letter's weight follows the cursor (Alpino variable font, 200–900).
 * Weights ease toward their target and keep the last state when the cursor leaves.
 */
export function initWordmark() {
  const els = [...document.querySelectorAll<HTMLElement>('.wl')];
  if (!els.length) return;
  const letters: { n: HTMLElement; w: number; t: number }[] = [];
  els.forEach((el) => {
    const ls = [...el.querySelectorAll<HTMLElement>('span[data-w0]')].map((n) => ({ n, w: +n.dataset.w0!, t: +n.dataset.w0! }));
    letters.push(...ls);
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ls.forEach((l) => {
        const b = l.n.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - e.clientX) / (r.width * 0.5);
        l.t = 200 + 700 * Math.max(0, 1 - d);
      });
    });
  });
  const step = () => {
    letters.forEach((l) => {
      const nw = l.w + (l.t - l.w) * 0.14;
      if (Math.abs(nw - l.w) > 0.3) { l.w = nw; l.n.style.fontWeight = String(Math.round(nw)); }
    });
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
