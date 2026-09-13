/* ============================================
   WEDDING INVITATION - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. GUEST NAME FROM URL PARAM (?to=Nama)
     ============================================ */
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  const guestNameEl = document.getElementById('guest-name');
  if (guestName && guestNameEl) {
    guestNameEl.textContent = decodeURIComponent(guestName.replace(/\+/g, ' '));
  }

  /* ============================================
     2. OPENING SCREEN + SESSION STORAGE
     ============================================ */
  const openingScreen = document.getElementById('opening-screen');
  const mainContent = document.getElementById('main-content');
  const openBtn = document.getElementById('open-invitation-btn');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle-btn');

  function showMainContent() {
    openingScreen.classList.add('fade-out');
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      openingScreen.style.display = 'none';
      mainContent.classList.remove('hidden');
      mainContent.classList.add('show');
      initScrollAnimations();
    }, 800);
  }

  // Cek sessionStorage — jika sudah dibuka, langsung tampilkan main content
  if (sessionStorage.getItem('invitationOpened') === 'true') {
    openingScreen.style.display = 'none';
    mainContent.classList.remove('hidden');
    document.body.style.overflow = 'auto';
  } else {
    document.body.style.overflow = 'hidden';
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      sessionStorage.setItem('invitationOpened', 'true');
      showMainContent();
      playMusic();
    });
  }

  /* ============================================
     3. BACKGROUND MUSIC
     ============================================ */
  let isMusicPlaying = false;

  function playMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.6;
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      updateMusicIcon();
    }).catch(() => {
      isMusicPlaying = false;
      updateMusicIcon();
    });
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicIcon();
  }

  function updateMusicIcon() {
    if (!musicBtn) return;
    const icon = musicBtn.querySelector('i');
    if (isMusicPlaying) {
      icon.classList.remove('fa-music');
      icon.classList.add('fa-compact-disc', 'fa-spin');
      musicBtn.classList.add('playing');
    } else {
      icon.classList.remove('fa-compact-disc', 'fa-spin');
      icon.classList.add('fa-music');
      musicBtn.classList.remove('playing');
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // Auto play music jika undangan sudah pernah dibuka di session ini
  if (sessionStorage.getItem('invitationOpened') === 'true' && bgMusic) {
    document.addEventListener('click', function autoPlayOnce() {
      if (!isMusicPlaying) playMusic();
      document.removeEventListener('click', autoPlayOnce);
    }, { once: true });
  }

  /* ============================================
     4. COUNTDOWN TIMER
     ============================================ */
  const weddingDate = new Date('2026-10-11T08:30:00').getTime();

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ============================================
     5. SCROLL ANIMATIONS (Intersection Observer)
     ============================================ */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // Jalankan langsung jika main content sudah terlihat (dari sessionStorage)
  if (sessionStorage.getItem('invitationOpened') === 'true') {
    initScrollAnimations();
  }

  /* ============================================
     6. NAVBAR ACTIVE LINK (Desktop & Bottom Nav)
     ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const navbar = document.getElementById('navbar');

  function setActiveNav() {
    let currentSection = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    bottomNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === currentSection) {
        item.classList.add('active');
      }
    });

    // Navbar shadow saat scroll
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', setActiveNav);
  setActiveNav();

  /* ============================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     8. SCROLL TO TOP BUTTON
     ============================================ */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     9. COPY REKENING (semua bank bisa disalin)
     ============================================ */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const number = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(number);
        copyFeedback(btn);
      } catch (err) {
        // Fallback untuk browser lama
        const tempInput = document.createElement('input');
        tempInput.value = number;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copyFeedback(btn);
      }
    });
  });

  function copyFeedback(btn) {
    const originalHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Berhasil Disalin';
    showToast('Nomor rekening berhasil disalin!');

    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 2000);
  }

  /* ============================================
     10. RSVP FORM SUBMIT → GOOGLE SHEETS
     ============================================ */
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSubmitBtn = document.getElementById('rsvp-submit-btn');

  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz9GTC4i--VggBt59UpGQ3PjZDt3czbl0wzuCX5CbtvFzQYDpXudqncJhR9hkZqvTqqXQ/exec';

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(rsvpForm);
      const payload = {
        nama: formData.get('nama'),
        kehadiran: formData.get('kehadiran'),
        jumlah: formData.get('jumlah'),
        ucapan: formData.get('ucapan') || '-'
      };

      const originalBtnHTML = rsvpSubmitBtn.innerHTML;
      rsvpSubmitBtn.disabled = true;
      rsvpSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengirim...';

      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(() => {
          showToast(`Terima kasih, ${payload.nama}! RSVP Anda telah kami terima.`);
          rsvpForm.reset();

          // Tampilkan ucapan baru langsung di daftar tanpa perlu reload
          prependWish({
            nama: payload.nama,
            kehadiran: payload.kehadiran,
            ucapan: payload.ucapan
          });
        })
        .catch(() => {
          showToast('Gagal mengirim RSVP. Silakan coba lagi.');
        })
        .finally(() => {
          rsvpSubmitBtn.disabled = false;
          rsvpSubmitBtn.innerHTML = originalBtnHTML;
        });
    });
  }

  /* ============================================
     10B. DAFTAR UCAPAN & DOA (ambil dari Google Sheets)
     ============================================ */
  const wishesList = document.getElementById('wishes-list');
  const wishesEmpty = document.getElementById('wishes-empty');

  // Avatar anonim — SVG ikon bawaan (BUKAN dari layanan luar, jadi selalu muncul)
  const ANONYMOUS_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="40" fill="#F4ECE2"/>
      <circle cx="40" cy="32" r="14" fill="#C6A27A"/>
      <path d="M12 72c0-15.5 12.5-24 28-24s28 8.5 28 24" fill="#C6A27A"/>
    </svg>
  `);

  function createWishItem({ nama, ucapan }) {
    const wishEl = document.createElement('div');
    wishEl.className = 'flex gap-3 glass-card rounded-2xl p-4';
    wishEl.innerHTML = `
      <div class="relative w-11 h-11 flex-shrink-0">
        <div class="absolute inset-0 rounded-full border border-gold/40"></div>
        <img src="${ANONYMOUS_AVATAR}" alt="Tamu" class="w-full h-full rounded-full object-cover p-0.5">
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-heading text-lg text-brown truncate mb-1">${escapeHTML(nama)}</p>
        <p class="text-xs text-brown/70 leading-relaxed break-words">${escapeHTML(ucapan)}</p>
      </div>
    `;
    return wishEl;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  const WISHES_PER_PAGE = 15;
  let allWishes = [];
  let wishesShownCount = 0;

  function prependWish(wish) {
    if (!wishesList) return;
    if (wishesEmpty) wishesEmpty.remove();
    allWishes.unshift(wish);
    wishesShownCount++;
    wishesList.prepend(createWishItem(wish));
  }

  function renderMoreWishes() {
    const nextBatch = allWishes.slice(wishesShownCount, wishesShownCount + WISHES_PER_PAGE);
    nextBatch.forEach(item => {
      wishesList.appendChild(createWishItem(item));
    });
    wishesShownCount += nextBatch.length;
    updateShowMoreButton();
  }

  function updateShowMoreButton() {
    const existingBtn = document.getElementById('show-more-wishes-btn');
    if (existingBtn) existingBtn.remove();

    if (wishesShownCount < allWishes.length) {
      const btn = document.createElement('button');
      btn.id = 'show-more-wishes-btn';
      btn.className = 'block mx-auto mt-2 px-6 py-2.5 rounded-full border border-gold text-gold text-xs tracking-wide hover:bg-gold hover:text-cream transition-all duration-300';
      btn.innerHTML = `Lihat Semua Ucapan (${allWishes.length - wishesShownCount} lainnya)`;
      btn.addEventListener('click', renderMoreWishes);
      wishesList.after(btn);
    }
  }

  function loadWishes() {
    if (!wishesList || !GOOGLE_SHEETS_URL.includes('script.google.com')) {
      if (wishesEmpty) wishesEmpty.textContent = 'Ucapan belum tersedia.';
      return;
    }

    fetch(GOOGLE_SHEETS_URL)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          if (wishesEmpty) wishesEmpty.textContent = 'Jadilah yang pertama memberi ucapan!';
          return;
        }
        if (wishesEmpty) wishesEmpty.remove();
        allWishes = data.reverse();
        renderMoreWishes();
      })
      .catch(() => {
        if (wishesEmpty) wishesEmpty.textContent = 'Gagal memuat ucapan.';
      });
  }

  loadWishes();

  /* ============================================
     11. TOAST NOTIFICATION
     ============================================ */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

});