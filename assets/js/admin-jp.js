/**
 * JARANG PULANG x PARAGON (JPxPRG) - Admin Management Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Determine Base URL pointing to index.html
  let baseUrl = window.location.origin + window.location.pathname;
  baseUrl = baseUrl.replace('/admin-jp.html', '/index.html')
                   .replace('/admin.html', '/index.html')
                   .replace('/admin/index.html', '/index.html')
                   .replace('/admin/', '/')
                   .replace('/jarang-pulang.html', '/index.html');
  if (!baseUrl.endsWith('index.html') && !baseUrl.endsWith('/')) {
    baseUrl += '/';
  }

  // State keys in LocalStorage for Jarang Pulang
  const STORAGE_GUESTS = 'jp_guest_list';
  const STORAGE_SETTINGS = 'jp_event_settings';
  const STORAGE_WISHES = 'jp_wishes';

  // Default initial guest sample
  const defaultGuests = [
    { id: 1, name: 'Reza Fams', role: 'FREE VIP', phone: '', rsvpStatus: 'hadir', createdAt: '2026-10-23' },
    { id: 2, name: 'Bryan Roblox', role: 'FREE VIP', phone: '', rsvpStatus: 'ragu', createdAt: '2026-10-23' },
    { id: 3, name: 'Squad JP Cyber', role: 'PARAGON FAMS', phone: '', rsvpStatus: 'hadir', createdAt: '2026-10-23' }
  ];

  function getGuests() {
    try {
      const data = localStorage.getItem(STORAGE_GUESTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return defaultGuests;
  }

  function saveGuests(list) {
    localStorage.setItem(STORAGE_GUESTS, JSON.stringify(list));
    renderGuestList();
    updateStats();
  }

  // 1. WhatsApp Message Formatter for Jarang Pulang
  function generateWhatsAppMessage(name, role, link) {
    return `🎊 *UNDANGAN GRAND OPENING* 🎊

🩶 *JARANG PULANGxPARAGON* 🩵

Halo *${name}* 👋
Dengan hormat kami *JPxPRG* turut mengundang kalian semua untuk hadir dan meramaikan acara *GRAND OPENING MAP JARANG PULANG* 🥳 

Dan jangan lupa ajak teman dan share ke teman-teman kalian, dan ikut meramaikan malam kita 🪩

Dengan 👇🏻
🎧 *Mendengarkan musik* 
🕺🏻 *Joget bareng*
🔥 *Party bareng*
💃 *Seru-seruan bareng*
🤝 *Kumpul dan ramaikan map bersama!*
Dan pastinya menikmati vibes malam di JPxPRG 🔥

--------------⚡ *${role}* ⚡--------------

Catat tanggalnya 👇🏻
📅 *Hari/Tanggal* : Senin 26 Oktober 2026
⏰ *Jam* : 09:00 PM ( 21:00 WITA )
👔 *Dresscode* : Outfit terbaik 
📍 *Map* : JARANG PULANG

👇 *Buka Undangan Digital Spesial Kamu Di Sini:*
${link}

🩶 Kami tunggu kehadiran kalian untuk sama-sama kita seru-seruan bareng di GRAND OPENING map JPxPRG kami 🩵🩶

Sampai ketemu di Jarang Pulang 🩵🩶
🔹•••••• *PARAGON FAMS* ••••••🔹`;
  }

  // 2. Build Single Link
  function buildInviteUrl(name, role) {
    const encodedName = encodeURIComponent(name.trim());
    const encodedRole = encodeURIComponent(role.trim());
    return `${baseUrl}?to=${encodedName}&role=${encodedRole}`;
  }

  // Live URL generator preview
  const singleNameInput = document.getElementById('singleGuestName');
  const singleRoleSelect = document.getElementById('singleGuestRole');
  const previewUrlInput = document.getElementById('previewGeneratedUrl');

  function updatePreviewUrl() {
    if (!previewUrlInput) return;
    const name = singleNameInput?.value.trim() || 'Nama Tamu';
    const role = singleRoleSelect?.value || 'FREE VIP';
    previewUrlInput.value = buildInviteUrl(name, role);
  }

  if (singleNameInput && singleRoleSelect) {
    singleNameInput.addEventListener('input', updatePreviewUrl);
    singleRoleSelect.addEventListener('change', updatePreviewUrl);
    updatePreviewUrl();
  }

  // 3. Single Guest Generator Form
  const singleForm = document.getElementById('singleInviteForm');
  if (singleForm) {
    singleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = singleNameInput.value.trim();
      const role = singleRoleSelect.value;
      const phone = (document.getElementById('singleGuestPhone')?.value || '').trim();

      if (!name) return;

      const guests = getGuests();
      const existing = guests.find(g => g.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        existing.role = role;
        existing.phone = phone;
      } else {
        guests.unshift({
          id: Date.now(),
          name,
          role,
          phone,
          rsvpStatus: 'pending',
          createdAt: new Date().toISOString().split('T')[0]
        });
      }

      saveGuests(guests);
      showAdminToast(`✅ Undangan untuk "${name}" berhasil dibuat & disimpan!`);
      singleNameInput.value = '';
      if (document.getElementById('singleGuestPhone')) {
        document.getElementById('singleGuestPhone').value = '';
      }
      updatePreviewUrl();
    });
  }

  // Copy Preview URL button
  const btnCopyPreview = document.getElementById('btnCopyPreviewUrl');
  if (btnCopyPreview && previewUrlInput) {
    btnCopyPreview.addEventListener('click', () => {
      navigator.clipboard.writeText(previewUrlInput.value).then(() => {
        showAdminToast('✅ Link berhasil disalin!');
      });
    });
  }

  // Send WhatsApp Preview button
  const btnWhatsAppPreview = document.getElementById('btnWhatsAppPreview');
  if (btnWhatsAppPreview) {
    btnWhatsAppPreview.addEventListener('click', () => {
      const name = singleNameInput?.value.trim() || 'Teman Fams';
      const role = singleRoleSelect?.value || 'FREE VIP';
      const phone = (document.getElementById('singleGuestPhone')?.value || '').replace(/\D/g, '');
      const link = buildInviteUrl(name, role);
      const text = generateWhatsAppMessage(name, role, link);

      let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      if (phone) {
        let cleanPhone = phone;
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
        waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
      }
      window.open(waUrl, '_blank');
    });
  }

  // 4. Batch Generator Form
  const batchForm = document.getElementById('batchInviteForm');
  if (batchForm) {
    batchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawText = document.getElementById('batchNamesText')?.value || '';
      const role = document.getElementById('batchRoleSelect')?.value || 'FREE VIP';
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      if (lines.length === 0) {
        alert('Silakan masukkan minimal 1 nama tamu.');
        return;
      }

      const guests = getGuests();
      let addedCount = 0;

      lines.forEach(name => {
        const existing = guests.find(g => g.name.toLowerCase() === name.toLowerCase());
        if (!existing) {
          guests.push({
            id: Date.now() + Math.random(),
            name,
            role,
            phone: '',
            rsvpStatus: 'pending',
            createdAt: new Date().toISOString().split('T')[0]
          });
          addedCount++;
        }
      });

      saveGuests(guests);
      showAdminToast(`🎉 Berhasil membuat ${addedCount} undangan baru!`);
      document.getElementById('batchNamesText').value = '';
    });
  }

  // 5. Render Guest Table
  const tableBody = document.getElementById('guestTableBody');
  const searchInput = document.getElementById('searchGuestInput');
  const filterStatus = document.getElementById('filterStatusSelect');

  function renderGuestList() {
    if (!tableBody) return;
    const guests = getGuests();
    const query = (searchInput?.value || '').toLowerCase().trim();
    const statusFilter = filterStatus?.value || 'all';

    const filtered = guests.filter(g => {
      const matchQuery = g.name.toLowerCase().includes(query) || (g.role && g.role.toLowerCase().includes(query));
      let matchStatus = true;
      if (statusFilter !== 'all') {
        matchStatus = g.rsvpStatus === statusFilter;
      }
      return matchQuery && matchStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-slate-400 text-sm">
            Tidak ada data undangan Jarang Pulang yang cocok.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map((g, index) => {
      const inviteUrl = buildInviteUrl(g.name, g.role || 'FREE VIP');
      
      let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-400 border border-slate-700">Pending</span>';
      if (g.rsvpStatus === 'hadir') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-500/50">✓ Hadir</span>';
      } else if (g.rsvpStatus === 'ragu') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] bg-amber-950 text-amber-300 border border-amber-500/50">? Ragu</span>';
      } else if (g.rsvpStatus === 'tidak') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[11px] bg-rose-950 text-rose-300 border border-rose-500/50">✕ Absen</span>';
      }

      return `
        <tr class="border-b border-cyan-900/30 hover:bg-slate-900/40 transition-colors">
          <td class="py-3 px-3 text-xs text-slate-400">${index + 1}</td>
          <td class="py-3 px-3 font-bold text-sm text-white">${escapeHtml(g.name)}</td>
          <td class="py-3 px-3">
            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
              ${escapeHtml(g.role || 'FREE VIP')}
            </span>
          </td>
          <td class="py-3 px-3">${statusBadge}</td>
          <td class="py-3 px-3">
            <input type="text" readonly value="${inviteUrl}" class="text-[11px] bg-black/50 border border-slate-700 rounded px-2 py-1 text-slate-300 w-48 select-all" />
          </td>
          <td class="py-3 px-3">
            <div class="flex items-center gap-1.5">
              <button 
                class="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30" 
                title="Salin Link"
                onclick="window.adminCopyLink('${encodeURIComponent(inviteUrl)}')"
              >
                📋
              </button>
              <button 
                class="p-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30" 
                title="Kirim WhatsApp"
                onclick="window.adminSendWa('${escapeJs(g.name)}', '${escapeJs(g.role || 'FREE VIP')}', '${escapeJs(g.phone || '')}', '${encodeURIComponent(inviteUrl)}')"
              >
                💬
              </button>
              <a 
                href="${inviteUrl}" 
                target="_blank" 
                class="p-1.5 rounded bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold" 
                title="Buka Preview"
              >
                👁️
              </a>
              <button 
                class="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30" 
                title="Hapus"
                onclick="window.adminDeleteGuest(${g.id})"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Global helper handlers for table buttons
  window.adminCopyLink = function(encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    navigator.clipboard.writeText(url).then(() => {
      showAdminToast('✅ Link undangan disalin ke clipboard!');
    });
  };

  window.adminSendWa = function(name, role, phone, encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    const text = generateWhatsAppMessage(name, role, url);
    let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (phone) {
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
      waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    }
    window.open(waUrl, '_blank');
  };

  window.adminDeleteGuest = function(id) {
    if (!confirm('Yakin ingin menghapus tamu ini dari daftar undangan?')) return;
    const guests = getGuests().filter(g => g.id !== id);
    saveGuests(guests);
    showAdminToast('Tamu berhasil dihapus.');
  };

  // Search & Filter listeners
  if (searchInput) searchInput.addEventListener('input', renderGuestList);
  if (filterStatus) filterStatus.addEventListener('change', renderGuestList);

  // 6. Stats Summary
  function updateStats() {
    const guests = getGuests();
    const statTotal = document.getElementById('statTotalGuests');
    const statHadir = document.getElementById('statHadir');
    const statRagu = document.getElementById('statRagu');
    const statAbsen = document.getElementById('statAbsen');

    if (statTotal) statTotal.textContent = guests.length;
    if (statHadir) statHadir.textContent = guests.filter(g => g.rsvpStatus === 'hadir').length;
    if (statRagu) statRagu.textContent = guests.filter(g => g.rsvpStatus === 'ragu').length;
    if (statAbsen) statAbsen.textContent = guests.filter(g => g.rsvpStatus === 'tidak').length;
  }

  // 7. Export to CSV & JSON
  const btnExportCsv = document.getElementById('btnExportCsv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const guests = getGuests();
      let csvContent = 'data:text/csv;charset=utf-8,No,Nama Tamu,Kategori,Status RSVP,Nomor WA,Link Undangan\n';
      guests.forEach((g, idx) => {
        const link = buildInviteUrl(g.name, g.role || 'FREE VIP');
        csvContent += `${idx + 1},"${g.name}","${g.role || 'FREE VIP'}","${g.rsvpStatus || 'pending'}","${g.phone || ''}","${link}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Daftar_Undangan_JP_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAdminToast('📥 File CSV berhasil diunduh!');
    });
  }

  const btnExportJson = document.getElementById('btnExportJson');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const guests = getGuests();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(guests, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `backup_undangan_jp_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showAdminToast('📥 Backup JSON berhasil disimpan!');
    });
  }

  // Import JSON
  const fileImportJson = document.getElementById('fileImportJson');
  if (fileImportJson) {
    fileImportJson.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            saveGuests(parsed);
            showAdminToast(`✅ Berhasil import ${parsed.length} tamu!`);
          } else {
            alert('Format file JSON tidak sesuai.');
          }
        } catch (err) {
          alert('Gagal membaca file JSON.');
        }
      };
      reader.readAsText(file);
    });
  }

  // 8. Wishes Moderation in Admin
  function renderAdminWishes() {
    const listEl = document.getElementById('adminWishesTable');
    if (!listEl) return;
    let wishes = [];
    try {
      const stored = localStorage.getItem(STORAGE_WISHES);
      if (stored) wishes = JSON.parse(stored);
    } catch (e) {}

    if (wishes.length === 0) {
      listEl.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-400 text-xs">Belum ada ucapan masuk untuk Jarang Pulang.</td></tr>`;
      return;
    }

    listEl.innerHTML = wishes.map((w, idx) => `
      <tr class="border-b border-cyan-900/30 hover:bg-slate-900/30">
        <td class="py-2.5 px-3 font-bold text-white text-xs">${escapeHtml(w.name)}</td>
        <td class="py-2.5 px-3 text-xs text-cyan-300 uppercase">${escapeHtml(w.status)}</td>
        <td class="py-2.5 px-3 text-xs text-slate-300 max-w-xs truncate">${escapeHtml(w.message)}</td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="window.adminDeleteWish(${idx})" class="text-rose-400 hover:text-rose-300 text-xs font-bold">Hapus</button>
        </td>
      </tr>
    `).join('');
  }

  window.adminDeleteWish = function(idx) {
    try {
      const raw = localStorage.getItem(STORAGE_WISHES);
      if (raw) {
        let wishes = JSON.parse(raw);
        wishes.splice(idx, 1);
        localStorage.setItem(STORAGE_WISHES, JSON.stringify(wishes));
        renderAdminWishes();
        showAdminToast('Ucapan berhasil dihapus.');
      }
    } catch (e) {}
  };

  // 9. Event Settings Form
  const settingsForm = document.getElementById('eventSettingsForm');
  if (settingsForm) {
    const defaultSettings = {
      eventName: 'GRAND OPENING MAP JARANG PULANG',
      eventDate: '2026-10-26T21:00:00+08:00',
      dresscode: 'Outfit terbaik',
      mapUrl: 'https://www.roblox.com/share?code=4b3113205fb35e458612be341c1bf396&type=ExperienceDetails&stamp=1792731142769',
      discordUrl: 'https://discord.gg/yM8DMpSx',
      communityUrl: 'https://www.roblox.com/communities/728759089/PARAGON-COMMUNITY#!/about',
      tiktokUrl: 'https://www.tiktok.com/@prgxparagon_?_r=1&_t=ZS-9ASPmgSwmCl',
      audioUrl: 'assets/audio/manado-vibes.mp3'
    };

    let cur = defaultSettings;
    try {
      const stored = localStorage.getItem(STORAGE_SETTINGS);
      if (stored) cur = { ...defaultSettings, ...JSON.parse(stored) };
    } catch (e) {}

    document.getElementById('settingMapUrl').value = cur.mapUrl || '';
    document.getElementById('settingDiscordUrl').value = cur.discordUrl || '';
    document.getElementById('settingCommunityUrl').value = cur.communityUrl || '';
    document.getElementById('settingTiktokUrl').value = cur.tiktokUrl || '';
    document.getElementById('settingAudioUrl').value = cur.audioUrl || '';

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      cur.mapUrl = document.getElementById('settingMapUrl').value.trim();
      cur.discordUrl = document.getElementById('settingDiscordUrl').value.trim();
      cur.communityUrl = document.getElementById('settingCommunityUrl').value.trim();
      cur.tiktokUrl = document.getElementById('settingTiktokUrl').value.trim();
      cur.audioUrl = document.getElementById('settingAudioUrl').value.trim();

      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(cur));
      showAdminToast('⚙️ Pengaturan Jarang Pulang berhasil disimpan!');
    });
  }

  // Initial runs
  renderGuestList();
  updateStats();
  renderAdminWishes();
});

function showAdminToast(msg) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: rgba(8, 20, 44, 0.95);
      border: 1px solid #00f0ff;
      color: #fff;
      padding: 0.85rem 1.5rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 0 30px rgba(0,240,255,0.4);
      z-index: 999999;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
  }, 3200);
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

function escapeJs(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
