(() => {
  const root = document.getElementById('heroSlider');
  const track = document.getElementById('heroSlides');
  const dots = document.getElementById('slideDots');
  const pause = document.getElementById('slidePause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer, slides = [], paused = reduced.matches;
  function schedule() {
    clearInterval(timer);
    if (slides.length > 1 && !paused && !document.hidden && !root.matches(':hover') && !root.contains(document.activeElement)) timer = setInterval(() => show(index + 1), 6000);
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    [...track.children].forEach((el, i) => { el.hidden = i !== index; });
    [...dots.children].forEach((el, i) => el.setAttribute('aria-current', String(i === index)));
  }
  function render() {
    slides = HeroContent.load().filter(s => s.active);
    track.replaceChildren(); dots.replaceChildren();
    slides.forEach((slide, i) => {
      const frame = document.createElement('div'); frame.className = 'hero-slide';
      frame.setAttribute('role', 'group'); frame.setAttribute('aria-roledescription', 'slide'); frame.setAttribute('aria-label', `${i + 1} dari ${slides.length}`);
      const img = document.createElement('img'); img.src = slide.src; img.alt = slide.alt;
      img.addEventListener('error', () => { img.onerror = null; if (!img.src.endsWith('/assets/hero-sdmk-global.webp')) img.src = 'assets/hero-sdmk-global.webp'; });
      const caption = document.createElement('div'); caption.className = 'photo-caption';
      const title = document.createElement('strong'); title.textContent = slide.title;
      const text = document.createElement('span'); text.textContent = slide.caption;
      caption.append(title, text); frame.append(img, caption); track.append(frame);
      const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Tampilkan slide ${i + 1}`);
      dot.addEventListener('click', () => { show(i); schedule(); }); dots.append(dot);
    });
    document.getElementById('sliderControls').hidden = slides.length < 2;
    show(0); schedule();
  }
  document.getElementById('slidePrev').onclick = () => { show(index - 1); schedule(); };
  document.getElementById('slideNext').onclick = () => { show(index + 1); schedule(); };
  function pauseLabel() { pause.textContent = paused ? 'Putar' : 'Jeda'; pause.setAttribute('aria-label', paused ? 'Putar pergantian otomatis' : 'Jeda pergantian otomatis'); }
  pause.onclick = () => { paused = !paused; pauseLabel(); schedule(); };
  root.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(index + (e.key === 'ArrowLeft' ? -1 : 1)); schedule(); } });
  ['mouseenter', 'mouseleave', 'focusin'].forEach(event => root.addEventListener(event, schedule));
  root.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { paused = reduced.matches; pauseLabel(); schedule(); });
  window.addEventListener('storage', e => { if (e.key === HeroContent.key || e.key === null) render(); });
  pauseLabel(); render();
})();
