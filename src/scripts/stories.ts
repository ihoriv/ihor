/**
 * Client stories: a one-review-per-slide slider.
 * The current slide's video plays muted while the section is on screen; clicking it restarts it with sound and controls.
 * Moving to another slide (arrows, tabs, arrow keys or a swipe) puts the old video back to muted and paused.
 * The leaving slide keeps .out until the new video has wiped over it, so the change reads as one layer covering another.
 */
export function initStories() {
  const root = document.querySelector<HTMLElement>('.cs');
  const sl = root?.querySelector<HTMLElement>('.cs-sl');
  if (!root || !sl) return;
  const slides = [...sl.querySelectorAll<HTMLElement>('.cv')];
  const tabs = [...root.querySelectorAll<HTMLElement>('.cs-tb')];
  const count = root.querySelector('.cs-i');
  let cur = 0, seen = false, outT = 0;

  const vid = (s: HTMLElement) => s.querySelector('video')!;
  const play = (v: HTMLVideoElement) => v.play().catch(() => {});
  const toBackground = (s: HTMLElement) => {
    const v = vid(s);
    s.classList.remove('live');
    v.controls = false;
    v.muted = true;
    v.loop = true;
  };

  const go = (n: number, dir?: number) => {
    n = (n + slides.length) % slides.length;
    if (n === cur) return;
    const old = slides[cur], next = slides[n];
    sl.classList.toggle('back', (dir ?? n - cur) < 0);
    slides.forEach((s) => s.classList.remove('out'));
    toBackground(old);
    vid(old).pause();
    old.classList.replace('on', 'out');
    old.inert = true;
    void next.offsetWidth;
    next.classList.add('on');
    next.inert = false;
    clearTimeout(outT);
    outT = window.setTimeout(() => old.classList.remove('out'), 1000);
    tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === n)));
    if (count) count.textContent = String(n + 1).padStart(2, '0');
    cur = n;
    const v = vid(next);
    v.preload = 'metadata';
    v.currentTime = 0;
    if (seen) play(v);
  };

  root.querySelectorAll<HTMLElement>('.cs-a').forEach((b) => b.addEventListener('click', () => go(cur + Number(b.dataset.go), Number(b.dataset.go))));
  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  root.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('video')) return;
    if (e.key === 'ArrowRight') go(cur + 1, 1);
    if (e.key === 'ArrowLeft') go(cur - 1, -1);
  });

  // Swipe on touch screens; vertical scrolling stays with the page.
  let sx = 0, sy = 0;
  sl.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  sl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  new IntersectionObserver(
    ([e]) => {
      seen = e.isIntersecting;
      const s = slides[cur], v = vid(s);
      if (seen) { if (v.paused && !s.classList.contains('live')) play(v); }
      else if (!s.classList.contains('live')) v.pause();
    },
    { threshold: 0.2 },
  ).observe(sl);

  slides.forEach((s) => {
    const v = vid(s);
    s.querySelector('.cv-o')?.addEventListener('click', () => {
      s.classList.add('live');
      v.loop = false;
      v.muted = false;
      v.currentTime = 0;
      v.controls = true;
      play(v);
    });
    v.addEventListener('ended', () => {
      toBackground(s);
      v.currentTime = 0;
      play(v);
    });
  });
}
