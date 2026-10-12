# Render Komponen ke Browser
File `.svelte` itu bukan sesuatu yang bisa dibuka langsung oleh browser. Dia dikompilasi dulu jadi JavaScript, lalu harus ada kode yang secara eksplisit menempelkan hasilnya ke sebuah elemen di halaman.

Untuk melakukanya kita menggunakan `mount()` dari package `svelte`. Fungsi ini menerima dua argumen : komponenya, dan sebuah object opsi yang wajib berisi `target`. Untuk lebih detail nya bisa kunjungi disini https://svelte.dev/docs/svelte/imperative-component-api
``` js
// src/counter.js
import { mount } from "svelte";
import Counter from "./lib/Counter.svelte";
import "./app.css";

const app = mount(Counter, {
  // komponen akan dirender kedalam elemen ini
  target: document.getElementById("app")
});

export default app;
```

Saat `mount()` dipanggil, Svelte menjalankan kode hasil compile komponenya : membuat element-elementnya, memasang event listener, mendaftarkan dependency reaktifnya, lalu menyisipkan semuanya **kedalam** `target`. Elemen `target`-nya sendiri nga dihapus, cuma isinya yang diisi.

Nilai kembalianya adalah instance komponen, yang nanti dipakai kalau kita perlu membongkar komponenya lagi lewat `unmount(app)`. Untuk halaman latihan yang cuma sekali render seperti ini, nilainya memang belum kepakai, jadi cukup di-`export default` saja.

`mount()` cuma dipanggil sekali per halaman, dan cuma untuk komponen yang paling atas. Komponen yang ada didalam komponen lain nga pernah di-`mount()`, cukup kita import lalu dipakai sebagai tag :
``` svelte
<script>
  import Counter from "./lib/Counter.svelte";
</script>

<Counter />
```

Satu hal yang perlu diperhatikan, di Svelte 4 komponen dirender menggunakan `new` seperti dibawah ini. Di Svelte 5 komponen bukan class lagi, jadi cara ini sudah nga berlaku. Kalau nemu tutorial dengan pola `new`, berarti itu materi versi lama :
``` js
// Svelte 4, sudah tidak dipakai di Svelte 5
const app = new Counter({
  target: document.getElementById("app")
});
```

# Rantai File per Halaman
Setiap halaman di project ini butuh tiga file yang saling nyambung :
* file `.html` sebagai halamanya
* file `.js` sebagai entry point
* file `.svelte` sebagai komponenya

Alurnya seperti ini :
```
counter.html  ──<script>──▶  src/counter.js  ──mount()──▶  src/lib/Counter.svelte
```

File HTML-nya sendiri isinya minim sekali. Dia cuma menyediakan `<div id="app">` yang kosong, lalu memuat entry JS-nya :
``` html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>belajar-svelte-dasar</title>
  </head>
  <body>
    <!-- dibiarkan kosong, isinya datang dari mount() -->
    <div id="app"></div>
    <script type="module" src="/src/counter.js"></script>
  </body>
</html>
```

Karena seluruh isi `<div id="app">` datang dari `mount()`, halamanya akan blank total kalau entry JS-nya error. Nga ada konten statis yang bisa jadi fallback, jadi kalau halaman tiba-tiba putih, yang pertama dibuka adalah console.

Untuk atribut `src`-nya, lebih aman ditulis absolut (`/src/counter.js`) daripada relatif (`./src/counter.js`). Yang absolut selalu dihitung dari root project, jadi tetap benar kemanapun halamanya dipindah.

Untuk mendaftarkan halaman baru supaya ikut ter-build, bisa dilihat di [vite-multi-page.md](./vite-multi-page.md).
