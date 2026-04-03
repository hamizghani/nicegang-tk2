# Tugas 2 - Authentication & Authorization

Project ini dibuat untuk memenuhi kebutuhan tugas:
- Website biodata kelompok bisa diakses tanpa login
- Login menggunakan Google OAuth 2.0
- Hanya akun anggota kelompok tertentu yang boleh mengubah tampilan (warna/font)

## 1. Cara Menjalankan

1. Pastikan Node.js versi 18+ terpasang.
2. Install dependencies:

```bash
npm install
```

3. Salin `.env.example` menjadi `.env`, lalu isi semua nilai yang diperlukan.
4. Jalankan aplikasi:

```bash
npm start
```

5. Buka `http://localhost:3000`.

## 2. Konfigurasi Google OAuth

1. Buka Google Cloud Console.
2. Buat OAuth Client ID (Web application).
3. Tambahkan redirect URI sesuai `.env`, contoh:
   - `http://localhost:3000/auth/google/callback`
4. Isi `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `GOOGLE_CALLBACK_URL` di `.env`.

## 3. Mekanisme Security

### Authentication
- User login via Google (`passport-google-oauth20`).
- Session disimpan dengan cookie `httpOnly`, `sameSite=lax`, dan `secure` saat production.

### Authorization
- Daftar email yang diizinkan edit tampilan diambil dari `AUTHORIZED_EMAILS`.
- User login yang email-nya tidak ada di daftar tetap bisa melihat website, tapi tidak bisa akses `/theme/edit`.

### Proteksi Tambahan
- Menggunakan `helmet` untuk hardening header keamanan HTTP.
- Menggunakan CSRF token (`csurf`) pada form sensitif (logout dan edit tema).
- Validasi input warna/font dilakukan di server sebelum disimpan.

## 4. Struktur File Penting

- `src/app.js` - Server utama, route, OAuth, session, CSRF
- `src/themeStore.js` - Penyimpanan + validasi tema
- `src/middleware/authz.js` - Middleware login & izin edit tema
- `views/` - Template EJS
- `public/css/base.css` - Style utama
- `deliverables/` - Template dokumen dan link video

## 5. Catatan Pengumpulan

Sesuai PDF tugas, siapkan bundel final:
- Dokumen: `Tugas2_dokumen_nama kelompok.pdf`
- Source zip: `Tugas2_source_nama kelompok.zip`
- Link video txt: `Tugas2_video_nama kelompok.txt`

Template awal dokumen dan file link video sudah disediakan di folder `deliverables/`.
