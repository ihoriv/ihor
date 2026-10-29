/** Live local time in Kharkiv, wherever a .ft-clock appears (footer and the booking card). */
export function initClock() {
  const els = [...document.querySelectorAll<HTMLElement>('.ft-clock')];
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: els[0].dataset.tz || 'Europe/Kyiv' });
  const tick = () => { const t = fmt.format(new Date()); els.forEach((el) => { el.textContent = t; }); };
  tick();
  setInterval(tick, 15000);
}
