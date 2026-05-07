  // ── PAGE ELEMENTS ──
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const backTop = document.getElementById('back-top');
  const heroBg = document.getElementById('hero-bg');
  const revealEls = document.querySelectorAll('.reveal');
  const counterEls = document.querySelectorAll('.counter-number');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // ── NAV SCROLL & SECTION HIGHLIGHT ──
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    animateCounters();
    updateActiveNav(scrollY);
    updateBackTop(scrollY);
    animateHeroParallax(scrollY);
  });

  function updateActiveNav(scrollY) {
    const offset = scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (!link) return;
      link.classList.toggle('active', offset >= sectionTop && offset < sectionBottom);
    });
  }

  function updateBackTop(scrollY) {
    backTop.classList.toggle('show', scrollY > window.innerHeight * 0.6);
  }

  // ── HAMBURGER ──
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navAnchors.forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }));

  // ── REVEAL ON SCROLL ──
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(el => io.observe(el));

  // ── COUNTERS ──
  let counted = false;

  function animateCounters() {
    if (counted) return;
    const countersSection = document.getElementById('counters');
    if (!countersSection) return;
    const rect = countersSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      counted = true;
      counterEls.forEach(el => {
        const target = Number(el.dataset.target) || 0;
        const suffix = el.dataset.suffix || '';
        let start = null;
        const duration = 1800;

        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${Math.floor(eased * target)}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${target}${suffix}`;
          }
        };

        requestAnimationFrame(step);
      });
    }
  }
  animateCounters();

  // ── FORM SUBMIT ──
  function handleSubmit() {
    const fname = document.getElementById('fname').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!fname) { showToast('Please fill in your first name.', 'error'); return; }
    if (!email) { showToast('Please provide a valid email address.', 'error'); return; }
    if (!service) { showToast('Please choose a service of interest.', 'error'); return; }

    showToast(`Thanks, ${fname}! Your message has been received. We will respond within one business day.`);
    document.getElementById('fname').value = '';
    document.getElementById('lname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('service').value = '';
    document.getElementById('message').value = '';
  }

  function showToast(message, variant = 'success') {
    let toast = document.querySelector('.site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.toggle('error', variant === 'error');
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 3600);
  }

  // ── HERO PARALLAX ──
  function animateHeroParallax(scrollY) {
    if (!heroBg) return;
    // Only apply parallax when not animating (at the very start)
    if (scrollY < 100 && !heroBg.classList.contains('carousel-slide')) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
    }
  }

  // ── HERO BACKGROUND ROTATION ──
  const backgroundImages = [
    'images/office\ background.jpg',
    'images/office\ background1.jpg',
    'images/office\ background2.jpg',
    'images/office\ background3.jpg'
  ];

  function startHeroBackgroundRotation() {
    if (!heroBg) return;
    let currentIndex = 0;
    const rotationInterval = 6000; // Change image every 6 seconds
    const animationDuration = 1200; // Animation duration in ms

    setInterval(() => {
      currentIndex = (currentIndex + 1) % backgroundImages.length;
      heroBg.classList.remove('carousel-slide');
      
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${backgroundImages[currentIndex]}')`;
        heroBg.classList.add('carousel-slide');
      }, 30);
    }, rotationInterval);
  }

  startHeroBackgroundRotation();

  // ── INITIAL UI STATE ──
  updateActiveNav(window.scrollY);
  updateBackTop(window.scrollY);
