# Multi-Page dengan Vite

Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · 2026-10-12
Vite 8.3

---

**Vite secara default membangun satu halaman saja** (`index.html`). Repo ini
berisi beberapa halaman latihan yang berdiri sendiri, jadi setiap halaman
harus didaftarkan sebagai entry point terpisah.

---

## `build.rolldownOptions.input`

**`input` adalah** daftar titik awal build. Setiap entry di dalamnya
menghasilkan satu halaman HTML beserta bundle JS-nya sendiri.

```js
// vite.config.js
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [svelte()],
  build: {
    rolldownOptions: {
      input: {
        index:     "index.html",
        hello:     "hello.html",
        counter:   "counter.html",
        say_hello: "sayHello.html"
      }
    }
  }
})
```

### Cara kerjanya

Vite memulai dari setiap file HTML di daftar itu, membaca tag
`<script type="module">` di dalamnya, lalu menelusuri seluruh rantai
`import` dari sana — termasuk file `.svelte` dan `.css`. Hasilnya satu bundle
per entry, dengan dependency yang dipakai bersama dipecah jadi chunk terpisah.

**Key-nya** (`say_hello`) jadi nama file output di `dist/`. **Value-nya**
adalah path file HTML-nya, dihitung **relatif terhadap root proyek** — bukan
relatif terhadap `vite.config.js`, dan bukan terhadap `src/`.

Di luar daftar `input`, halamannya tidak diproses sama sekali: saat `vite
build` dia tidak muncul di `dist/`.

### Kapan dibutuhkan

Setiap kali menambah halaman latihan baru. Urutannya dua langkah, dan
keduanya wajib:

1. Buat file HTML-nya **di root proyek** (sejajar `index.html`).
2. Tambahkan entry-nya di `input`.

### Gotcha: path dihitung dari root proyek

Ini yang sempat jadi masalah di repo ini. `input` sudah menyebut
`counter: "counter.html"`, tapi file aslinya ada di `src/counter.html`.
Akibatnya halaman counter tidak bisa di-build — Vite mencari `counter.html`
di root dan tidak menemukannya. Perbaikannya: file-nya dipindah ke root,
bukan config-nya yang diubah, supaya seragam dengan halaman lain.

Dua opsi yang sebaiknya tidak dicampur:

```js
input: { counter: "counter.html" }        // file di root        ← dipakai di sini
input: { counter: "src/counter.html" }    // file di src/
```

> **Catatan:** `rolldownOptions` adalah nama opsi untuk bundler Rolldown yang
> dipakai Vite 8. Di Vite 5–6 dengan Rollup, opsi yang sama bernama
> `rollupOptions`. Tutorial lama hampir pasti menyebut `rollupOptions` —
> isinya sama, namanya saja berbeda.

---

## Mengakses halaman saat development

Di `vite dev`, halaman non-index diakses lewat nama file-nya:

```
http://localhost:5173/              → index.html
http://localhost:5173/counter.html  → counter.html
http://localhost:5173/sayHello.html → sayHello.html
```

Dev server membaca langsung dari filesystem, jadi sebuah halaman bisa saja
terbuka di dev meski belum didaftarkan di `input` — lalu hilang begitu
`vite build`. Kalau halaman jalan di dev tapi tidak ada di `dist/`, hampir
pasti entry-nya belum ditambahkan.
