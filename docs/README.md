# Requirement
* Svelte 5.57
* Vite 8.3
* Node js

# Dokumentasi Pembelajaran
Ini adalah catatan belajar Svelte 5 + Vite dari project `belajar-svelte-dasar`. Setiap dokumen membahas satu area konsep, lengkap dengan contoh kodenya.

* [reactive-state.md](./reactive-state.md) — `$state()` dengan object dan array, `$derived()`, `$state.raw()`, `bind:value`
* [render-komponen.md](./render-komponen.md) — `mount()`, rantai file `.html` → `.js` → `.svelte`
* [sintaks-template.md](./sintaks-template.md) — interpolasi, event handler, scoped style
* [vite-multi-page.md](./vite-multi-page.md) — `build.rolldownOptions.input`, akses halaman di dev server

Versi yang jadi acuan adalah **Svelte 5.57** dan **Vite 8.3** (bisa dicek di `package.json`). Svelte 5 cukup banyak mengubah sintaks dari Svelte 4, jadi bagian-bagian yang berbeda ditandai di tiap dokumen supaya tutorial versi lama nga bikin bingung.

# Yang Perlu Dibenahi
Beberapa hal yang kebetulan ketemu saat membaca kode latihanya, belum diubah :

* `src/lib/HelloSvelte.svelte` isinya kosong, tapi masih di-import oleh `src/hello.js`. Jadi `hello.html` ter-build tanpa menampilkan apapun. Isinya kehapus di commit `b8eb2be`.
* Ada dua file yang namanya cuma beda kapital : `src/lib/Counter.svelte` (versi `$state`, yang dipakai) dan `src/lib/counter.svelte` (versi DOM manual, sisa latihan). Rawan salah import, mending dihapus atau diganti nama jadi `CounterManual.svelte` kalau mau disimpan sebagai pembanding.
* Folder `dist/` ikut ter-commit. Hasil build biasanya masuk `.gitignore`, kalau nga isinya bakal terus bikin diff setiap kali `vite build` jalan.
