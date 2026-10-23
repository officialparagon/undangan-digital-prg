/**
 * JARANG PULANG x PARAGON (JPxPRG) - Creative Luxury UI/UX Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to') || urlParams.get('guest') || urlParams.get('nama') || '';
  const guestRole = urlParams.get('role') || urlParams.get('category') || 'FREE VIP';

  // Generate unique pass ID for this session
  const randomPassNum = Math.floor(1000 + Math.random() * 9000);
  const passId = `JP-2026-${randomPassNum}`;

  // Populate guest name into DOM
  const guestNameEls = document.querySelectorAll('.display-guest-name');
  guestNameEls.forEach(el => {
    el.textContent = guestName ? guestName : 'VIP Guest';
  });

  const guestRoleEls = document.querySelectorAll('.display-guest-role');
  guestRoleEls.forEach(el => {
    el.textContent = guestRole.toUpperCase();
  });

  const passIdEls = document.querySelectorAll('.display-pass-id');
  passIdEls.forEach(el => {
    el.textContent = passId;
  });

  // 2. 3D Tilt Effect on the VIP Access Pass
  const vipCard = document.getElementById('vipPassCard');
  if (vipCard) {
    const handleMove = (e) => {
      const rect = vipCard.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      const rotateX = -(y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;

      vipCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleLeave = () => {
      vipCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
  }

  // 3. Load Event Settings
  const defaultSettings = {
    eventName: 'GRAND OPENING MAP JARANG PULANG',
    eventDate: '2026-10-26T21:00:00+08:00', // Senin 26 Oktober 2026, 21:00 WITA
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
  document.querySelectorAll('.link-roblox-map').forEach(el => el.href = savedSettings.mapUrl);
  document.querySelectorAll('.link-discord').forEach(el => el.href = savedSettings.discordUrl);
  document.querySelectorAll('.link-community').forEach(el => el.href = savedSettings.communityUrl);
  document.querySelectorAll('.link-tiktok').forEach(el => el.href = savedSettings.tiktokUrl);

  // 4. Minimalist Luxury Countdown (Senin, 26 Oktober 2026, 21:00 WITA)
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
      if (statusEl) statusEl.textContent = '🔥 VIP EVENT IS LIVE NOW!';
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

  // 5. Unlock VIP Pass Curtain
  const coverEl = document.getElementById('invitationCover');
  const btnUnlock = document.getElementById('btnUnlockPass');

  if (btnUnlock && coverEl) {
    btnUnlock.addEventListener('click', () => {
      coverEl.classList.add('opened');

      // Start MANADO VIBES soundtrack
      if (window.paragonAudio) {
        window.paragonAudio.play(savedSettings.audioUrl);
      }

      // Elegant silver & neon cyan particle burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00d2ff', '#ffffff', '#0062ff', '#94a3b8']
        });
      }
    });
  }

  // 6. Floating Command Bar Audio Controls with Visualizer Waves
  const islandAudioBtn = document.getElementById('islandAudioBtn');
  const waveBars = document.querySelectorAll('.wave-bar');

  if (islandAudioBtn) {
    islandAudioBtn.addEventListener('click', () => {
      if (window.paragonAudio) {
        window.paragonAudio.toggle(savedSettings.audioUrl);
      }
    });

    window.addEventListener('paragon-audio-state', (e) => {
      const isPlaying = e.detail.playing;
      if (isPlaying) {
        islandAudioBtn.classList.add('playing');
        waveBars.forEach(bar => bar.style.animationPlayState = 'running');
      } else {
        islandAudioBtn.classList.remove('playing');
        waveBars.forEach(bar => bar.style.animationPlayState = 'paused');
      }
    });
  }

  // 7. Interactive RSVP & Digital Ticket Generator
  initRsvpAndTicket(guestName, guestRole, passId);

  // 8. Add to Google Calendar
  const btnGoogleCal = document.getElementById('btnGoogleCal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Grand Opening Map JARANG PULANG (JPxPRG)')}&dates=20261026T130000Z/20261026T160000Z&details=${encodeURIComponent('Grand Opening Map Jarang Pulang (JPxPARAGON) Roblox. Dresscode: Outfit terbaik! Link: ' + savedSettings.mapUrl)}&location=${encodeURIComponent('Roblox - JARANG PULANG')}`;
      window.open(gcalUrl, '_blank');
    });
  }

  // 9. Quick Share & Copy Buttons
  document.querySelectorAll('.btn-copy-invite').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('✅ Link VIP Pass berhasil disalin!');
      });
    });
  });
});

// Toast notification
function showToast(msg) {
  let toast = document.getElementById('jpToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'jpToast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(6, 12, 26, 0.96);
      border: 1px solid #00d2ff;
      color: #fff;
      padding: 0.75rem 1.6rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 210, 255, 0.35);
      z-index: 1000000;
      transition: all 0.3s ease;
      font-family: 'Space Grotesk', sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
  }, 3000);
}

// RSVP & Ticket Generator
function initRsvpAndTicket(guestName, guestRole, passId) {
  const form = document.getElementById('rsvpForm');
  const wishesList = document.getElementById('wishesList');
  const ticketResultBox = document.getElementById('ticketResultBox');
  const inputName = document.getElementById('rsvpName');

  if (inputName && guestName && guestName !== 'VIP Guest') {
    inputName.value = guestName;
  }

  const defaultWishes = [
    {
      name: 'Founder JPxPRG',
      role: 'FOUNDER',
      status: 'hadir',
      message: 'Welcome to Jarang Pulang penthouse club! Same people, different stories. Siapkan outfit terkeren kalian! 🩶🩵🔥',
      time: '1 jam yang lalu'
    },
    {
      name: 'Admin Jarang Pulang',
      role: 'STAFF',
      status: 'hadir',
      message: 'Map JPxPARAGON mewah banget! Sound system MANADO VIBES siap goyang semalaman sampai subuh! 🎧🕺🏻',
      time: '2 jam yang lalu'
    },
    {
      name: 'VIP Member',
      role: 'VIP',
      status: 'hadir',
      message: 'Dresscode outfit terbaik ready, see you on Monday 26 Oktober! 🥳✨',
      time: '4 jam yang lalu'
    }
  ];

  function getWishes() {
    try {
      const stored = localStorage.getItem('jp_wishes');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultWishes;
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getWishes();
    const countEl = document.getElementById('wishesCount');
    if (countEl) countEl.textContent = wishes.length;

    wishesList.innerHTML = wishes.map(w => {
      let statusBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">✓ Hadir</span>';
      if (w.status === 'ragu') {
        statusBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">? Ragu</span>';
      } else if (w.status === 'tidak') {
        statusBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">✕ Absen</span>';
      }

      return `
        <div class="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-[11px] font-bold text-black">
                ${(w.name || 'J')[0]}
              </div>
              <div>
                <span class="font-bold text-xs text-white">${escapeHtml(w.name)}</span>
                <span class="text-[10px] text-slate-500 ml-1.5">${w.time || 'Baru saja'}</span>
              </div>
            </div>
            ${statusBadge}
          </div>
          <p class="text-xs text-slate-300 pl-9">${escapeHtml(w.message)}</p>
        </div>
      `;
    }).join('');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('rsvpName')?.value || '').trim() || 'Anonymous VIP';
      const status = document.querySelector('input[name="attendance"]:checked')?.value || 'hadir';
      const message = (document.getElementById('rsvpMessage')?.value || '').trim();

      if (!message) {
        alert('Silakan tuliskan ucapan atau pesan kamu!');
        return;
      }

      const newWish = { name, status, message, time: 'Baru saja' };
      const wishes = getWishes();
      wishes.unshift(newWish);
      localStorage.setItem('jp_wishes', JSON.stringify(wishes));

      // Show personal digital VIP boarding pass ticket
      if (ticketResultBox) {
        ticketResultBox.innerHTML = `
          <div class="boarding-pass mt-4 space-y-3">
            <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2">
              <div>
                <div class="text-[10px] font-mono text-cyan-400 font-bold">DIGITAL VIP PASS</div>
                <div class="font-syne font-extrabold text-sm text-white">${escapeHtml(name)}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-slate-400">STATUS</div>
                <div class="text-xs font-bold text-cyan-300 uppercase">${status === 'hadir' ? 'CONFIRMED HADIR 🔥' : status}</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span class="text-slate-500 block text-[9px]">EVENT</span>
                <span class="font-bold text-slate-200">JPxPARAGON</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[9px]">DATE</span>
                <span class="font-bold text-slate-200">26 OKT 2026</span>
              </div>
              <div>
                <span class="text-slate-500 block text-[9px]">PASS ID</span>
                <span class="font-mono text-cyan-300 font-bold">${passId}</span>
              </div>
            </div>
            <div class="pt-2 text-center border-t border-slate-800 text-[10px] text-slate-400 font-mono tracking-widest">
              ||| | ||||| || |||||| |||| | ||| |||| |
            </div>
          </div>
        `;
        ticketResultBox.scrollIntoView({ behavior: 'smooth' });
      }

      renderWishes();
      form.reset();
      showToast('🎉 Konfirmasi & Tiket VIP kamu berhasil dibuat!');

      if (typeof confetti === 'function') {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      }
    });
  }

  renderWishes();
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
