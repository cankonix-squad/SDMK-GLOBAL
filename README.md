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

## Publikasi dan CI/CD

Alamat review: https://sdmk-global.cankonix.com/.

Target server `root@187.77.127.202`, direktori `/root/cankonix-node/apps/sdmk-global`. Aplikasi berjalan dalam container Nginx melalui Traefik pada network eksternal `cankonix-proxy`. HTTPS menggunakan resolver `letsencrypt` yang sudah tersedia di server.

Workflow `.github/workflows/deploy.yml` memeriksa halaman, referensi aset, sintaks JavaScript, Docker Compose, dan konfigurasi Nginx. Pull request menjalankan validasi saja. Push ke `main` dan pemicu manual pada `main` menjalankan validasi serta deploy.

Tambahkan dua repository secrets di Settings → Secrets and variables → Actions:

- `SDMK_DEPLOY_SSH_KEY`: private key SSH khusus deployment, dengan public key pasangannya di `authorized_keys` pada server target. Akses akun root memberi workflow hak administratif pada server; batasi pihak yang bisa mengubah workflow dan branch deployment.
- `SDMK_DEPLOY_KNOWN_HOSTS`: entri host key SSH yang telah diverifikasi untuk `187.77.127.202`. Jangan memasukkan private key ke Git atau README.

Tanpa kedua secrets tersebut, job deploy berhenti dengan pesan secret yang belum tersedia. Tidak ada password atau private key disimpan dalam repository.

Setiap commit disimpan di `releases/<commit SHA>` dan dibuat menjadi image `sdmk-global:<commit SHA>`. File `current-release` mencatat versi yang aktif. Deployment memakai lock untuk mencegah dua proses bersamaan. Jika container atau pemeriksaan halaman internal gagal, script mengembalikan versi sebelumnya jika tersedia. Pemeriksaan HTTPS publik dilakukan setelah deployment; kegagalan DNS atau sertifikat dilaporkan oleh workflow dan tidak memicu rollback container. Release dan image lama tetap tersedia untuk rollback dan perlu dibersihkan berkala sesuai kebutuhan kapasitas disk.

Rollback manual pada server:

```sh
bash /root/cankonix-node/apps/sdmk-global/releases/<SHA_LAMA>/deploy/release.sh <SHA_LAMA>
```

Untuk deploy pertama lewat SSH lokal, unggah bundle HTML, aset, Dockerfile, `.dockerignore`, `compose.yaml`, dan folder `deploy` ke direktori release, lalu jalankan script tersebut dengan SHA commit yang diunggah.

Referensi: [GitHub Actions checkout](https://github.com/actions/checkout) dan [Docker Compose networks](https://docs.docker.com/reference/compose-file/networks/).

## Lingkup versi awal

Versi ini memuat mockup yang tersedia sebelum penerapan catatan baru tentang level bahasa, 17 negara penempatan, dan daftar mitra kerja sama.
