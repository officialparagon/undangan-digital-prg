# 🎊 Undangan Digital Grand Opening Map Paragon Party (PRG) 🩵

Website Undangan Digital interaktif bertema **Cyber Ice & Electric Neon Blue** untuk acara **Grand Opening Map PARAGON PARTY (Roblox)** yang siap di-hosting langsung ke **GitHub Pages** dan **Vercel**.

---

## 🌟 Fitur Utama

### 1. Halaman Undangan Publik (`index.html`)
- **Theme Cyber Ice / Neon Blue**: Visual estetik kristal es, neon cyan, laser party, dan poster resmi Paragon.
- **Amplop / Cover Interaktif**: Buka undangan dengan efek transisi halus, audio EDM otomatis berputar, dan letupan konfeti.
- **Audio Party Synth & Music Player**: Dilengkapi Web Audio API synth party beat (tanpa takut copyright/error) serta tombol disc vinyl untuk play/pause.
- **Personalized Guest Greeting**: Menyapa nama tamu secara dinamis dari link (contoh: `?to=Bro+Bryan&role=FREE+VVIP`).
- **Live Countdown Timer**: Menghitung mundur waktu secara real-time menuju **Minggu, 18 Oktober 2026, 21:00 WITA**.
- **Tombol Add to Google Calendar**: Langsung simpan jadwal acara ke kalender HP tamu.
- **Daftar Aktivitas Seru**: Musik, joget bareng, party vibes, dan kumpul map Roblox.
- **Tautan Resmi Terintegrasi**:
  - 🚀 Buka Map Roblox (Experience Details)
  - 🎧 Join Server Discord Resmi
  - 👑 Gabung Komunitas Roblox Paragon
  - 🎵 Follow TikTok Resmi `@prgxparagon_`
- **Dinding Pesan & Konfirmasi Kehadiran (RSVP)**: Tamu bisa memilih status kehadiran (Hadir 🔥 / Ragu 🤔 / Absen 😢) dan mengirimkan ucapan yang langsung muncul di layar.
- **Tombol Salin & Bagikan Link**: Mempermudah penyebaran ke grup atau teman.

### 2. Halaman Admin Portal (`admin.html` & `/admin/`)
- **Generator Link Undangan Khusus (Single)**:
  - Masukkan nama tamu, pilih badge (FREE VVIP, VIP Guest, Paragon Fams, dll), dan nomor WA.
  - Preview link dibuat otomatis secara real-time.
  - Tombol **1-Klik Kirim ke WhatsApp** dengan template undangan rapi lengkap dengan emoji.
- **Generator Undangan Sekaligus (Batch / Bulk)**:
  - Ketik atau paste daftar nama tamu (1 baris per nama), sistem akan men-generate undangan untuk semuanya sekaligus!
- **Tabel Daftar Tamu & Pantauan Kehadiran**:
  - Kolom nomor, nama, badge, link, dan status RSVP.
  - Pencarian dan filter instan berdasarkan nama atau status kehadiran.
  - Aksi cepat: Salin Link, Kirim WA, Buka Preview, Hapus Tamu.
  - **Export ke Excel (CSV)** dan **Backup/Restore JSON**.
- **Moderasi Ucapan**: Pantau dan kelola pesan/doa yang masuk dari tamu undangan.
- **Pengaturan Acara & Musik**: Ubah link map Roblox, Discord, TikTok, atau masukkan URL MP3 lagu custom kapan saja.

---

## 🚀 Panduan Hosting

### Pilihan A: Hosting ke Vercel (Rekomendasi - Cepat & Praktis)

1. **Upload folder proyek ke GitHub**:
   - Buat repository baru di [GitHub](https://github.com/new) (misal bernama `undangan-digital-prg`).
   - Di terminal folder proyek ini, jalankan:
     ```bash
     git init
     git add .
     git commit -m "Initial commit Paragon Party Invitation"
     git branch -M main
     git remote add origin https://github.com/USERNAME-KAMU/undangan-digital-prg.git
     git push -u origin main
     ```

2. **Deploy di Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
   - Klik **"Add New..."** -> **"Project"**.
   - Pilih repository `undangan-digital-prg`.
   - Pada pengaturan Framework Preset, biarkan **Other** (karena ini pure static web).
   - Klik **Deploy**.
   - Dalam hitungan detik, websitemu sudah online di `https://undangan-digital-prg.vercel.app`!
   - Jalur admin dapat diakses di: `https://undangan-digital-prg.vercel.app/admin` atau `https://undangan-digital-prg.vercel.app/admin.html`.

---

### Pilihan B: Hosting ke GitHub Pages (Gratis Selamanya)

1. Push kode ke repository GitHub (seperti langkah di atas).
2. Di halaman repository GitHub kamu, klik menu **Settings** (di tab atas).
3. Di bilah samping kiri, pilih **Pages**.
4. Di bagian **Build and deployment**:
   - Source: pilih **Deploy from a branch**.
   - Branch: pilih **main** dan folder **/(root)**.
   - Klik **Save**.
5. Tunggu 1–2 menit, GitHub akan menampilkan URL websitemu:
   `https://USERNAME-KAMU.github.io/undangan-digital-prg/`
6. Jalur admin dapat diakses di:
   `https://USERNAME-KAMU.github.io/undangan-digital-prg/admin.html` atau `.../admin/`.

---

## 📱 Format Link Undangan untuk Tamu

Admin dapat membuat link unik untuk siapapun cukup dengan menambahkan parameter URL:
- Format standar:
  `https://domain-kamu.vercel.app/?to=Nama+Tamu&role=FREE+VVIP`
- Contoh:
  - `https://domain-kamu.vercel.app/?to=Reza+Fams&role=FREE+VVIP`
  - `https://domain-kamu.vercel.app/?to=Squad+Cyber&role=PARAGON+FAMS`
- Jika dibuka tanpa parameter (`https://domain-kamu.vercel.app/`), nama default otomatis menjadi **Everyone**.

---

## 📂 Struktur File

```
UndanganDigitalPRG/
├── index.html                   # Halaman undangan publik untuk tamu
├── admin.html                   # Portal admin utama pembuat undangan
├── admin/
│   └── index.html               # Jalur alternatif folder /admin/
├── vercel.json                  # Konfigurasi routing bersih untuk Vercel
├── README.md                    # Dokumentasi & panduan deployment
└── assets/
    ├── css/
    │   └── style.css            # Styling Cyber Ice, neon glow, animasi
    ├── js/
    │   ├── audio-synth.js       # Audio engine Web Audio API club EDM
    │   ├── invitation.js        # Logika countdown, RSVP, cover, partikel
    │   └── admin.js             # Logika generator undangan & WA manager
    └── images/
        ├── paragon-party-poster.jpg # Poster resmi Paragon Party
        └── og-image.jpg             # Thumbnail preview untuk sosmed & WA
```

---

*One Family One Dream PRG 🤍 • Stronger Together PRG 🩵*
