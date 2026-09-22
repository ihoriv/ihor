// Site interactions for ihor.me. Loaded as a classic script after GSAP,
// ScrollTrigger, SplitText, Observer, hls.js and Swiper globals.
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && window.ScrollTrigger && window.SplitText && window.Observer) {
    window.gsap.registerPlugin(window.ScrollTrigger, window.SplitText, window.Observer);
  }

  /* ---------------- Menu toggle ---------------- */
  function initMenu() {
    const button = document.querySelector('.menu-button');
    const menu = document.getElementById('site-menu');
    if (!button || !menu) return;
    const cards = Array.from(menu.querySelectorAll('.menu-card'));
    const canAnimate = window.gsap && !prefersReducedMotion;

    function closeMenu() {
      button.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('is--scroll-locked');
      if (canAnimate) {
        window.gsap.killTweensOf(cards);
        window.gsap.to([...cards].reverse(), {
          autoAlpha: 0,
          y: 28,
          duration: 0.35,
          stagger: 0.05,
          ease: 'power3.in',
          onComplete: () => menu.classList.remove('is--open'),
        });
      } else {
        menu.classList.remove('is--open');
      }
    }
    function openMenu() {
      menu.classList.add('is--open');
      button.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('is--scroll-locked');
      if (canAnimate) {
        window.gsap.killTweensOf(cards);
        window.gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }
        );
      }
    }
    button.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is--open');
      if (isOpen) closeMenu();
      else openMenu();
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is--open')) closeMenu();
    });
  }

  /* ---------------- Live Kyiv clock ---------------- */
  function initClock() {
    const hoursEl = document.querySelector('.time--hours');
    const minutesEl = document.querySelector('.time-minutes');
    const periodEl = document.querySelector('.time-period');
    if (!hoursEl || !minutesEl || !periodEl) return;
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Kyiv',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
    function update() {
      const parts = formatter.formatToParts(new Date());
      hoursEl.textContent = parts.find((p) => p.type === 'hour').value;
      minutesEl.textContent = parts.find((p) => p.type === 'minute').value;
      periodEl.textContent = parts.find((p) => p.type === 'dayPeriod').value.toLowerCase();
    }
    update();
    setInterval(update, 1000);
  }

  /* ---------------- Mosaic reveal (shared by projects + approach) ---------------- */
  function buildMosaicOverlay(color) {
    const cols = 8;
    const rows = 5;
    const cellDuration = 150;
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      pointerEvents: 'none',
      zIndex: '5',
    });
    const cells = [];
    for (let i = 0; i < cols * rows; i += 1) {
      const cell = document.createElement('div');
      cell.style.background = color;
      cell.style.opacity = '1';
      cell.style.transition = `opacity ${cellDuration}ms linear`;
      overlay.appendChild(cell);
      cells.push(cell);
    }
    return { overlay, cells };
  }

  function revealWithMosaic(wrap, color, duration = 350) {
    if (window.getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
    wrap.style.opacity = '1';
    if (prefersReducedMotion) return;
    const { overlay, cells } = buildMosaicOverlay(color);
    wrap.appendChild(overlay);
    const cellDuration = 150;
    requestAnimationFrame(() => {
      cells.forEach((cell) => {
        const maxDelay = Math.max(duration - cellDuration, 0);
        cell.style.transitionDelay = `${Math.random() * maxDelay}ms`;
        cell.style.opacity = '0';
      });
    });
    setTimeout(() => overlay.remove(), duration + 50);
  }

  /* ---------------- Recent projects: accordion + mosaic reveal ---------------- */
  function initProjects() {
    const wrap = document.querySelector('.project-tabs_wrap');
    if (!wrap) return;
    const placeholder = wrap.querySelector('.project-tabs_image-placeholder');
    const cards = Array.from(wrap.querySelectorAll('.project-card'));
    if (!placeholder || !cards.length) return;

    function openCard(card, revealImmediately = true) {
      const current = wrap.querySelector('.project-card.is--open');
      if (current === card) return;
      if (current) {
        current.classList.remove('is--open');
        const prevHidden = current.querySelector('.project-card_hidden');
        const imageWrapBack = placeholder.querySelector('.project-card_image-wrap');
        if (prevHidden && imageWrapBack) prevHidden.appendChild(imageWrapBack);
      }
      card.classList.add('is--open');
      const hidden = card.querySelector('.project-card_hidden');
      const imageWrap = hidden ? hidden.querySelector('.project-card_image-wrap') : null;
      if (imageWrap) {
        placeholder.appendChild(imageWrap);
        if (revealImmediately) revealWithMosaic(imageWrap, 'var(--color-black)');
        else imageWrap.style.opacity = '0';
      }
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => openCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          openCard(card);
        }
      });
    });

    openCard(cards[0], false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const imageWrap = placeholder.querySelector('.project-card_image-wrap');
            if (imageWrap) revealWithMosaic(imageWrap, 'var(--color-black)');
            observer.unobserve(wrap);
          });
        },
        { rootMargin: '0px 0px -20% 0px' }
      );
      observer.observe(wrap);
    } else {
      const imageWrap = placeholder.querySelector('.project-card_image-wrap');
      if (imageWrap) revealWithMosaic(imageWrap, 'var(--color-black)');
    }
  }

  /* ---------------- Shared HLS attach helper ---------------- */
  const HlsCore = (() => {
    const pending = new Map();
    const hlsByVideo = new WeakMap();
    // Only Safari genuinely plays HLS natively, and reports it as "probably".
    // Some Chromium builds answer "maybe" (technically true per spec, but
    // playback then hangs forever) — require the strong answer specifically.
    const useNativeHls = document.createElement('video').canPlayType('application/vnd.apple.mpegurl') === 'probably';
    function schedule(src, run) {
      const prev = pending.get(src) || Promise.resolve();
      const next = prev.then(() => new Promise((resolve) => run(resolve))).catch(() => {});
      pending.set(src, next);
      return next;
    }
    function attach(video, src, onReady) {
      if (useNativeHls) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => onReady && onReady(), { once: true });
        return;
      }
      if (!window.Hls || !window.Hls.isSupported()) return;
      const existing = hlsByVideo.get(video);
      if (existing) {
        existing.destroy();
        hlsByVideo.delete(video);
      }
      schedule(src, (done) => {
        const hls = new window.Hls();
        hlsByVideo.set(video, hls);
        let settled = false;
        function finish() {
          if (settled) return;
          settled = true;
          done();
        }
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          finish();
          onReady && onReady();
        });
        hls.on(window.Hls.Events.ERROR, (_e, data) => {
          if (!data.fatal) return;
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else finish();
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        setTimeout(finish, 4000);
      });
    }
    return { attach };
  })();

  /* ---------------- Approach: accordion + mosaic reveal ---------------- */
  function initApproach() {
    const wrap = document.querySelector('.approach_content-wrap');
    if (!wrap) return;
    const placeholder = wrap.querySelector('.approach_image-placeholder');
    const cards = Array.from(wrap.querySelectorAll('.approach-card'));
    if (!placeholder || !cards.length) return;

    function openCard(card, revealImmediately = true) {
      const current = wrap.querySelector('.approach-card.is--open');
      if (current === card) return;
      if (current) {
        current.classList.remove('is--open');
        const prevHidden = current.querySelector('.approach-card_hidden');
        const imageWrapBack = placeholder.querySelector('.approach-card_image-wrap');
        if (prevHidden && imageWrapBack) prevHidden.appendChild(imageWrapBack);
      }
      card.classList.add('is--open');
      const hidden = card.querySelector('.approach-card_hidden');
      const imageWrap = hidden ? hidden.querySelector('.approach-card_image-wrap') : null;
      if (imageWrap) {
        placeholder.appendChild(imageWrap);
        if (revealImmediately) revealWithMosaic(imageWrap, 'var(--background)');
        else imageWrap.style.opacity = '0';
      }
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => openCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          openCard(card);
        }
      });
    });
    openCard(cards[0], false);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const imageWrap = placeholder.querySelector('.approach-card_image-wrap');
            if (imageWrap) revealWithMosaic(imageWrap, 'var(--background)');
            observer.unobserve(wrap);
          });
        },
        { rootMargin: '0px 0px -20% 0px' }
      );
      observer.observe(wrap);
    } else {
      const imageWrap = placeholder.querySelector('.approach-card_image-wrap');
      if (imageWrap) revealWithMosaic(imageWrap, 'var(--background)');
    }

    /* Subtle tilt: the image reads the whole section's mouse position, not
       just its own bounds, so it keeps responding even when the cursor is
       over the cards next to it. */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
      const maxTilt = 8;
      wrap.addEventListener('mousemove', (e) => {
        const img = placeholder.querySelector('img');
        if (!img) return;
        const rect = placeholder.getBoundingClientRect();
        const px = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const py = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        const rotateY = Math.max(-1, Math.min(1, px)) * maxTilt;
        const rotateX = Math.max(-1, Math.min(1, py)) * -maxTilt;
        img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      wrap.addEventListener('mouseleave', () => {
        const img = placeholder.querySelector('img');
        if (img) img.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  /* ---------------- FAQ: single-open accordion ---------------- */
  function initFaq() {
    const cards = document.querySelectorAll('.faq_card-wrap');
    if (!cards.length) return;
    cards.forEach((card, index) => {
      const trigger = card.querySelector('.faq-card_title-wrap');
      const desc = card.querySelector('.faq-card_description-wrap');
      trigger.setAttribute('tabindex', '0');
      desc.style.transition = 'height 350ms ease';
      desc.style.height = '0px';
      if (index === 0) {
        card.classList.add('is--open');
        desc.style.height = 'auto';
      }
      function toggle() {
        const isOpen = card.classList.contains('is--open');
        cards.forEach((c) => {
          if (c !== card && c.classList.contains('is--open')) closeCard(c);
        });
        if (isOpen) closeCard(card);
        else openCard(card);
      }
      function openCard(c) {
        const d = c.querySelector('.faq-card_description-wrap');
        d.style.height = d.scrollHeight + 'px';
        c.classList.add('is--open');
      }
      function closeCard(c) {
        const d = c.querySelector('.faq-card_description-wrap');
        d.style.height = d.scrollHeight + 'px';
        void d.offsetHeight;
        d.style.height = '0px';
        c.classList.remove('is--open');
      }
      trigger.addEventListener('click', toggle);
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* ---------------- Services: Swiper carousel ---------------- */
  function initServicesSlider() {
    const el = document.querySelector('.swiper.is--services');
    if (!el || !window.Swiper) return;
    const slider = new window.Swiper('.swiper.is--services', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 1,
      autoplay: { delay: 6000 },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: {
        el: '.services_pagination',
        bulletClass: 'pagination_dot-wrap',
        bulletActiveClass: 'pagination_dot-wrap_active',
        type: 'bullets',
        bulletElement: 'button',
        clickable: true,
      },
    });
    slider.autoplay.stop();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) slider.autoplay.start();
          else slider.autoplay.stop();
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
  }

  /* ---------------- Shared muted background preview video (lazy) ----------------
     Used by client testimonial cards AND the standalone video block — same
     helper, so the video popup can find and reuse whichever instance is
     already playing rather than starting a second HLS session. */
  const previewVideosBySrc = new Map();
  function getOrCreatePreviewVideo(src, homeParent) {
    if (previewVideosBySrc.has(src)) return previewVideosBySrc.get(src);
    const video = document.createElement('video');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.muted = true;
    video.setAttribute('muted', '');
    video.loop = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    homeParent.appendChild(video);
    // Play only once the stream is actually ready — calling .play() the moment
    // the <video> exists (before HLS attaches/parses the manifest) can leave
    // playback silently stuck, especially on the hls.js path.
    HlsCore.attach(video, src, () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    });
    const entry = { video, homeParent, src };
    previewVideosBySrc.set(src, entry);
    return entry;
  }

  function initClientPreviews() {
    const cards = document.querySelectorAll('.client-card[data-client-video]');
    if (!cards.length) return;
    function initCardVideo(card) {
      const src = card.getAttribute('data-client-video');
      const videoWrapEl = card.querySelector('.clients-card_video-wrap');
      if (!src || !videoWrapEl) return;
      const entry = getOrCreatePreviewVideo(src, videoWrapEl);
      if (entry.video.parentElement !== videoWrapEl) videoWrapEl.appendChild(entry.video);
      const p = entry.video.play();
      if (p && p.catch) p.catch(() => {});
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initCardVideo(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach(initCardVideo);
    }
  }

  /* ---------------- Standalone video block background preview ---------------- */
  function initVideoBlockPreview() {
    const hosts = document.querySelectorAll('[data-bg-video]');
    if (!hosts.length) return;
    function initHost(host) {
      const src = host.getAttribute('data-bg-video');
      if (!src) return;
      const entry = getOrCreatePreviewVideo(src, host);
      if (entry.video.parentElement !== host) host.appendChild(entry.video);
      const p = entry.video.play();
      if (p && p.catch) p.catch(() => {});
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initHost(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      hosts.forEach((host) => observer.observe(host));
    } else {
      hosts.forEach(initHost);
    }
  }

  /* ---------------- Shared video popup (lightbox) ---------------- */
  function initVideoPopup() {
    const popup = document.querySelector('.video-popup');
    if (!popup) return;
    const videoWrap = popup.querySelector('.video-popup_video-wrap');
    const dialog = popup.querySelector('.video-popup_dialog');
    const playBtn = popup.querySelector('.video-popup_play-btn');
    const iconPlay = popup.querySelector('.video-popup_icon-play');
    const iconPause = popup.querySelector('.video-popup_icon-pause');
    const progress = popup.querySelector('.video-popup_progress');
    const progressFill = popup.querySelector('.video-popup_progress-fill');
    const progressHandle = popup.querySelector('.video-popup_progress-handle');
    const timeCurrent = popup.querySelector('.video-popup_time-current');
    const timeDuration = popup.querySelector('.video-popup_time-duration');
    const volumeBtn = popup.querySelector('.video-popup_volume-btn');
    const iconVolOn = popup.querySelector('.video-popup_icon-vol-on');
    const iconVolOff = popup.querySelector('.video-popup_icon-vol-off');
    const volumeSlider = popup.querySelector('.video-popup_volume-slider');
    const fullscreenBtn = popup.querySelector('.video-popup_fullscreen-btn');
    const iconFsEnter = popup.querySelector('.video-popup_icon-fullscreen-enter');
    const iconFsExit = popup.querySelector('.video-popup_icon-fullscreen-exit');

    let activeEntry = null;
    let lastFocusedEl = null;
    let isDraggingProgress = false;

    /* ---- Fullscreen (requested on the dialog, so our own controls survive
       instead of being replaced by the browser's native video UI) ---- */
    function getFullscreenElement() {
      return document.fullscreenElement || document.webkitFullscreenElement || null;
    }
    function requestDialogFullscreen() {
      if (dialog.requestFullscreen) return dialog.requestFullscreen();
      if (dialog.webkitRequestFullscreen) return dialog.webkitRequestFullscreen();
      return Promise.reject();
    }
    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      return Promise.reject();
    }
    function updateFullscreenIcon() {
      const isFs = getFullscreenElement() === dialog;
      iconFsEnter.style.display = isFs ? 'none' : 'block';
      iconFsExit.style.display = isFs ? 'block' : 'none';
      fullscreenBtn.setAttribute('aria-label', isFs ? 'Exit full screen' : 'Full screen');
    }

    /* Controls panel auto-hides after 1s of no mouse movement, but only
       while in fullscreen — the popup's normal (windowed) controls always
       stay visible. */
    let controlsIdleTimer = null;
    function scheduleControlsIdle() {
      clearTimeout(controlsIdleTimer);
      controlsIdleTimer = setTimeout(() => dialog.classList.add('is--controls-idle'), 1000);
    }
    function wakeControls() {
      dialog.classList.remove('is--controls-idle');
      if (getFullscreenElement() === dialog) scheduleControlsIdle();
      else clearTimeout(controlsIdleTimer);
    }
    dialog.addEventListener('mousemove', wakeControls);

    function formatTime(seconds) {
      if (!isFinite(seconds) || seconds < 0) seconds = 0;
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
    function updatePlayIcon() {
      const video = activeEntry && activeEntry.video;
      const playing = video && !video.paused && !video.ended;
      iconPlay.style.display = playing ? 'none' : 'block';
      iconPause.style.display = playing ? 'block' : 'none';
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    }
    function updateVolumeIcon() {
      const video = activeEntry && activeEntry.video;
      const muted = !video || video.muted || video.volume === 0;
      iconVolOn.style.display = muted ? 'none' : 'block';
      iconVolOff.style.display = muted ? 'block' : 'none';
      volumeBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    }
    function updateProgress() {
      const video = activeEntry && activeEntry.video;
      if (!video || isDraggingProgress) return;
      const duration = video.duration || 0;
      const current = video.currentTime || 0;
      const pct = duration ? (current / duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      progressHandle.style.left = pct + '%';
      progress.setAttribute('aria-valuenow', String(Math.round(pct)));
      timeCurrent.textContent = formatTime(current);
      timeDuration.textContent = formatTime(duration);
    }
    function seekFromEvent(e) {
      const video = activeEntry && activeEntry.video;
      if (!video || !video.duration) return;
      const rect = progress.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      video.currentTime = pct * video.duration;
      progressFill.style.width = pct * 100 + '%';
      progressHandle.style.left = pct * 100 + '%';
    }

    function getPopupVideo(src) {
      let video = videoWrap.querySelector(`video[data-src="${CSS.escape(src)}"]`);
      if (!video) {
        video = document.createElement('video');
        video.setAttribute('data-src', src);
        video.playsInline = true;
        HlsCore.attach(video, src);
      }
      return video;
    }

    function open(src, opts = {}) {
      lastFocusedEl = document.activeElement;
      const video = opts.video || getPopupVideo(src);
      activeEntry = { video, homeParent: opts.homeParent || null };
      videoWrap.querySelectorAll('video').forEach((v) => v.classList.remove('is--active'));
      if (video.parentElement !== videoWrap) videoWrap.appendChild(video);
      video.classList.add('is--active');
      video.muted = false;
      video.volume = volumeSlider.value ? Number(volumeSlider.value) : 1;
      video.controls = false;
      // The popup always starts from the beginning — even when it's reusing a
      // muted background-preview <video> that's already partway through.
      try {
        video.currentTime = 0;
      } catch {
        /* not seekable yet; loadedmetadata below will already start at 0 */
      }
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      popup.classList.add('is--open');
      popup.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('is--scroll-locked');
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('play', updatePlayIcon);
      video.addEventListener('pause', updatePlayIcon);
      updatePlayIcon();
      updateVolumeIcon();
      dialog.focus({ preventScroll: true });
    }

    function close() {
      if (getFullscreenElement() === dialog) exitFullscreen().catch(() => {});
      const video = activeEntry && activeEntry.video;
      if (video) {
        video.pause();
        video.removeEventListener('timeupdate', updateProgress);
        if (activeEntry.homeParent) {
          video.muted = true;
          video.loop = true;
          activeEntry.homeParent.appendChild(video);
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
        }
      }
      activeEntry = null;
      popup.classList.remove('is--open');
      popup.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('is--scroll-locked');
      if (lastFocusedEl && lastFocusedEl.focus) lastFocusedEl.focus();
    }

    popup.querySelectorAll('[data-video-popup-close]').forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !popup.classList.contains('is--open')) return;
      // Let the browser's own Escape handling exit fullscreen first; a second
      // Escape (now out of fullscreen) closes the popup itself.
      if (getFullscreenElement()) return;
      close();
    });
    if (fullscreenBtn) {
      const supportsFullscreen = !!(dialog.requestFullscreen || dialog.webkitRequestFullscreen);
      if (!supportsFullscreen) {
        fullscreenBtn.style.display = 'none';
      } else {
        fullscreenBtn.addEventListener('click', () => {
          if (getFullscreenElement()) exitFullscreen().catch(() => {});
          else requestDialogFullscreen().catch(() => {});
        });
        const handleFullscreenChange = () => {
          updateFullscreenIcon();
          if (getFullscreenElement() === dialog) scheduleControlsIdle();
          else {
            clearTimeout(controlsIdleTimer);
            dialog.classList.remove('is--controls-idle');
          }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      }
    }
    playBtn.addEventListener('click', () => {
      const video = activeEntry && activeEntry.video;
      if (!video) return;
      if (video.paused) video.play();
      else video.pause();
    });
    volumeBtn.addEventListener('click', () => {
      const video = activeEntry && activeEntry.video;
      if (!video) return;
      video.muted = !video.muted;
      updateVolumeIcon();
    });
    volumeSlider.addEventListener('input', () => {
      const video = activeEntry && activeEntry.video;
      if (!video) return;
      video.volume = Number(volumeSlider.value);
      video.muted = video.volume === 0;
      updateVolumeIcon();
    });
    progress.addEventListener('pointerdown', (e) => {
      isDraggingProgress = true;
      seekFromEvent(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (isDraggingProgress) seekFromEvent(e);
    });
    window.addEventListener('pointerup', () => {
      isDraggingProgress = false;
    });
    progress.addEventListener('keydown', (e) => {
      const video = activeEntry && activeEntry.video;
      if (!video) return;
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
      if (e.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 5);
    });

    // Wire every [data-video-open] trigger on the page. If a muted preview of
    // the same src is already playing somewhere (client card or video block),
    // reuse that exact <video> instead of starting a second HLS session.
    document.querySelectorAll('[data-video-open]').forEach((trigger) => {
      const trigger_open = (e) => {
        e.preventDefault();
        const src = trigger.getAttribute('data-video-open');
        const entry = previewVideosBySrc.get(src);
        open(src, entry ? { video: entry.video, homeParent: entry.homeParent } : {});
      };
      trigger.addEventListener('click', trigger_open);
      if (trigger.getAttribute('role') === 'button') {
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') trigger_open(e);
        });
      }
    });
  }

  /* ---------------- Scroll reveal (fade + rise) ---------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is--in'));
      return;
    }
    // Siblings sharing a parent (e.g. the approach cards, the FAQ list) get an
    // increasing transition-delay by their position, so a group that enters
    // together reads as a bottom-up stagger instead of popping in at once.
    const siblingGroups = new Map();
    targets.forEach((el) => {
      const parent = el.parentElement;
      if (!siblingGroups.has(parent)) siblingGroups.set(parent, []);
      siblingGroups.get(parent).push(el);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const group = siblingGroups.get(el.parentElement) || [el];
          const index = group.indexOf(el);
          el.style.transitionDelay = `${Math.min(index, 8) * 0.08}s`;
          el.classList.add('is--in');
          observer.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ---------------- Hero cursor trail (desktop only) ---------------- */
  function initImageTrail(config = {}) {
    const options = {
      minWidth: config.minWidth ?? 992,
      moveDistance: config.moveDistance ?? 15,
      stopDuration: config.stopDuration ?? 600,
      trailLength: config.trailLength ?? 8,
    };
    const wrapper = document.querySelector('[data-trail="wrapper"]');
    if (!wrapper || !window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth < options.minWidth) return;

    const state = {
      trailInterval: null,
      globalIndex: 0,
      last: { x: 0, y: 0 },
      trailImageTimestamps: new Map(),
      trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
      isActive: false,
    };
    const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

    function activate(trailImage, x, y) {
      if (!trailImage) return;
      const rect = trailImage.getBoundingClientRect();
      Object.assign(trailImage.style, {
        left: `${x - rect.width / 2}px`,
        top: `${y - rect.height / 2}px`,
        zIndex: state.globalIndex,
        display: 'block',
      });
      state.trailImageTimestamps.set(trailImage, Date.now());
      window.gsap.fromTo(trailImage, { autoAlpha: 0, scale: 0.8 }, { scale: 1, autoAlpha: 1, duration: 0.2, overwrite: true });
      state.last = { x, y };
    }
    function fadeOutTrailImage(trailImage) {
      if (!trailImage) return;
      window.gsap.to(trailImage, {
        opacity: 0,
        scale: 0.2,
        duration: 0.8,
        ease: 'expo.out',
        onComplete: () => window.gsap.set(trailImage, { autoAlpha: 0 }),
      });
    }
    function handleOnMove(e) {
      if (!state.isActive) return;
      const rectWrapper = wrapper.getBoundingClientRect();
      const relativeX = e.clientX - rectWrapper.left;
      const relativeY = e.clientY - rectWrapper.top;
      const distanceFromLast = distance(relativeX, relativeY, state.last.x, state.last.y);
      if (distanceFromLast > window.innerWidth / options.moveDistance) {
        const lead = state.trailImages[state.globalIndex % state.trailImages.length];
        const tail = state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages.length];
        activate(lead, relativeX, relativeY);
        fadeOutTrailImage(tail);
        state.globalIndex += 1;
      }
    }
    function cleanupTrailImages() {
      const now = Date.now();
      for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
        if (now - timestamp > options.stopDuration) {
          fadeOutTrailImage(trailImage);
          state.trailImageTimestamps.delete(trailImage);
        }
      }
    }
    function startTrail() {
      if (state.isActive) return;
      state.isActive = true;
      wrapper.addEventListener('mousemove', handleOnMove);
      state.trailInterval = setInterval(cleanupTrailImages, 100);
    }
    function stopTrail() {
      if (!state.isActive) return;
      state.isActive = false;
      wrapper.removeEventListener('mousemove', handleOnMove);
      clearInterval(state.trailInterval);
      state.trailImages.forEach(fadeOutTrailImage);
      state.trailImageTimestamps.clear();
    }
    window.ScrollTrigger.create({
      trigger: wrapper,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: startTrail,
      onEnterBack: startTrail,
      onLeave: stopTrail,
      onLeaveBack: stopTrail,
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth < options.minWidth && state.isActive) stopTrail();
      else if (window.innerWidth >= options.minWidth && !state.isActive) startTrail();
    });
  }

  /* ---------------- Line divider grow → icon flip (sequential) ----------------
     The line grows in as the section scrolls (transform-origin pinned to the
     top, wrapper keeps the line's final box size reserved at all times, so
     the scale never shifts surrounding layout). Only once that growth
     finishes does the icon that follows it flip in — never in parallel,
     so the sequence reads as one continuous, logical motion. */
  function initLineDividerGrow() {
    const wraps = document.querySelectorAll('.line-divider_wrap');
    if (!wraps.length) return;
    wraps.forEach((wrap) => {
      const line = wrap.querySelector('.line-divider');
      if (!line) return;
      const icon = wrap.nextElementSibling && wrap.nextElementSibling.querySelector('[data-flip-in]');

      if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
        line.style.transform = 'none';
        if (icon) icon.classList.add('is--in');
        return;
      }

      if (icon) window.gsap.set(icon, { autoAlpha: 0, rotateY: 90, scale: 0.7 });
      let iconRevealed = false;
      function revealIcon() {
        if (!icon || iconRevealed) return;
        iconRevealed = true;
        window.gsap.to(icon, { autoAlpha: 1, rotateY: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
      }

      window.gsap.fromTo(
        line,
        { scaleY: 0.04 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 95%',
            end: 'top 55%',
            scrub: true,
            onUpdate: (self) => {
              if (self.progress >= 1) revealIcon();
            },
          },
        }
      );
    });
  }

  /* ---------------- Grow-to-full-width while scrolling (video block + photo) ----------------
     Height never moves — only width animates, from a narrow sliver up to the
     element's own final width (100%, capped by its CSS max-width) — a
     book-opening reveal rather than a uniform scale. Since height is never
     touched, this can't overflow into content below the way scaling both
     axes from a center origin did. */
  function initScrollGrow() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;
    // Tablet and below scroll past this element's own height quickly, so the
    // grow finishes only once it's mostly out of view — skip it there and
    // just show the video/photo at full size from the start.
    if (window.innerWidth <= 991) return;
    document.querySelectorAll('[data-scroll-grow]').forEach((el) => {
      window.gsap.fromTo(
        el,
        { width: '10%' },
        {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.video_block-wrap') || el,
            start: 'top 95%',
            end: 'bottom 15%',
            scrub: 0.6,
          },
        }
      );
    });
  }

  /* ---------------- Line-by-line text reveal (GSAP SplitText) ---------------- */
  function initTextReveal() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText || prefersReducedMotion) return;
    document.querySelectorAll('[data-text-appear="line"]').forEach((el) => {
      const split = new window.SplitText(el, { type: 'lines', linesClass: 'split-line' });
      window.gsap.set(split.lines, { overflow: 'hidden' });
      window.gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }

  /* ---------------- Hero step-by-step intro (load-time, not scroll) ---------------- */
  function initHeroIntro() {
    if (!window.gsap || prefersReducedMotion) return;
    const icon = document.querySelector('.hero-description-icon');
    const eyebrow = document.querySelector('.hero-eyebrow-text');
    const h1 = document.querySelector('.section-hero h1');
    if (!icon && !eyebrow && !h1) return;

    const gsap = window.gsap;
    const tl = gsap.timeline({ delay: 0.15 });

    if (icon) {
      gsap.set(icon, { autoAlpha: 0, scale: 0.7 });
      tl.to(icon, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
    }

    if (eyebrow && window.SplitText) {
      const split = new window.SplitText(eyebrow, { type: 'lines', linesClass: 'split-line' });
      gsap.set(split.lines, { overflow: 'hidden' });
      gsap.set(split.lines, { autoAlpha: 0, yPercent: 110 });
      tl.to(
        split.lines,
        { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' },
        icon ? '-=0.25' : 0
      );
    }

    if (h1 && window.SplitText) {
      const splitH1 = new window.SplitText(h1, { type: 'lines', linesClass: 'split-line' });
      gsap.set(splitH1.lines, { overflow: 'hidden' });
      gsap.set(splitH1.lines, { autoAlpha: 0, yPercent: 110 });
      tl.to(
        splitH1.lines,
        { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out' },
        eyebrow ? '-=0.55' : '-=0.1'
      );
    }
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initHeroIntro();
    initClock();
    initProjects();
    initApproach();
    initFaq();
    initServicesSlider();
    initClientPreviews();
    initVideoBlockPreview();
    initVideoPopup();
    initImageTrail();
    initTextReveal();
    initScrollReveal();
    initLineDividerGrow();
    initScrollGrow();
  });
})();
