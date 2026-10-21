/** FAQ: accordion with one open item at a time. */
export function initFaq() {
  const items = [...document.querySelectorAll<HTMLElement>('.fq-i')];
  const set = (el: HTMLElement, open: boolean) => {
    el.classList.toggle('on', open);
    el.querySelector('.fq-b')?.setAttribute('aria-expanded', String(open));
  };
  items.forEach((el) => {
    el.querySelector('.fq-b')?.addEventListener('click', () => {
      const wasOpen = el.classList.contains('on');
      items.forEach((o) => set(o, false));
      if (!wasOpen) set(el, true);
    });
  });
}
