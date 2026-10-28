# MusicVerse Adventure

Prototype game edukasi musik 3D untuk browser, dibuat dengan Three.js. Cocok untuk deploy sebagai situs statis di GitHub Pages.

## Fitur yang sudah tersedia
- Dunia 3D pastel: Melody Town, plaza, bangunan zona, pepohonan, fountain, partikel.
- Avatar 3D full-body sederhana dengan pilihan outfit, hijab on/off.
- Kamera third-person; kontrol WASD / tombol panah, Shift untuk lari, mouse drag untuk memutar kamera.
- NPC Lila, Rara, Mika dan objek instrumen yang bisa didekati.
- Panel misi: bertemu Lila, kuis tempo cepat/lambat, mencoba instrumen.
- Music Lab dengan piano, xylophone, drum, audio Web Audio API, pola bunyi play/clear.
- XP, coins, stars, level, outfit, misi tersimpan menggunakan localStorage.
- Tombol mute sound; background tone diredam saat Music Lab aktif.
- Responsive UI untuk desktop dan layar kecil.

## Cara menjalankan lokal
Karena game menggunakan JavaScript modules dan Three.js dari CDN, jalankan melalui server lokal (jangan membuka `index.html` langsung sebagai file).

### Cara mudah dengan VS Code
1. Extract ZIP.
2. Buka folder di VS Code.
3. Pasang ekstensi **Live Server**.
4. Klik kanan `index.html` → **Open with Live Server**.

### Alternatif Python
Di folder proyek, jalankan:
```bash
python -m http.server 8000
```
Lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub, misalnya `musicverse-adventure`.
2. Extract ZIP ini di komputer.
3. Upload **isi folder proyek** (index.html, style.css, game.js, README.md) ke root repository.
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih `Deploy from a branch`.
6. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
7. Tunggu beberapa menit; GitHub akan memberi URL Pages di halaman yang sama.

Tidak perlu build step atau `npm install` untuk versi GitHub Pages ini. Koneksi internet diperlukan untuk mengambil Three.js dari CDN dan font Google.

## Kontrol
- `W A S D` / tombol panah: bergerak
- `Shift`: berlari
- `Mouse drag`: putar kamera
- `E`: interaksi saat berada dekat NPC/objek
- `Esc`: menutup panel

## Catatan
Ini adalah **prototype awal**, bukan game multiplayer dan bukan aset/avatar ZEPETO. Model karakter dan dunia dibangun dari bentuk 3D sederhana agar ringan, bebas aset eksternal berlisensi, dan mudah dikembangkan. Pastikan browser mendukung WebGL dan audio.
