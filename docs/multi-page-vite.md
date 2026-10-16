# Satu Repo, Banyak Halaman Latihan

Catatan dari repo `belajar-svelte-dasar` (branch `feat/branching`, 16 Oktober 2026,
Svelte `^5.57.0`, Vite `^8.3.0`).

Karena repo ini isinya latihan, akan ribet kalau tiap materi baru harus bikin repo
atau bongkar `App.svelte` yang sudah ada. Lebih enak kalau tiap materi punya halaman
sendiri, dan Vite memang mendukung multi-page.

# Entry Point Halaman Baru

Satu halaman latihan butuh tiga berkas. Pertama file HTML di root yang menyediakan
element kosong sebagai tempat component kita dipasang, lalu memuat script-nya.

``` html
<body>
  <!-- tempat component Svelte akan di-mount -->
  <div id="app"></div>
  <script type="module" src="/src/todo.js"></script>
</body>
```

Kedua, file JavaScript yang memasang component ke element tadi memakai function
`mount()` dari Svelte 5. Untuk lebih detail nya bisa kunjungi disini
https://svelte.dev/docs/svelte/imperative-component-api

``` js
import { mount } from "svelte";
import "./app.css";
import TodoApp from "./lib/TodoApp.svelte";

const app = mount(TodoApp, {
  // harus cocok dengan id di todo.html
  target: document.getElementById("app")
});

export default app;
```

Dan yang ketiga component-nya sendiri, disini `src/lib/TodoApp.svelte`.

# Mendaftarkan Entry ke Vite

Saat `npm run dev` halaman baru sebenarnya sudah bisa dibuka lewat `/todo.html`.
Namun ketika di-build, Vite hanya mengikuti `index.html` saja, jadi halaman lain tidak
ikut terbawa. Karena itu setiap halaman harus didaftarkan sebagai input di config.

``` js
export default defineConfig({
  plugins: [svelte()],
  build: {
    rolldownOptions: {
      input: {
        index: "index.html",
        hello: "hello.html",
        // halaman baru harus ditambahkan disini juga
        todo: "todo.html"
      }
    }
  }
})
```

Key pada object `input` menjadi nama berkas hasil build, sedangkan value-nya adalah
path HTML-nya. Perlu dicatat bahwa `rolldownOptions` dipakai karena Vite 8 memakai
Rolldown sebagai bundler; pada Vite versi sebelumnya opsi yang sama bernama
`rollupOptions`. Untuk lebih detail nya bisa kunjungi disini
https://vite.dev/guide/build#multi-page-app

# Folder public

Kadang kita butuh berkas yang bisa diakses lewat URL apa adanya, misalnya file JSON
yang mau kita `fetch` untuk latihan. Kalau kita menaruhnya di dalam `src/`, berkas itu
akan diproses Vite dan nama berkas hasil build-nya ikut diberi hash, jadi URL-nya
tidak bisa kita tebak.

Untuk kasus seperti itu berkasnya ditaruh di folder `public/`. Isi folder tersebut
disalin apa adanya ke root hasil build, jadi `public/article.json` bisa diakses
sebagai `/article.json`. Untuk lebih detail nya bisa kunjungi disini
https://vite.dev/guide/assets#the-public-directory

``` js
// public/article.json diakses dari root, tanpa prefix "public"
let response = await fetch("/article.json");

// SALAH: path-nya tidak pernah mengandung folder public
let response = await fetch("/public/article.json");
```
