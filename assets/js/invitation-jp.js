/**
 * JARANG PULANG x PARAGON (JPxPRG) - Digital Invitation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest') || urlParams.get('nama') || '';
  const guestRole = urlParams.get('role') || urlParams.get('category') || 'FREE VIP';

  // Populate guest name into DOM
  const guestNameEls = document.querySelectorAll('.display-guest-name');
  guestNameEls.forEach(el => {
    el.textContent = guestName ? guestName : 'Everyone';
  });

  const guestRoleEls = document.querySelectorAll('.display-guest-role');
  guestRoleEls.forEach(el => {
    el.textContent = guestRole.toUpperCase();
  });

  // 2. Load Event Settings for Jarang Pulang
  const defaultSettings = {
    eventName: 'GRAND OPENING MAP JARANG PULANG',
    eventDate: '2026-10-26T21:00:00+08:00', // Senin 26 Oktober 2026, 21:00 WITA (UTC+8)
    dresscode: 'Outfit terbaik',
    mapUrl: 'https://www.roblox.com/share?code=4b3113205fb35e458612be341c1bf396&type=ExperienceDetails&stamp=1792731142769',
    discordUrl: 'https://discord.gg/yM8DMpSx',
    communityUrl: 'https://www.roblox.com/communities/728759089/PARAGON-COMMUNITY#!/about',
    tiktokUrl: 'https://www.tiktok.com/@prgxparagon_?_r=1&_t=ZS-9ASPmgSwmCl',
    audioUrl: 'assets/audio/manado-vibes.mp3'
  };

  let savedSettings = defaultSettings;
  try {
    const raw = localStorage.getItem('jp_event_settings');
    if (raw) savedSettings = { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Could not parse settings:', e);
  }

  // Update Dynamic Links
  const mapLinkBtns = document.querySelectorAll('.link-roblox-map');
  mapLinkBtns.forEach(btn => btn.href = savedSettings.mapUrl);

  const discordLinkBtns = document.querySelectorAll('.link-discord');
  discordLinkBtns.forEach(btn => btn.href = savedSettings.discordUrl);

  const communityLinkBtns = document.querySelectorAll('.link-community');
  communityLinkBtns.forEach(btn => btn.href = savedSettings.communityUrl);

  const tiktokLinkBtns = document.querySelectorAll('.link-tiktok');
  tiktokLinkBtns.forEach(btn => btn.href = savedSettings.tiktokUrl);

  // 3. Countdown Timer (Senin, 26 Oktober 2026, 21:00 WITA)
  const targetDate = new Date(savedSettings.eventDate).getTime();
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      const statusEl = document.getElementById('eventStatusBadge');
      if (statusEl) statusEl.textContent = '🎉 PARTY IS HAPPENING NOW!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. Open Invitation Curtain & Sound Trigger
  const coverEl = document.getElementById('invitationCover');
  const btnOpen = document.getElementById('btnOpenInvitation');
  const audioFloatingBtn = document.getElementById('audioFloatingBtn');

  if (btnOpen && coverEl) {
    btnOpen.addEventListener('click', () => {
      coverEl.classList.add('opened');
      
      // Start audio
      if (window.paragonAudio) {
        window.paragonAudio.play(savedSettings.audioUrl);
      }

      // Confetti burst with cyan, silver & blue theme
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 85,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#94a3b8', '#0077fe', '#ffffff']
        });
      }
    });
  }

  // 5. Floating Audio Button toggle
  if (audioFloatingBtn) {
    audioFloatingBtn.addEventListener('click', () => {
      if (window.paragonAudio) {
        window.paragonAudio.toggle(savedSettings.audioUrl);
      }
    });

    window.addEventListener('paragon-audio-state', (e) => {
      const isPlaying = e.detail.playing;
      if (isPlaying) {
        audioFloatingBtn.classList.add('playing');
        audioFloatingBtn.innerHTML = `
          <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        `;
      } else {
        audioFloatingBtn.classList.remove('playing');
        audioFloatingBtn.innerHTML = `
          <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
          </svg>
        `;
      }
    });
  }

  // 6. Particles Canvas
  initParticles();

  // 7. RSVP and Wishes System
  initWishes(guestName);

  // 8. Add to Google Calendar (Senin 26 Oktober 2026 21:00 WITA -> 13:00 UTC)
  const btnGoogleCal = document.getElementById('btnGoogleCal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Grand Opening Map JARANG PULANG (JPxPRG)')}&dates=20261026T130000Z/20261026T160000Z&details=${encodeURIComponent('Acara Grand Opening Map Jarang Pulang (JPxPARAGON) di Roblox. Dresscode: Outfit terbaik! Link map: ' + savedSettings.mapUrl)}&location=${encodeURIComponent('Roblox - JARANG PULANG')}`;
      window.open(gcalUrl, '_blank');
    });
  }

  // 9. Copy Link Button
  const btnCopyShare = document.getElementById('btnCopyShare');
  if (btnCopyShare) {
    btnCopyShare.addEventListener('click', () => {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('✅ Link undangan berhasil disalin!');
      }).catch(() => {
        showToast('Link: ' + shareUrl);
      });
    });
  }
});

// Toast notification
function showToast(msg) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.style.cssText = `
      position: fixed;
      bottom: 85px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(8, 20, 44, 0.95);
      border: 1px solid #00f0ff;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      box-shadow: 0 0 25px rgba(0,240,255,0.4);
      z-index: 100000;
      transition: opacity 0.3s ease;
      font-family: 'Plus Jakarta Sans', sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

// Background Particles
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 65 : 35, 70);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? '#00f0ff' : '#cbd5e1'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

// RSVP & Wishes Feed for Jarang Pulang
function initWishes(currentGuestName) {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');
  const wishesCountEl = document.getElementById('wishesCount');
  const inputName = document.getElementById('rsvpName');

  if (inputName && currentGuestName && currentGuestName !== 'Everyone') {
    inputName.value = currentGuestName;
  }

  const defaultWishes = [
    {
      name: 'Founder JPxPRG',
      role: 'FOUNDER',
      status: 'hadir',
      message: 'Selamat datang di map Jarang Pulang! Same people, different stories! Siapkan outfit terkeren kalian! 🩶🩵🔥',
      time: '1 jam yang lalu'
    },
    {
      name: 'Admin Jarang Pulang',
      role: 'STAFF',
      status: 'hadir',
      message: 'Grand Opening Jarang Pulang bakal seru banget! Jangan lupa ajak squad kalian buat kumpul dan ramaikan map bareng 🪩🕺🏻',
      time: '2 jam yang lalu'
    },
    {
      name: 'VIP Member',
      role: 'VIP',
      status: 'hadir',
      message: 'Vibes map JPxPARAGON mewah banget! See you all on Senin 26 Oktober guys 🥳✨',
      time: '4 jam yang lalu'
    }
  ];

  function getWishes() {
    try {
      const stored = localStorage.getItem('jp_wishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Wishes error', e);
    }
    return defaultWishes;
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getWishes();
    if (wishesCountEl) wishesCountEl.textContent = wishes.length;

    wishesList.innerHTML = wishes.map(w => {
      let badgeHtml = '';
      if (w.status === 'hadir') {
        badgeHtml = '<span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">✓ Hadir</span>';
      } else if (w.status === 'ragu') {
        badgeHtml = '<span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">? Ragu-ragu</span>';
      } else {
        badgeHtml = '<span class="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">✕ Berhalangan</span>';
      }

      return `
        <div class="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-500/40 transition-all">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-slate-400 flex items-center justify-center text-xs font-bold text-black uppercase shadow-lg shadow-cyan-500/20">
                ${(w.name || 'G')[0]}
              </div>
              <div>
                <h4 class="font-bold text-sm text-cyan-200">${escapeHtml(w.name)}</h4>
                <span class="text-[11px] text-slate-400">${w.time || 'Baru saja'}</span>
              </div>
            </div>
            ${badgeHtml}
          </div>
          <p class="text-sm text-slate-200 pl-10">${escapeHtml(w.message)}</p>
        </div>
      `;
    }).join('');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('rsvpName')?.value || '').trim() || 'Anonymous';
      const status = document.querySelector('input[name="attendance"]:checked')?.value || 'hadir';
      const message = (document.getElementById('rsvpMessage')?.value || '').trim();

      if (!message) {
        alert('Silakan tuliskan ucapan atau pesan kamu!');
        return;
      }

      const newWish = {
        name,
        status,
        message,
        time: 'Baru saja'
      };

      const wishes = getWishes();
      wishes.unshift(newWish);
      localStorage.setItem('jp_wishes', JSON.stringify(wishes));

      // Also record RSVP to guest list if matching
      try {
        const guestData = localStorage.getItem('jp_guest_list');
        if (guestData) {
          const list = JSON.parse(guestData);
          const found = list.find(g => g.name.toLowerCase() === name.toLowerCase());
          if (found) {
            found.rsvpStatus = status;
            localStorage.setItem('jp_guest_list', JSON.stringify(list));
          }
        }
      } catch (err) {}

      renderWishes();
      form.reset();
      showToast('🎉 Ucapan berhasil terkirim! Terima kasih.');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    });
  }

  renderWishes();
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
