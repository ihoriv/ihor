/**
 * Pill hover: the fill is painted in with a round brush that trails the cursor, then floods the pill.
 * On leave the stroke thins away. Takes over from the ::before circle (kept as the no-JS / touch fallback)
 * and paints in that circle's colour, so every section's variant keeps its own palette.
 */
const NS = 'http://www.w3.org/2000/svg';
const DRAW = 280, FLOOD = 650, OUT = 420;

export function initPillPaint() {
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('.pill:not(.pj)').forEach((el) => {
    const color = getComputedStyle(el, '::before').backgroundColor;
    el.classList.add('pj');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'pill-paint');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    el.prepend(svg);

    let pts: [number, number][] = [];
    let cx = 0, cy = 0, bx = 0, by = 0, w = 0, t0 = 0, tOut = 0, wOut = 0, inside = false, raf = 0;

    const frame = (now: number) => {
      const W = el.offsetWidth, H = el.offsetHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      if (inside) {
        // The brush lags behind the cursor, which turns quick moves into smooth strokes.
        bx += (cx - bx) * 0.22;
        by += (cy - by) * 0.22;
        const last = pts[pts.length - 1];
        if (!last || Math.hypot(bx - last[0], by - last[1]) > 1.5) pts.push([bx, by]);
        if (pts.length > 400) pts.splice(1, 1);
        const f = Math.min(1, Math.max(0, now - t0 - DRAW) / FLOOD);
        w = H * 0.9 + (1 - (1 - f) ** 3) * W * 2.4;
      } else {
        const k = Math.min(1, (now - tOut) / OUT);
        w = wOut * (1 - k) ** 2;
      }
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
      path.setAttribute('d', pts.length === 1 ? `${d}l.01 0` : d);
      path.setAttribute('stroke-width', w.toFixed(1));
      if (!inside && w < 0.5) {
        pts = [];
        path.removeAttribute('d');
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const at = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cx = ((e.clientX - r.left) / r.width) * el.offsetWidth;
      cy = ((e.clientY - r.top) / r.height) * el.offsetHeight;
    };
    el.addEventListener('pointerenter', (e) => {
      at(e);
      bx = cx;
      by = cy;
      pts = [];
      t0 = performance.now();
      inside = true;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    el.addEventListener('pointermove', at);
    el.addEventListener('pointerleave', () => {
      inside = false;
      tOut = performance.now();
      wOut = w;
    });
  });
}
