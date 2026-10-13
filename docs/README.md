# Requirement
* Svelte 5.57
* Vite 8.3
* Node js

# Dokumentasi Pembelajaran
Ini adalah catatan belajar Svelte 5 + Vite dari project `belajar-svelte-dasar`. Setiap dokumen membahas satu area konsep, lengkap dengan contoh kodenya.

* [reactive-state.md](./reactive-state.md) — `$state()` dengan object dan array, `$derived()`, `$derived.by()`, `$state.raw()`, `$inspect()`, `bind:value`
* [render-komponen.md](./render-komponen.md) — `mount()`, script komponen yang cuma jalan sekali, rantai file `.html` → `.js` → `.svelte`
* [sintaks-template.md](./sintaks-template.md) — interpolasi, event handler, scoped style
* [global-state.md](./global-state.md) — state diluar komponen lewat file `.svelte.js`, aturan export-nya
* [vite-multi-page.md](./vite-multi-page.md) — `build.rolldownOptions.input`, akses halaman di dev server

Versi yang jadi acuan adalah **Svelte 5.57** dan **Vite 8.3** (bisa dicek di `package.json`). Svelte 5 cukup banyak mengubah sintaks dari Svelte 4, jadi bagian-bagian yang berbeda ditandai di tiap dokumen supaya tutorial versi lama nga bikin bingung.

# Yang Perlu Dibenahi
Beberapa hal yang kebetulan ketemu saat membaca kode latihanya, belum diubah :

* `src/lib/HelloSvelte.svelte` isinya kosong, tapi masih di-import oleh `src/hello.js`. Jadi `hello.html` ter-build tanpa menampilkan apapun. Isinya kehapus di commit `b8eb2be`.
* `global-counter.html` belum didaftarkan di `input` pada `vite.config.js`. Halamanya bakal jalan normal pas `vite dev`, tapi hilang begitu di-`vite build`. Lihat [vite-multi-page.md](./vite-multi-page.md).
* Di `src/lib/Counter.svelte` baris 2 ada komentar `//` yang posisinya **diluar** tag `<script>`. Diluar `<script>` itu konteksnya markup, jadi `//` nga dianggap komentar dan teksnya ikut ke-render di halaman. Kalau mau nulis komentar disitu, pakai `<!-- ... -->`, atau dipindah kedalam `<script>`.
