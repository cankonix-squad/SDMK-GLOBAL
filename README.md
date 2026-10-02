# SDMK GLOBAL

Mockup aplikasi mobilitas global tenaga medis dan tenaga kesehatan untuk review tampilan dan alur pengguna.

## Halaman review

- `index.html` / `landing-page.html`: portal publik dan daftar minat.
- `login.html` / `workspace-nakes.html`: simulasi login dan workspace Nakes.
- `login-mitra.html` / `workspace-mitra.html`: simulasi login dan workspace Mitra.
- `admin.html`: dashboard admin dan CMS lokal.

Login menggunakan data contoh sesuai format formulir. Autentikasi, verifikasi, angka dashboard, dan integrasi sistem eksternal merupakan simulasi. Gunakan data fiktif untuk review. Sebagian perubahan hanya tersimpan di browser atau sesi pengguna.

## Jalankan lokal

Dari folder repository:

```sh
python3 -m http.server 8000
```

Buka http://localhost:8000/.

## Publikasi GitHub Pages

Pada Settings → Pages, pilih Deploy from a branch, branch `main`, folder `/ (root)`, lalu Save. Setelah publikasi berhasil, halaman review tersedia di https://cankonix-squad.github.io/SDMK-GLOBAL/.

## Lingkup versi awal

Versi ini memuat mockup yang tersedia sebelum penerapan catatan baru tentang level bahasa, 17 negara penempatan, dan daftar mitra kerja sama.
