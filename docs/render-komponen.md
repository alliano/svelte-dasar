Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · Svelte 5.57 · 2026-10-12

---

# Render Komponen ke Browser

- File `.svelte` tidak bisa dibuka browser langsung — harus ditempelkan ke sebuah elemen DOM
- `mount(Komponen, { target })` merender komponen ke dalam elemen yang ditunjuk
- Dipanggil sekali per halaman, hanya untuk komponen paling atas
- Komponen di dalam komponen tidak di-`mount()`, cukup diimpor lalu dipakai sebagai tag `<Counter />`
- Svelte 4 memakai `new Komponen({ target })` — sudah tidak berlaku di Svelte 5
- https://svelte.dev/docs/svelte/imperative-component-api

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

---

# Rantai File per Halaman

- Tiap halaman butuh tiga file: `.html` → `.js` (entry point) → `.svelte` (komponen)
- File `.html` cuma menyediakan `<div id="app">` kosong dan memuat entry JS-nya
- Seluruh isi `<div id="app">` datang dari `mount()` — jadi halaman blank total kalau entry-nya error
- Tulis `src` absolut (`/src/counter.js`), bukan relatif, supaya tetap benar ke mana pun halamannya dipindah
- https://vite.dev/guide/

```
counter.html  ──<script>──▶  src/counter.js  ──mount()──▶  src/lib/Counter.svelte
```

```html
<body>
  <div id="app"></div>
  <script type="module" src="/src/counter.js"></script>
</body>
```
