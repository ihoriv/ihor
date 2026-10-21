/** Legal pages: highlights the contents entry for the section currently being read. */
export function initLegalToc() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.lg-toc a')];
  if (!links.length) return;
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter((s): s is HTMLElement => !!s);

  const set = (id: string) => links.forEach((a) => a.toggleAttribute('aria-current', a.hash === `#${id}`));

  // The active section is the last one whose top has passed a line 30% down the viewport.
  const update = () => {
    const line = window.innerHeight * 0.3;
    let current = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
    // At the very bottom the last sections can't reach the line, so the final one wins.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
    if (current) set(current.id);
  };

  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
