/**
 * Gulf Fiber and Metal Company Limited - Interactive Site Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer
  const menuBtn = document.querySelector('[data-menu]');
  const navLinks = document.querySelector('[data-links]');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.textContent = isOpen ? '✕' : '☰';
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.textContent = '☰';
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-links] a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Reveal on Scroll Animation
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // 4. Dynamic Year
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // 4b. Back to Top Button Visibility (Hidden at top, appears when scrolled down)
  const backToTopBtn = document.querySelector('.floatbtn.float-top');
  if (backToTopBtn) {
    const checkScrollPosition = () => {
      if (window.scrollY > 250) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();
  }

  // 5. Bilingual Language Support (English / Arabic)
  const langButtons = document.querySelectorAll('[data-lang]');
  const savedLang = localStorage.getItem('gfm_lang') || 'en';
  setLanguage(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      setLanguage(selectedLang);
      localStorage.setItem('gfm_lang', selectedLang);
    });
  });

  function setLanguage(lang) {
    const isAr = lang === 'ar';
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-en]').forEach(el => {
      const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (text) el.innerHTML = text;
    });

    // Custom event for page scripts (e.g., product loader)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, isAr } }));
  }

  // 6. Generic Form Handler
  const inquiryForms = document.querySelectorAll('form[data-ajax-form]');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const isAr = document.documentElement.lang === 'ar';
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const subject = formData.get('subject') || 'General Inquiry';
      const message = formData.get('message') || '';

      const bodyText = `New Inquiry from Gulf Fiber & Metal Website:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTopic: ${subject}\n\nProject Scope & Message:\n${message}\n\nSubmitted via Web Form.`;
      
      const mailtoLink = `mailto:info@gulffibermetal.com?subject=${encodeURIComponent('Inquiry: ' + subject + ' - ' + name)}&body=${encodeURIComponent(bodyText)}`;
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = isAr ? 'تم التحضير... جاري الفتح' : 'Preparing Email Client...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        window.location.href = mailtoLink;
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 500);
    });
  });

  // 7. Interactive Slide Deck Engine (La Boîte à Slides Presentation Feature)
  initSlideDeck();

  // 8. Animated Metrics Counter
  initAnimatedCounters();
});

/**
 * Presentation Slide Deck Controller
 */
function initSlideDeck() {
  const deck = document.querySelector('[data-slide-deck]');
  if (!deck) return;

  const panels = deck.querySelectorAll('.slide-panel');
  const tabs = deck.querySelectorAll('.slide-tab-btn');
  const prevBtn = deck.querySelector('[data-slide-prev]');
  const nextBtn = deck.querySelector('[data-slide-next]');
  const counterCurrent = deck.querySelector('[data-slide-current]');
  const progressFill = deck.querySelector('.slide-progress-fill');
  
  if (!panels.length) return;

  let currentIndex = 0;
  const totalSlides = panels.length;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    panels.forEach((p, i) => {
      p.classList.toggle('active', i === currentIndex);
    });

    tabs.forEach((t, i) => {
      t.classList.toggle('active', i === currentIndex);
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    if (progressFill) {
      const percentage = ((currentIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  // Next / Prev listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });
  }

  // Tab button click
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      goToSlide(i);
      resetAutoplay();
    });
  });

  // Autoplay functionality
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  deck.addEventListener('mouseenter', stopAutoplay);
  deck.addEventListener('mouseleave', startAutoplay);

  // Initialize first slide
  goToSlide(0);
  startAutoplay();
}

/**
 * Animated Counter Numbers on Scroll
 */
function initAnimatedCounters() {
  const metricNumbers = document.querySelectorAll('.metric-num[data-target]');
  if (!metricNumbers.length) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = 0;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeProgress * (target - start) + start);
          
          el.textContent = `${prefix}${currentCount}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  metricNumbers.forEach(el => countObserver.observe(el));
}
