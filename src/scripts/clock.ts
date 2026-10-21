/** Footer: live local time in Kharkiv. */
export function initClock() {
  const el = document.querySelector<HTMLElement>('.ft-clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz || 'Europe/Kyiv' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 15000);
}
