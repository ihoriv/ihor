/**
 * FAQ as a chat. Picking a question types it into the input, sends it as the visitor's bubble,
 * shows Ihor typing, then posts the answer. Clicks queue up so quick taps play in order.
 * The first question plays by itself the first time the section comes into view.
 */
import { initPillPaint } from './pill-paint';

export function initFaq() {
  const root = document.querySelector<HTMLElement>('.fq');
  const log = root?.querySelector<HTMLElement>('.fq-log');
  if (!root || !log) return;
  const typed = root.querySelector<HTMLElement>('.fq-ty')!;
  const field = root.querySelector<HTMLElement>('.fq-in')!;
  const btns = [...root.querySelectorAll<HTMLButtonElement>('.fq-q')];
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, calm ? 0 : ms));
  let queue = Promise.resolve();

  const bubble = (cls: string, html: string | Node) => {
    const m = document.createElement('div');
    m.className = `fq-m ${cls}`;
    if (typeof html === 'string') m.innerHTML = html;
    else m.appendChild(html);
    log.appendChild(m);
    log.scrollTo({ top: log.scrollHeight, behavior: calm ? 'auto' : 'smooth' });
    return m;
  };

  const ask = async (i: number) => {
    const tpl = root.querySelector<HTMLTemplateElement>(`#fqa${i}`);
    if (!tpl) return;
    const q = tpl.dataset.q ?? '';
    btns[i].classList.add('done');
    field.classList.add('on');
    for (let k = 1; k <= q.length; k++) {
      typed.textContent = q.slice(0, k);
      await wait(16);
    }
    await wait(180);
    field.classList.add('send');
    typed.textContent = '';
    field.classList.remove('on');
    const qb = bubble('fq-you', '<p></p>');
    qb.querySelector('p')!.textContent = q;
    await wait(220);
    field.classList.remove('send');
    const dots = bubble('fq-me fq-dots', '<span></span><span></span><span></span>');
    dots.setAttribute('aria-label', 'Ihor is typing');
    await wait(650 + Math.min(900, q.length * 12));
    dots.remove();
    const a = bubble('fq-me', tpl.content.cloneNode(true));
    if (a.querySelector('.pill')) initPillPaint();
  };

  btns.forEach((b, i) => b.addEventListener('click', () => { queue = queue.then(() => ask(i)); }));

  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    queue = queue.then(() => wait(500)).then(() => ask(0));
  }, { threshold: 0.4 }).observe(log);
}
