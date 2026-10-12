# Render Komponen ke Browser

Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · 2026-10-12
Svelte 5.57

---

**File `.svelte` bukan sesuatu yang bisa dibuka browser.** Dia dikompilasi
jadi JavaScript, dan harus ada kode yang secara eksplisit menempelkan hasilnya
ke sebuah elemen di halaman. Rantainya tiga lapis:

```
counter.html  ──<script>──▶  src/counter.js  ──mount()──▶  src/lib/Counter.svelte
   halaman                     entry point                    komponen
```

Masing-masing punya satu tugas:

| Lapis | Tugas |
|-------|-------|
| `.html` | menyediakan `<div id="app">` sebagai tempat kosong, dan memuat entry JS |
| `.js` | menyambungkan komponen ke elemen tersebut |
| `.svelte` | isi dan logika komponennya |

---

## mount()

**`mount()` adalah** fungsi dari paket `svelte` yang mengambil sebuah komponen
dan merender isinya ke dalam elemen DOM yang kita tunjuk.

```js
// src/counter.js
import { mount } from "svelte";
import Counter from "./lib/Counter.svelte";
import "./app.css";

const app = mount(Counter, {
  target: document.getElementById("app")
});

export default app;
```

### Cara kerjanya

`mount()` menerima dua argumen: komponennya, dan sebuah object opsi yang
wajib berisi `target`.

Saat dipanggil, Svelte menjalankan kode hasil compile komponen tersebut:
membuat element-element yang dideskripsikan di markup, memasang event
listener, mendaftarkan dependency reaktifnya, lalu menyisipkan semuanya
**ke dalam** `target`. Elemen `target` sendiri tidak dihapus — isinya yang
diisi.

Nilai kembaliannya adalah instance komponen. Instance ini yang nanti dipakai
kalau kita perlu membongkar komponennya lagi lewat `unmount(app)`. Untuk
halaman latihan sekali-render seperti di sini, nilainya memang belum terpakai
— cukup di-`export default` saja.

Karena `target` dicari dengan `document.getElementById("app")`, elemen itu
harus sudah ada saat script jalan. Itu sebabnya `<script type="module">`
aman dipakai di `<head>` maupun setelah `<div>`: module script selalu
ditunda sampai HTML selesai diparse.

### Kapan dibutuhkan

Satu kali per halaman, di file entry, untuk komponen **paling atas** saja.

Komponen di dalam komponen tidak pernah di-`mount()` — cukup diimpor lalu
dipakai sebagai tag:

```svelte
<script>
  import Counter from "./lib/Counter.svelte";
</script>

<Counter />
```

### Beda dengan Svelte 4

Di Svelte 4 komponen dirender dengan `new`:

```js
// Svelte 4 — sudah tidak dipakai di Svelte 5
const app = new Counter({
  target: document.getElementById("app")
});
```

Di Svelte 5 komponen bukan lagi class, jadi `new Component()` tidak berlaku.
Kalau menemukan tutorial dengan pola `new`, itu materi versi lama — padanannya
adalah `mount()`.

---

## Struktur file HTML halaman

Setiap halaman latihan isinya sama, yang berbeda hanya entry JS yang dimuat:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>belajar-svelte-dasar</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/counter.js"></script>
  </body>
</html>
```

`<div id="app">` sengaja dibiarkan kosong — seluruh isinya datang dari
`mount()`. Inilah kenapa halaman tampak blank kalau entry JS-nya error:
tidak ada konten statis yang bisa jadi fallback.

> **Catatan:** `src` sebaiknya ditulis absolut (`/src/counter.js`), bukan
> relatif (`./src/counter.js`). Yang absolut selalu dihitung dari root
> proyek, jadi tetap benar ke mana pun halamannya dipindah.

Untuk mendaftarkan halaman baru ke build, lihat [vite-multi-page.md](./vite-multi-page.md).
