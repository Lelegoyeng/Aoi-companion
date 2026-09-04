# Animasi Karakter (.vrma)

Semua animasi di folder ini memakai format **VRMA** (VRM Animation) dan
diputar lewat `src/animation/VRMAnimationPlayer.js` dengan pustaka
`@pixiv/three-vrm-animation`.

## Penamaan

Nama file pakai **kebab-case deskriptif** (tanpa kode `VRMA_0x`) sesuai
gerakannya, agar mudah dibaca dan dipakai sebagai id di kode:

| File | Gerakan | Dipakai | Keterangan |
|------|---------|---------|------------|
| `idle.vrma` | Idle (berdiri tenang, loop) | ✅ otomatis | Dimainkan terus saat tidak ada aksi |
| `greeting.vrma` | Salam / menyapa | ✅ reaksi `greeting` | Sekali putar, lalu kembali ke idle |
| `show-full-body.vrma` | Menunjukkan seluruh tubuh | ✅ reaksi `showBody` | Kata kunci: tampil, pamer, gaya |
| `peace-sign.vrma` | Tanda damai (V) | ✅ reaksi `reactionLove` / `peace` | Kata kunci: cinta, damai |
| `shoot.vrma` | Pose tembak | ✅ reaksi `shoot` | Kata kunci: tembak, dor |
| `spin.vrma` | Berputar | ✅ reaksi `spin` | Kata kunci: putar, berputar |
| `model-pose.vrma` | Pose model | ✅ reaksi `modelPose` | Kata kunci: selfie, foto, berpose |
| `squat.vrma` | Jongkok | ✅ reaksi `squat` | Kata kunci: jongkok |
| `angry.vrma` | Marah | ✅ reaksi `angry` | Kata kunci: marah, kesal, sebel |
| `blush.vrma` | Merona/malu | ✅ reaksi `shy` | Kata kunci: malu, gemes, imut |
| `clapping.vrma` | Bertepuk tangan | ✅ reaksi `smile` | Kata kunci: bagus, keren, hebat |
| `goodbye.vrma` | Pamitan | ✅ reaksi `goodbye` | Kata kunci: bye, dadah, pamit |
| `jump.vrma` | Melompat | ✅ reaksi `excited` | Kata kunci: hore, yey, menang |
| `look-around.vrma` | Melihat ke sekitar | ✅ reaksi `lookAround` | Kata kunci: cari, lihat-lihat |
| `relax.vrma` | Santai | ✅ reaksi `stretch` | Kata kunci: bosan, capek, lelah |
| `sad.vrma` | Sedih | ✅ reaksi `reactionSad` | Kata kunci: sedih, galau, kecewa |
| `sleepy.vrma` | Mengantuk | ✅ reaksi `sleepy` | Kata kunci: ngantuk, mengantuk |
| `surprised.vrma` | Terkejut | ✅ reaksi `reactionSurprise` | Kata kunci: wow, wah, serius |
| `thinking.vrma` | Berpikir | ✅ reaksi `thinking` | Kata kunci: kenapa, bagaimana, apa |

Semua file sudah **terdaftar** di `src/character.js` →
`createVRMAnimationPlayer(...)` dan dipicu otomatis lewat reaksi chat di
`src/main.js` (`REACTION_KEYWORDS` / `REACTION_RESPONSES`).

## Transisi antar animasi

Semua pergantian animasi memakai **crossfade halus** (±0,4 detik) dari
`src/animation/VRMAnimationPlayer.js`, jadi perpindahan seperti
`greeting` → `idle` tidak lagi terpotong mendadak melainkan melebur
secara natural.

## Sumber & lisensi

- `greeting.vrma`, `show-full-body.vrma`, `peace-sign.vrma`, `shoot.vrma`,
  `spin.vrma`, `model-pose.vrma`, `squat.vrma`
  → **pixiv VRMA Motion Pack 1** (salamat: lihat `licenses/VRMA-motion-pack-1-EN.txt`).
- `idle.vrma` serta isi **collection 2** diambil dari repo publik
  [ZaberKo/vrm-studio](https://github.com/ZaberKo/vrm-studio)
  (folder `public/animations/`), untuk dipakai di aplikasi ini.

> Catatan: animasi pixiv bersifat gratis dipakai/disunting selama tidak
> melanggar larangan pada berkas lisensi (mis. tidak mendistribusikannya
> sebagai aset yang bisa diekstrak/dirigging ulang).
