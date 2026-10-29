/**
 * Work: the hovered tile tilts toward the cursor on a spring, swings a little with sideways speed,
 * and lifts off the page so the tag and the "view website" disc float above the image.
 * Writes --rx/--ry/--rz/--z (tilt) and --gx/--gy (glare position) on .wk2-tl; CSS does the rest.
 */
const RX = 5, RY = 7, RZ = 1.5;

export function initWorkTilt() {
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll<HTMLElement>('.wk2-t').forEach((t) => {
    const el = t.querySelector<HTMLElement>('.wk2-tl');
    if (!el) return;
    const c = { rx: 0, ry: 0, rz: 0, z: 0 }, v = { rx: 0, ry: 0, rz: 0, z: 0 };
    let x = 0.5, y = 0.5, lx: number | null = null, sw = 0, inside = false, raf = 0;

    const step = () => {
      sw *= 0.94;
      const tg = inside
        ? { rx: (0.5 - y) * 2 * RX, ry: (x - 0.5) * 2 * RY, rz: Math.max(-RZ, Math.min(RZ, sw)), z: 1 }
        : { rx: 0, ry: 0, rz: 0, z: 0 };
      let moving = false;
      for (const k of ['rx', 'ry', 'rz', 'z'] as const) {
        v[k] = (v[k] + (tg[k] - c[k]) * 0.025) * 0.82;
        c[k] += v[k];
        if (Math.abs(v[k]) > 0.002 || Math.abs(tg[k] - c[k]) > 0.002) moving = true;
      }
      el.style.setProperty('--rx', `${c.rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${c.ry.toFixed(2)}deg`);
      el.style.setProperty('--rz', `${c.rz.toFixed(2)}deg`);
      el.style.setProperty('--z', c.z.toFixed(3));
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      raf = inside || moving ? requestAnimationFrame(step) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

    const move = (e: PointerEvent) => {
      const r = t.getBoundingClientRect();
      x = Math.max(0, Math.min(1, (e.clientX - r.left) / el.offsetWidth));
      y = Math.max(0, Math.min(1, (e.clientY - r.top) / el.offsetHeight));
      if (lx !== null) sw += (x - lx) * 20;
      lx = x;
      inside = true;
      kick();
    };
    t.addEventListener('pointerenter', move);
    t.addEventListener('pointermove', move);
    t.addEventListener('pointerleave', () => { inside = false; lx = null; kick(); });
  });
}
