# Dokumentasi Pembelajaran

Catatan konsep dari latihan Svelte 5 + Vite di repo ini. Tiap file membahas
satu area konsep: apa itu, cara kerjanya, kapan dibutuhkan, dan contoh
penggunaannya.

| Dokumen | Isi |
|---------|-----|
| [reactive-state.md](./reactive-state.md) | Reactive state, `$state()`, `$state()` dengan object, `bind:value` |
| [render-komponen.md](./render-komponen.md) | `mount()`, rantai `.html` → `.js` → `.svelte` |
| [sintaks-template.md](./sintaks-template.md) | Interpolasi `{...}`, event handler `onclick`, `<style>` ter-scope |
| [vite-multi-page.md](./vite-multi-page.md) | `build.rolldownOptions.input`, menambah halaman baru |

Versi yang jadi acuan: **Svelte 5.57**, **Vite 8.3** (lihat `package.json`).
Svelte 5 mengubah cukup banyak sintaks dari Svelte 4 — tiap dokumen menandai
bagian yang berbeda, supaya tutorial versi lama tidak bikin bingung.

---

## Yang Perlu Dibenahi

Temuan saat membaca kode latihan — belum diubah, biar jadi bahan latihan
berikutnya:

- **`src/lib/HelloSvelte.svelte` kosong**, tapi masih diimpor oleh
  `src/hello.js`. Jadi `hello.html` ter-build tanpa menampilkan apa pun.
  Isinya terhapus di commit `b8eb2be`.
- **Dua file dengan nama mirip:** `src/lib/Counter.svelte` (versi `$state`,
  yang dipakai) dan `src/lib/counter.svelte` (versi manipulasi DOM manual,
  sisa latihan). Di filesystem case-sensitive keduanya file berbeda, tapi ini
  rawan salah impor — sebaiknya yang lama dihapus atau diganti nama jadi
  `CounterManual.svelte` kalau mau disimpan sebagai pembanding.
- **Folder `dist/` ikut ter-commit.** Hasil build biasanya masuk
  `.gitignore`; isinya akan terus bikin diff tiap kali `vite build` jalan.
