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
| `greeting.vrma` | Salam / menyapa | ✅ trigger `greeting` | Sekali putar, lalu kembali ke idle |
| `show-full-body.vrma` | Menunjukkan seluruh tubuh | — | Siap pakai |
| `peace-sign.vrma` | Tanda damai (V) | — | Siap pakai |
| `shoot.vrma` | Pose tembak | — | Siap pakai |
| `spin.vrma` | Berputar | — | Siap pakai |
| `model-pose.vrma` | Pose model | — | Siap pakai |
| `squat.vrma` | Jongkok | — | Siap pakai |
| `angry.vrma` | Marah | — | Siap pakai |
| `blush.vrma` | Merona/malu | — | Siap pakai |
| `clapping.vrma` | Bertepuk tangan | — | Siap pakai |
| `goodbye.vrma` | Pamitan | — | Siap pakai |
| `jump.vrma` | Melompat | — | Siap pakai |
| `look-around.vrma` | Melihat ke sekitar | — | Siap pakai |
| `relax.vrma` | Santai | — | Siap pakai |
| `sad.vrma` | Sedih | — | Siap pakai |
| `sleepy.vrma` | Mengantuk | — | Siap pakai |
| `surprised.vrma` | Terkejut | — | Siap pakai |
| `thinking.vrma` | Berpikir | — | Siap pakai |

Kolom **Dipakai** menandai animasi yang sudah dihubungkan ke kode.
Yang bertanda "Siap pakai" tinggal didaftarkan di
`src/character.js` → `createVRMAnimationPlayer(...)` lalu dipicu lewat
`triggerAction("nama-file")`.

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
