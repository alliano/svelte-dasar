# Multi-Page dengan Vite
Secara default, Vite cuma membangun satu halaman saja yaitu `index.html`. Padahal di project ini ada beberapa halaman latihan yang berdiri sendiri-sendiri, jadi setiap halamanya harus kita daftarkan sebagai entry point terpisah.

Pendaftaranya dilakukan di `build.rolldownOptions.input` pada file `vite.config.js`. Setiap entry didalamnya bakal menghasilkan satu halaman HTML beserta bundle JS-nya sendiri. Untuk lebih detail nya bisa kunjungi disini https://vite.dev/guide/build.html
``` js
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

Vite akan memulai dari setiap file HTML yang ada didaftar itu, membaca tag `<script type="module">` didalamnya, lalu menelusuri seluruh rantai `import`-nya sampai habis, termasuk file `.svelte` dan `.css`.

Key-nya (`say_hello`) bakal jadi nama file output di folder `dist/`. Sedangkan value-nya adalah path file HTML-nya, yang dihitung **relatif terhadap root project** — bukan relatif terhadap `vite.config.js`, dan bukan juga terhadap folder `src/`.

Nah, bagian path inilah yang sempat bikin masalah di project ini. Di `input` sudah tertulis `counter: "counter.html"`, tapi file aslinya ada di `src/counter.html`. Akibatnya halaman counter nga bisa di-build, karena Vite nyarinya di root dan nga ketemu :
``` js
// file ada di root project
input: { counter: "counter.html" }

// file ada di dalam src/
input: { counter: "src/counter.html" }
```

Jadi setiap kali kita mau menambah halaman baru, ada dua langkah yang dua-duanya wajib : buat file HTML-nya **di root project** (sejajar dengan `index.html`), lalu daftarkan entry-nya di `input`.

Satu catatan soal penamaan, `rolldownOptions` itu nama opsi untuk bundler Rolldown yang dipakai Vite 8. Di Vite 5 sampai 6 yang masih pakai Rollup, opsi yang sama namanya `rollupOptions`. Isinya sama persis, cuma beda nama, jadi jangan bingung kalau nemu tutorial lama.

# Mengakses Halaman di Dev Server
Pas development, halaman selain index diakses lewat nama file-nya :
```
http://localhost:5173/              → index.html
http://localhost:5173/counter.html  → counter.html
http://localhost:5173/sayHello.html → sayHello.html
```

Yang perlu diwaspadai, dev server membaca langsung dari filesystem. Jadi sebuah halaman bisa aja kebuka normal pas `vite dev` walaupun belum didaftarkan di `input`, lalu hilang begitu kita jalankan `vite build`.

Kalau ada halaman yang jalan di dev tapi nga ada di folder `dist/`, hampir pasti entry-nya belum ditambahkan.
