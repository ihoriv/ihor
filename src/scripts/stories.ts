/**
 * Client stories: videos play muted in the background while visible.
 * Clicking a card restarts its video with sound and controls; other cards go back to background mode.
 * Cards also stack while scrolling: --t (0..1) says how much the next card covers this one.
 */
export function initStories() {
  const boxes = [...document.querySelectorAll<HTMLElement>('.cv-v')];
  const play = (v: HTMLVideoElement) => v.play().catch(() => {});
  const toBackground = (w: HTMLElement) => {
    const v = w.querySelector('video')!;
    w.classList.remove('on');
    v.controls = false;
    v.muted = true;
    v.loop = true;
  };

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const w = e.target as HTMLElement;
        const v = w.querySelector('video')!;
        if (e.isIntersecting) {
          if (v.paused && !w.classList.contains('on')) play(v);
        } else if (!w.classList.contains('on')) v.pause();
      }),
    { threshold: 0.15 },
  );

  boxes.forEach((w) => {
    io.observe(w);
    const v = w.querySelector('video')!;
    w.querySelector('.cv-o')?.addEventListener('click', () => {
      boxes.forEach((o) => { if (o !== w && o.classList.contains('on')) toBackground(o); });
      w.classList.add('on');
      v.loop = false;
      v.muted = false;
      v.currentTime = 0;
      v.controls = true;
      play(v);
    });
    v.addEventListener('ended', () => {
      toBackground(w);
      v.currentTime = 0;
      play(v);
    });
  });

  const cards = [...document.querySelectorAll<HTMLElement>('.cv')];
  const stack = () => {
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!next) return c.style.setProperty('--t', '0');
      const a = c.getBoundingClientRect(), b = next.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, 1 - (b.top - a.top) / c.offsetHeight));
      c.style.setProperty('--t', t.toFixed(3));
    });
  };
  window.addEventListener('scroll', stack, { passive: true });
  stack();
}
