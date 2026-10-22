/**
 * Services: the panel videos load and play only while the section is near the viewport,
 * so they don't compete with the hero for bandwidth on page load.
 */
export function initServices() {
  const section = document.querySelector<HTMLElement>('#services');
  if (!section) return;
  const videos = [...section.querySelectorAll<HTMLVideoElement>('video')];
  new IntersectionObserver(
    ([e]) =>
      videos.forEach((v) => {
        if (!e.isIntersecting) return v.pause();
        v.preload = 'auto';
        v.play().catch(() => {});
      }),
    { rootMargin: '50% 0px' },
  ).observe(section);
}
