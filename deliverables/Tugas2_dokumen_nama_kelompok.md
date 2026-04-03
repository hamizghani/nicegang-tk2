# Tugas 2 - Kelompok

## 1. Penjelasan Singkat Web
Tuliskan deskripsi singkat website biodata kelompok yang dibuat, fitur utama, dan tujuan keamanan.

Contoh:
- Website menampilkan biodata anggota tanpa login.
- Login menggunakan Google OAuth untuk autentikasi.
- Hanya anggota kelompok dengan email tertentu yang punya hak mengubah tampilan website.

## 2. Komponen yang Digunakan
- Backend: Node.js + Express
- Authentication: Passport + Google OAuth 2.0
- Authorization: Email allow-list (`AUTHORIZED_EMAILS`)
- Security: Helmet, CSRF token, session cookie security
- Templating: EJS
- Styling: CSS

## 3. Mekanisme Autentikasi dan Otorisasi

### Autentikasi
Jelaskan alur login Google:
1. User klik login Google.
2. User diarahkan ke consent screen Google.
3. Setelah sukses, aplikasi menerima callback dan membuat session login.

### Otorisasi
Jelaskan kontrol akses:
1. Sistem cek email user login.
2. Jika email ada di daftar anggota, user bisa akses editor tema.
3. Jika tidak, user tetap bisa lihat konten tetapi tidak dapat mengubah tampilan.

## 4. Screenshot Aplikasi
Masukkan screenshot berikut:
1. Halaman biodata sebelum login
2. Login Google berhasil
3. Akses editor tema oleh akun yang diizinkan
4. Akses ditolak untuk akun login yang tidak diizinkan
5. Hasil perubahan tampilan setelah tema diperbarui

## 5. Kesimpulan
Tuliskan ringkasan singkat bahwa requirement tugas sudah dipenuhi.
