Repo: `belajar-svelte-dasar` · Branch: `feat/reactive-state` · Vite 8.3 · 2026-10-12

---

# Multi-Page dengan Vite

- Vite secara default hanya membangun `index.html`; halaman lain harus didaftarkan sendiri
- Tiap entry di `build.rolldownOptions.input` menghasilkan satu halaman beserta bundle JS-nya
- Key-nya jadi nama file output di `dist/`, value-nya path file HTML **relatif terhadap root proyek**
- Menambah halaman = dua langkah: buat file HTML-nya **di root**, lalu daftarkan entry-nya
- Di Vite 5–6 opsi ini bernama `rollupOptions`; `rolldownOptions` adalah namanya di Vite 8
- https://vite.dev/guide/build.html

```js
// vite.config.js
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

```js
// path dihitung dari root proyek, bukan dari src/
input: { counter: "counter.html" }        // file ada di root      ← dipakai di sini
input: { counter: "src/counter.html" }    // file ada di src/
```

---

# Mengakses Halaman di Dev Server

- Halaman selain index diakses lewat nama file-nya: `localhost:5173/counter.html`
- Dev server membaca langsung dari filesystem, jadi halaman bisa jalan walau belum terdaftar di `input`
- Akibatnya halaman bisa normal di `vite dev` tapi hilang setelah `vite build`
- Kalau halaman tidak muncul di `dist/`, yang pertama dicek adalah entry-nya di `input`
- https://vite.dev/guide/build.html

```
http://localhost:5173/              → index.html
http://localhost:5173/counter.html  → counter.html
http://localhost:5173/sayHello.html → sayHello.html
```
